// Vercel serverless function for products
import mongoose from 'mongoose';

// Import your models (you'll need to adjust paths)
// import Product from '../server/models/productModel.js';

let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  const connection = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedConnection = connection;
  return connection;
}

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      // Your product logic here
      // const products = await Product.find({});
      res.status(200).json({ message: 'Products endpoint' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  // Handle other methods (POST, PUT, DELETE)
  else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}