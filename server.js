import express from "express";
import "dotenv/config";
import connectDB from "./src/config/db.js";
import register from "./src/controllers/auth.controller.js";
import cors from "cors";

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:7300", 
  credentials: true                                            
}));

app.get("/", (req, res) => {
    res.end("Hey there, \n\nWelcome to ShopFlow-API's");
})

app.post("/register", register);

connectDB();

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
})