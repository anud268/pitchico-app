const nodemailer = require('nodemailer');

const sendOrderEmail = async (orderData) => {
    try {
        // Create reusable transporter object using SSL/TLS
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS 
            }
        });

        // ==========================================
        // 1. ADMIN EMAIL NOTIFICATION
        // ==========================================
        const adminItemsList = orderData.items.map((item, i) => {
            return `📍 ITEM ${i + 1}:
  - Product: ${item.name}
  - Quantity: ${item.quantity}
  - Price: Rs. ${item.price}`;
        }).join('\n\n');

        const adminMessageBody = `🌟 PITCHICO NEW ORDER RECEIVED 🌟\n--------------------------------------\nOrder Reference: #${orderData.orderId}\nOrder Date: ${new Date().toLocaleString()}\n\n💰 ORDER SUMMARY\n--------------------------------------\nGrand Total: Rs. ${orderData.totalAmount}\nPayment Method: ${orderData.paymentMethod}\n\n👤 CUSTOMER DETAILS\n--------------------------------------\nName: ${orderData.customer.name}\nPhone: ${orderData.customer.phone}\nEmail: ${orderData.customer.email}\n\n📦 SHIPPING ADDRESS\n--------------------------------------\nAddress: ${orderData.shipping.address}\nCity: ${orderData.shipping.city}\nPincode: ${orderData.shipping.pincode}\n\n🛒 PRODUCTS ACQUIRED\n--------------------------------------\n${adminItemsList}\n\n--------------------------------------\nSystem Generated Email from Pitchico NextGen.`;

        // Send Email to Admin
        await transporter.sendMail({
            from: `<${process.env.EMAIL_USER}>`, 
            to: "admin.pitchico@gmail.com", 
            subject: `🎉 New Order Received! [#${orderData.orderId}] - Rs.${orderData.totalAmount}`, 
            text: adminMessageBody
        });


        // ==========================================
        // 2. CUSTOMER HTML RECEIPT EMAIL
        // ==========================================
        const customerItemsHtml = orderData.items.map(item => `
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 12px 0;">
                <div style="text-align: left;">
                    <p style="margin: 0; font-weight: bold; color: #333; font-size: 15px;">${item.name}</p>
                    <p style="margin: 4px 0 0; font-size: 13px; color: #777;">Quantity: ${item.quantity} × Rs. ${item.price}</p>
                </div>
                <div style="font-weight: bold; color: #1a1a1a; font-size: 15px; margin-top: 2px;">
                    Rs. ${item.price * item.quantity}
                </div>
            </div>
        `).join('');

        const customerHtmlTemplate = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
            
            <!-- Header section -->
            <div style="text-align: center; border-bottom: 2px solid #C9A227; padding-bottom: 25px; margin-bottom: 30px;">
                <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; letter-spacing: 1px;">PITCHICO</h1>
                <p style="color: #C9A227; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin-top: 8px; font-weight: bold;">Order Confirmed</p>
            </div>
            
            <!-- Greeting -->
            <div style="margin-bottom: 25px;">
                <p style="font-size: 16px; color: #333; margin-bottom: 8px;">Hi <strong>${orderData.customer.name}</strong>,</p>
                <p style="font-size: 15px; color: #555; line-height: 1.6; margin: 0;">Thank you for your premium purchase from Pitchico! Your order <strong>#${orderData.orderId}</strong> has been successfully placed and is being processed for expedited dispatch.</p>
            </div>

            <!-- Order Summary Box -->
            <div style="background-color: #fcfcfc; padding: 25px; border-radius: 10px; border: 1px solid #f0f0f0; margin-bottom: 30px;">
                <h3 style="color: #1a1a1a; border-bottom: 1px solid #e5e5e5; padding-bottom: 15px; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Order Summary</h3>
                
                ${customerItemsHtml}
                
                <div style="display: flex; justify-content: space-between; margin-top: 20px; font-size: 18px; font-weight: bold; color: #C9A227;">
                    <span>Grand Total:</span>
                    <span>Rs. ${orderData.totalAmount}</span>
                </div>
                <div style="margin-top: 8px; font-size: 13px; color: #666; display: flex; justify-content: space-between;">
                    <span>Payment Method:</span>
                    <strong>${orderData.paymentMethod}</strong>
                </div>
            </div>

            <!-- Shipping Info -->
            <div style="margin-bottom: 30px; padding: 0 5px;">
                <h4 style="font-size: 13px; text-transform: uppercase; color: #888; letter-spacing: 1px; margin-bottom: 10px;">Shipping To:</h4>
                <p style="color: #444; font-size: 14px; line-height: 1.5; margin: 0;">
                    ${orderData.shipping.address}<br>
                    ${orderData.shipping.city} - ${orderData.shipping.pincode}
                </p>
            </div>

            <!-- Footer Message -->
            <div style="text-align: center; margin-top: 35px; padding-top: 25px; border-top: 1px solid #eaeaea;">
                <p style="color: #444; font-size: 16px; font-weight: bold; margin-bottom: 8px;">Thank you for shopping with Pitchico!</p>
                <p style="color: #777; font-size: 14px; margin: 0;">For future purchases and to explore our latest collections, visit <a href="https://pitchico.com" style="color: #C9A227; text-decoration: none; font-weight: bold;">pitchico.com</a></p>
            </div>
        </div>
        `;

        if (orderData.customer.email) {
            await transporter.sendMail({
                from: `"Pitchico Store" <${process.env.EMAIL_USER}>`, 
                to: orderData.customer.email, 
                subject: `Pitchico Order Confirmed - #${orderData.orderId}`, 
                html: customerHtmlTemplate
            });
            console.log(`Customer Receipt Email Sent to: ${orderData.customer.email}`);
        }

        return true;
    } catch (error) {
        console.error("Order Email Error:", error);
        return false;
    }
};

module.exports = {
    sendOrderEmail
};
