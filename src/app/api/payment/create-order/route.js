import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req) {
  try {
    const { amount, currency = "INR" } = await req.json();

    if (!amount) {
      return NextResponse.json({ success: false, message: 'Amount is required' }, { status: 400 });
    }

    let razorpayInstance;
    try {
      razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    } catch (error) {
      console.error('Razorpay initialization failed:', error);
      return NextResponse.json({ success: false, message: 'Razorpay initialization failed' }, { status: 500 });
    }

    const options = {
      amount: amount * 100, // Razorpay takes amount in smallest currency unit (paise)
      currency,
      receipt: `RCPT_${Math.floor(Date.now() / 1000)}`,
    };

    const order = await razorpayInstance.orders.create(options);
    
    if (!order) {
      return NextResponse.json({ success: false, message: 'Some error occurred at Razorpay' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID // Front end needs this to open checkout
    }, { status: 200 });

  } catch (error) {
    console.error('Razorpay Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
