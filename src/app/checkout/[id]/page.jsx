"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/formatters';
import Toast from '@/components/ui/Toast';
import { useCart } from '@/context/CartContext';

// Utilizing unified Next.js API routing.


export default function CheckoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();

  const isCartCheckout = id === 'cart';

  const [checkoutStep, setCheckoutStep] = useState('form');
  const [toast, setToast] = useState({ show: false, message: "" });
  const [paymentMode, setPaymentMode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(!isCartCheckout);

  useEffect(() => {
    if (!isCartCheckout) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`/api/products/${id}`);
          if (res.ok) {
            const data = await res.json();
            setProduct(data);
          }
        } catch (error) {
          console.error("Error fetching product for checkout:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isCartCheckout]);

  const checkoutItems = isCartCheckout ? cart : product ? [{ product, quantity: 1 }] : [];

  const actualItemsTotal = checkoutItems.reduce((total, item) => total + ((item.product.originalPrice || item.product.price) * item.quantity), 0);
  const itemsTotal = checkoutItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const discount = actualItemsTotal > itemsTotal ? actualItemsTotal - itemsTotal : 0;

  const shippingCharge = 0;
  const codCharge = paymentMode === 'Cash On Delivery' ? 70 : 0;
  const checkoutTotal = actualItemsTotal + shippingCharge + (Math.abs(codCharge) - Math.abs(discount));

  useEffect(() => {
    window.scrollTo(0, 0);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-ivory text-dark pt-32 pb-24 px-6">
        <h2 className="text-xl font-display font-bold">Loading Checkout...</h2>
      </div>
    );
  }

  // if (checkoutItems.length === 0) {
  //   return (
  //     <div className="min-h-screen flex flex-col items-center justify-center bg-ivory text-dark">
  //       <h2 className="text-2xl font-bold mb-4 font-display">Your selection is empty.</h2>
  //       <button onClick={() => navigate('/products')} className="px-8 py-3 bg-dark text-white rounded text-sm uppercase tracking-widest font-semibold hover:bg-gold transition">
  //         Return to Collection
  //       </button>
  //     </div>
  //   );
  // }

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    if (checkoutItems.length === 0) {
      showToast("Your cart is empty. Please add items to proceed.");
      return;
    }

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (!data.name || !data.email || !data.phone || !data.address || !data.city || !data.pincode) {
      showToast("Missing information! Please complete your shipping details.");
      return;
    }

    if (!paymentMode) {
      showToast("Please choose a payment method to confirm your order.");
      return;
    }

    setIsProcessing(true);

    if (paymentMode === 'Prepaid') {
      try {
        showToast("Processing Secure UPI Request...");
        const res = await fetch(`/api/payment/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: checkoutTotal })
        });

        const dataRes = await res.json();

        if (!dataRes.success) {
          setIsProcessing(false);
          showToast("Payment Server Unavailable. Try again.");
          return;
        }

        const options = {
          key: dataRes.key_id,
          amount: dataRes.amount,
          currency: dataRes.currency,
          name: "Pitchico Store",
          description: "Premium Smart Essentials",
          order_id: dataRes.order_id,
          prefill: {
            name: data.name,
            email: data.email,
            contact: data.phone
          },
          handler: async function (response) {
            showToast("Payment Successful! Finalizing Order...");
            await finalizeOrder(data, response.razorpay_payment_id);
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            }
          },
          theme: {
            color: "#1a1a1a"
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setIsProcessing(false);
          showToast(`Payment Failed: ${response.error.description}`);
        });
        rzp.open();

      } catch (error) {
        setIsProcessing(false);
        console.error("Razorpay Integration Error:", error);
        showToast("Something went wrong with Payment Gateway");
      }
    } else {
      // Cash on Delivery
      await finalizeOrder(data);
    }
  };

  const finalizeOrder = async (data, paymentId = null) => {
    // --- Backend API Call to Save to MongoDB & Send Email --- //
    try {
      const payload = {
        customer: { name: data.name, email: data.email, phone: data.phone },
        shipping: { address: data.address, city: data.city, pincode: data.pincode },
        paymentMethod: paymentMode === 'Prepaid' ? `Prepaid (Razorpay: ${paymentId})` : 'Cash On Delivery',
        totalAmount: checkoutTotal,
        items: checkoutItems.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.images[0]
        }))
      };

      await fetch(`/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error("Failed to save to Database:", error);
    }

    setIsProcessing(false);
    if (isCartCheckout) clearCart();
    setCheckoutStep('success');
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-12 flex justify-center bg-ivory animate-[fadeIn_0.5s_ease-out]">
      <div className="w-full max-w-xl">
        <button onClick={() => router.back()} className="hidden mb-6 md:mb-8 text-gray-500 hover:text-gold md:flex items-center gap-2 transition-colors uppercase tracking-widest text-[10px] md:text-xs font-semibold">
          <span>&larr;</span> Back
        </button>

        <div className={`bg-white p-6 md:p-10 rounded-2xl md:rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 ${checkoutStep === "success" ? "filter blur-sm opacity-50 pointer-events-none" : ""}`}>
          <div className="text-center mb-8 md:mb-10">
            <h3 className="text-3xl md:text-4xl font-display font-bold text-dark mb-2">Complete Your Order</h3>
            <p className="text-gray-500 mb-4 text-sm md:text-base">
              {checkoutItems.length === 1 ? checkoutItems[0].product.name : `${checkoutItems.length} items in your order`}
            </p>

            <div className="text-xs md:text-sm font-semibold tracking-widest text-gold bg-gold/10 px-4 py-1.5 rounded-full inline-block mt-2">
              EXPRESS CHECKOUT
            </div>
          </div>

          <form onSubmit={handleCheckoutSubmit} className="space-y-6 md:space-y-8">

            <div>
              <h4 className="text-[11px] md:text-xs font-bold tracking-widest uppercase text-gold mb-3 md:mb-4 border-b border-gray-100 pb-2">1. Personal Details</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] md:text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1.5 ml-1">Full Name</label>
                  <input name="name" required className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all text-sm text-dark placeholder-gray-300 shadow-sm hover:border-gray-300" placeholder="e.g. John Doe" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] md:text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1.5 ml-1">Email Address</label>
                    <input name="email" type="email" required className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all text-sm text-dark placeholder-gray-300 shadow-sm hover:border-gray-300" placeholder="e.g. john@example.com" />
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1.5 ml-1">Phone Number</label>
                    <input name="phone" type="tel" required className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all text-sm text-dark placeholder-gray-300 shadow-sm hover:border-gray-300" placeholder="e.g. +91 9876543210" />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div>
              <h4 className="text-[11px] md:text-xs font-bold tracking-widest uppercase text-gold mb-3 md:mb-4 border-b border-gray-100 pb-2">2. Shipping Details</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] md:text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1.5 ml-1">Full Address</label>
                  <textarea name="address" required rows="2" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all resize-none text-sm text-dark placeholder-gray-300 shadow-sm hover:border-gray-300" placeholder="House No, Street, Landmark"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] md:text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1.5 ml-1">City / Town</label>
                    <input name="city" required className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all text-sm text-dark placeholder-gray-300 shadow-sm hover:border-gray-300" placeholder="e.g. Kochi" />
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1.5 ml-1">Postal Code</label>
                    <input name="pincode" required className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all text-sm text-dark placeholder-gray-300 shadow-sm hover:border-gray-300" placeholder="e.g. 682001" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h4 className="text-[11px] md:text-xs font-bold tracking-widest uppercase text-gold mb-3 md:mb-4 border-b border-gray-100 pb-2">3. Payment</h4>
              <div className="space-y-3">
                <label className="block text-[10px] md:text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2 ml-1">Select Payment Method</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Prepaid Radio Card */}
                  <label className={`relative flex flex-col p-4 border rounded-xl cursor-pointer hover:border-gold/50 transition-all ${paymentMode === 'Prepaid' ? 'border-gold bg-gold/5 shadow-sm' : 'border-gray-200 bg-gray-50/50'}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="paymentMethod" value="Prepaid" required checked={paymentMode === 'Prepaid'} onChange={(e) => setPaymentMode(e.target.value)} className="w-4 h-4 text-gold focus:ring-gold border-gray-300 pointer-events-none" />
                        <span className="font-bold text-sm text-dark tracking-wide">Prepaid (UPI / Cards)</span>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 ${paymentMode === 'Prepaid' ? 'text-gold' : 'text-gray-400'}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    <span className="text-[11px] text-green-600 font-semibold ml-7 tracking-wide">Most Secure • Free Delivery</span>
                  </label>

                  {/* COD Radio Card */}
                  <label className={`relative flex flex-col p-4 border rounded-xl cursor-pointer hover:border-gold/50 transition-all ${paymentMode === 'Cash On Delivery' ? 'border-gold bg-gold/5 shadow-sm' : 'border-gray-200 bg-gray-50/50'}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="paymentMethod" value="Cash On Delivery" required checked={paymentMode === 'Cash On Delivery'} onChange={(e) => setPaymentMode(e.target.value)} className="w-4 h-4 text-gold focus:ring-gold border-gray-300 pointer-events-none" />
                        <span className="font-bold text-sm text-dark tracking-wide">Cash On Delivery</span>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 ${paymentMode === 'Cash On Delivery' ? 'text-gold' : 'text-gray-400'}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                      </svg>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium ml-7 tracking-wide">+Rs. 70 standard handling charge.</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 4. Payment Breakdown Validation */}
            <div className="bg-gray-50/70 p-6 md:p-8 rounded-2xl border border-gray-100 shadow-inner">
              <h4 className="text-[11px] md:text-xs font-bold tracking-widest uppercase text-dark mb-5 border-b border-gray-200 pb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                Order Summary
              </h4>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Actual Amount ({checkoutItems.length} items)</span>
                  <span className="text-gray-400 line-through">{formatCurrency(actualItemsTotal)}</span>
                </div>


                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Shipping Charge</span>
                  <span>{shippingCharge === 0 ? <span className=" font-bold tracking-widest text-[12px] uppercase px-2 py-1 rounded">Free</span> : <span className="text-dark font-semibold">{formatCurrency(shippingCharge)}</span>}</span>
                </div>

                {paymentMode === 'Cash On Delivery' && (
                  <div className="flex justify-between text-sm text-gray-500 font-medium animate-[fadeIn_0.3s_ease-out]">
                    <span>COD Handling Charge</span>
                    <span className="font-bold">+{formatCurrency(codCharge)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-gray-500 text-sm font-medium">
                    <span>Pitchico Deal Saving</span>
                    <span className="font-bold">-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between  text-sm text-dark font-semibold pt-2 mt-2 border-t border-gray-100 border-dashed">
                  <span>Offer Subtotal</span>
                  <span>{formatCurrency(itemsTotal)}</span>
                </div>

              </div>
              <div className="flex justify-between items-center pt-5 border-t border-gray-200">
                <span className="text-base md:text-lg font-bold text-dark tracking-wide">Grand Total</span>
                <div className="text-right">
                  <div className="text-xl md:text-2xl font-bold text-gold">{formatCurrency(checkoutTotal)}</div>
                  <div className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">Includes all taxes</div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={checkoutStep === 'success' || isProcessing} className="w-full flex items-center justify-center gap-3 py-4 md:py-4 bg-dark hover:bg-gold text-white font-bold tracking-widest text-sm uppercase rounded-xl transition-all duration-500 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(201,162,39,0.5)] group disabled:opacity-80 disabled:cursor-wait disabled:hover:translate-y-0 disabled:hover:shadow-none">
                {isProcessing ? (
                  <div className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing Vault...</span>
                  </div>
                ) : (
                  <>
                    <span>Confirm Order : {formatCurrency(checkoutTotal)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* Professional Success Modal Overlay */}
      {checkoutStep === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white w-full max-w-md p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden transform scale-100 transition-all">

            {/* Decorative background element */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-50 to-white/0 opacity-50 pointer-events-none"></div>

            <div className="relative z-10 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-green-50 text-green-500 flex items-center justify-center text-3xl md:text-4xl mx-auto mb-6 border-[4px] border-green-100 shadow-sm animate-[scaleIn_0.4s_ease-out]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>

              <h4 className="text-2xl md:text-3xl font-display font-bold text-dark mb-3">Order Confirmed!</h4>

              {paymentMode === 'Prepaid' ? (
                <p className="text-gray-500 mb-8 leading-relaxed text-sm md:text-base">
                  Thank you for your purchase. Your premium order has been successfully placed <span className="text-green-600 font-semibold">and paid</span> and is now being processed for dispatch.
                </p>
              ) : (
                <p className="text-gray-500 mb-8 leading-relaxed text-sm md:text-base">
                  Thank you for your purchase. Your order has been successfully placed. Please keep the cash ready at the time of delivery.
                </p>
              )}

              {/* {paymentMode === 'Prepaid' && (
                <div className="bg-gray-50 p-4 rounded-2xl mb-8 border border-gray-100 flex items-center justify-between shadow-inner">
                   <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">
                     Total Paid
                   </span>
                   <span className="font-bold text-dark text-lg md:text-xl">{formatCurrency(checkoutTotal)}</span>
                </div>
              )} */}

              <button
                onClick={() => router.push('/products')}
                className="w-full flex items-center justify-center py-4 bg-dark text-white font-medium tracking-widest uppercase text-xs md:text-sm rounded-xl hover:bg-gold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Return to Collection
              </button>
            </div>
          </div>
        </div>
      )}
      <Toast toast={toast} />
    </div>
  );
}
