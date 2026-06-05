import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/email.js";


const register = async (req, res) => {
    try{
        const {name , email , password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const existingUser = await User.findOne({email: email});
        if(existingUser){
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const accessToken = jwt.sign({id: newUser._id,email,}, process.env.ACCESS_TOKEN,{expiresIn: "15m"});

        const refreshToken = jwt.sign({id: newUser._id,email,}, process.env.REFRESH_TOKEN,{expiresIn: "7d"});

        User.refreshToken = refreshToken;
        await newUser.save();

         const cookieOptions = {
            httpOnly: true,                                      
            secure: process.env.NODE_ENV === "production",       
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000                      
        };

        const createdUser = newUser.toObject();
        delete createdUser.password;
        delete createdUser.refreshToken;

        await sendEmail(newUser.email, "Welcome to ShopFlow backend api's", `<h1>Hello, ${newUser.name}</h1> \n<p>Thank you for registering.</p>`);


        return res
        .status(201)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json({
            success: true,
            message: "User registered successfully",
            data: {
                user: createdUser,
                accessToken
            }
        })

    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export default register;