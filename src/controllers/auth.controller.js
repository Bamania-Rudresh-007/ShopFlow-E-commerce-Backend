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

        const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET,{expiresIn: "15m"});


        return res
        // .cookie("accessToken", token,{
        //     httpOnly: true,
        //     sameSite: "Strict",
        // })
        .status(200)
        .json({
            message: "Login successful",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token: token,
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

export { register, login };