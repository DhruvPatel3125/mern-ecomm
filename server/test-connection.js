require('dotenv').config();
const mongoose = require('mongoose');

const testMongo = async () => {
    try {
        console.log('🧪 Testing MongoDB Atlas connection...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected successfully!');
        console.log('📊 Database:', mongoose.connection.name);
        
        // List collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📁 Collections:', collections.map(c => c.name));
        
        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

testMongo();