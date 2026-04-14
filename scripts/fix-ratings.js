const mongoose = require('mongoose');

async function fix() {
  try {
    await mongoose.connect('mongodb+srv://pitchicostore_db_user:m3dy7ggswZiNXR4h@cluster0.dhz0ens.mongodb.net/?appName=Cluster0');
    const result = await mongoose.connection.db.collection('products').updateMany(
      { rating: { $exists: false } },
      { $set: { rating: 4.5, ratingCount: 120 } }
    );
    console.log(`Updated ${result.modifiedCount} products`);
    
    // Also ensure rating is at least 0 for all
    await mongoose.connection.db.collection('products').updateMany(
      { rating: { $eq: null } },
      { $set: { rating: 0, ratingCount: 0 } }
    );
    
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

fix();
