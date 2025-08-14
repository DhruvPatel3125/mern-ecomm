const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        console.log("Registration attempt for email:", email);
        
        const docs = await User.find({ email: email.trim() });
        if (docs.length > 0) {
            return res.status(400).send("User email already exists");
        } else {
            const newUser = new User({
                name: name.trim(),
                email: email.trim(),
                password: password.trim()
            });
            await newUser.save();
            console.log("User registered successfully:", email);
            res.status(201).send("User registered successfully");
        }
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(400).send("Something went wrong");
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log("Login attempt for email:", email);
        
        const user = await User.findOne({ email: email.trim() });
        console.log("User found:", user ? 'Yes' : 'No');
        
        if (user) {
            // Trim and compare passwords
            const isPasswordValid = user.password.trim() === password.trim();
            console.log("Password match:", isPasswordValid);
            
            if (isPasswordValid) {
                res.send({
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin
                });
            } else {
                console.log("Password mismatch - Stored:", user.password, "Provided:", password);
                res.status(401).send("Invalid email or password");
            }
        } else {
            console.log("User not found with email:", email);
            res.status(401).send("Invalid email or password");
        }
    } catch (err) {
        console.error("Error logging in user:", err);
        res.status(400).send("Something went wrong");
    }
});

router.post("/update", async (req, res) => {
    try {
        const { updatedUser, userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user fields
        user.name = updatedUser.name;
        user.email = updatedUser.email;
        if (updatedUser.password) {
            user.password = updatedUser.password;
        }

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(400).json({ 
            message: "Error updating profile",
            error: error.message 
        });
    }
});

router.get("/getallusers", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(400).json({ message: "Something went wrong" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        await User.findByIdAndDelete(userId);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(400).json({ message: "Something went wrong" });
    }
});

module.exports = router;
