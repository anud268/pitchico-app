import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ _id: -1 }).lean();
    
    // Map _id to id so the frontend works smoothly without changes
    const mappedProducts = products.map(product => {
      const p = { ...product };
      if (p._id) {
        p.id = p._id.toString();
      }
      return p;
    });

    return NextResponse.json(mappedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    
    // Parse normal fields
    const rawRating = formData.get('rating');
    const rawRatingCount = formData.get('ratingCount');
    
    const newProductData = {
      name: formData.get('name'),
      price: Number(formData.get('price')),
      originalPrice: Number(formData.get('originalPrice')),
      hasOffer: formData.get('hasOffer') === 'true',
      category: formData.get('category'),
      longDescription: formData.get('longDescription'),
      showOnFrontPage: formData.get('showOnFrontPage') === 'true',
      showCategoryOnHomePage: formData.get('showOnFrontPage') === 'true', // Auto-derived
      rating: rawRating !== null && rawRating !== '' ? Number(rawRating) : 4.5,
      ratingCount: rawRatingCount !== null && rawRatingCount !== '' ? Number(rawRatingCount) : 100,
    };

    console.log('--- NEW PRODUCT SUBMISSION ---');
    console.log('Data:', {
      name: newProductData.name,
      rating: newProductData.rating,
      ratingCount: newProductData.ratingCount
    });

    // Features and advantages sent as JSON array strings
    try {
      newProductData.features = JSON.parse(formData.get('features') || '[]');
      newProductData.advantages = JSON.parse(formData.get('advantages') || '[]');
    } catch(e) {
      newProductData.features = [];
      newProductData.advantages = [];
    }

    const imageFiles = formData.getAll('images');
    const uploadedUrls = [];

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const hasImageKitAuth = privateKey && !privateKey.includes('your_private_key');

    // Upload files to ImageKit
    for (let file of imageFiles) {
      if (file instanceof File && file.size > 0) {
        if (!hasImageKitAuth) {
          throw new Error("Cannot upload image because IMAGEKIT_PRIVATE_KEY is missing in .env.local.");
        }

        const base64Auth = Buffer.from(privateKey + ':').toString('base64');
        const uploadFormData = new FormData();
        
        uploadFormData.append('file', file);
        uploadFormData.append('fileName', file.name.replace(/[^a-zA-Z0-9.-]/g, '_'));
        uploadFormData.append('folder', '/Products');

        const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${base64Auth}`
          },
          body: uploadFormData
        });

        const uploadData = await uploadRes.json();
        
        if (!uploadRes.ok) {
          throw new Error(uploadData.message || 'Image upload failed on ImageKit');
        }
        
        uploadedUrls.push(uploadData.url);
      }
    }

    newProductData.images = uploadedUrls;

    const newProduct = await Product.create(newProductData);
    
    return NextResponse.json({
      success: true,
      product: {
        ...newProduct.toObject(),
        id: newProduct._id.toString()
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
