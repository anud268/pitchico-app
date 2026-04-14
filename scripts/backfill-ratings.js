const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://pitchicostore_db_user:m3dy7ggswZiNXR4h@cluster0.dhz0ens.mongodb.net/?appName=Cluster0')
  .then(() => mongoose.connection.db.collection('products').updateMany(
    { rating: { $exists: false } },
    { $set: { rating: 4.5, ratingCount: 120 } }
  ))
  .then(r => console.log('Updated:', r.modifiedCount, 'products'))
  .catch(console.error)
  .finally(() => process.exit(0));
