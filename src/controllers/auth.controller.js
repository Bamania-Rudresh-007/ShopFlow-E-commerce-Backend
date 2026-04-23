import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);
        // Create new user
        const user = await User.create({
                name,
                email,
                password: hashedPassword,
            });
        res.status(201).json({ message: "User registered successfully", data: user });
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
