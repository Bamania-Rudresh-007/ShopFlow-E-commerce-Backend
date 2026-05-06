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


const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.json("all feilds are required!");
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                message: "Invalid email or password",
            })
        }

        const isAuthenticate = await bcrypt.compare(password, user.password);

        if(!isAuthenticate){
            return res.status(401).json({
                message: "Invalid token access denied",
            })
        }

        const accessToken = jwt.sign({id: user._id, email: user.email}, process.env.ACCESS_TOKEN,{expiresIn: "15m"});

        const refreshToken = jwt.sign({id: user._id}, process.env.REFRESH_TOKEN, {expiresIn: "7d"});

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            message: "Login successful",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
        })
    }   
    catch(err){
        console.log("Login Error: ", err);
        res.status(500).json({
            message: "Server Error: ",
            error: err.message,
        })
    }
}
