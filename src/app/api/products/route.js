import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).lean();
    
    // Map _id to id so the frontend works smoothly without changes
    const mappedProducts = products.map(product => {
      return {
        ...product,
        // Ensure _id exists before calling toString
        id: product._id ? product._id.toString() : null,
      }
    });

    return NextResponse.json(mappedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
