import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import nimbuspostService from '@/services/nimbuspostService';
import { sendOrderEmail } from '@/utils/mailer';

export async function POST(req) {
  try {
    await dbConnect();
    const { customer, shipping, paymentMethod, totalAmount, items } = await req.json();

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const order = new Order({
      orderId,
      customer,
      shipping,
      paymentMethod,
      totalAmount,
      items
    });

    const savedOrder = await order.save();

    // Trigger NimbusPost Shipment push
    try {
      await nimbuspostService.createShipment({
        orderId: savedOrder.orderId,
        customer: savedOrder.customer,
        shipping: savedOrder.shipping,
        paymentMethod: savedOrder.paymentMethod,
        totalAmount: savedOrder.totalAmount,
        items: savedOrder.items
      });
    } catch (e) {
      console.error("NimbusPost error:", e);
    }
    
    // Send Email Notification
    try {
      await sendOrderEmail(savedOrder);
    } catch (e) {
      console.error("Email send error:", e);
    }

    return NextResponse.json({
      success: true,
      data: savedOrder,
      message: 'Order created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error(`Create Order Error:`, error);
    return NextResponse.json({ success: false, message: 'Failed to create order', error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: orders.length, data: orders }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
