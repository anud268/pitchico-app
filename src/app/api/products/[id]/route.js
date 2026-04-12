import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    let product = null;
    // Try to find by _id if it's a valid ObjectId OR by a string id if it's custom.
    try {
      product = await Product.findById(id).lean();
    } catch {
      product = await Product.findOne({ id: id }).lean();
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ ...product, id: product._id ? product._id.toString() : id });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
