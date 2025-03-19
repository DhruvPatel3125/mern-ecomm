const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const mongoDBURL = process.env.MONGO_URI || "mongodb+srv://dhruv:402125@cluster0.8bnod.mongodb.net/mern-ecom";

const connectDB = async () => {
    try {
        await mongoose.connect(mongoDBURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connection Successful ✅");
    } catch (error) {
        console.error("MongoDB Connection Failed ❌", error);
        process.exit(1); // Exit process with failure
    }
};

connectDB(); // Call the function to connect

module.exports = mongoose;
