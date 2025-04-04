const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.post("/register", async (req, res) => {
    try {
        const docs = await User.find({ email: req.body.email });
        if (docs.length > 0) {
            return res.status(400).send("User email already exists");
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            await newUser.save();
            res.status(201).send("User registered successfully");
        }
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(400).send("Something went wrong");
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (user.password === req.body.password) {
                res.send({
                    _id: user.id,
                    name: user.name,
                    email: user.email
                });
            } else {
                res.status(401).send("Invalid email or password");
            }
        } else {
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
                email: user.email
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

router.get("/getallusers",(_, res) => {
    User.find({}, (err, docs) => {
        if (err) {
            return res.status(400).json({ message: "Something went wrong" });
        } else {
            res.send(docs);
        }
    });
});

module.exports = router;
