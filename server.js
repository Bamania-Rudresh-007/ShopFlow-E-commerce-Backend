import "dotenv/config"
import express from "express";
import connectDB from "./src/config/db.js";

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
    res.end(`Hey welcome to shop-flow-backend apis`);
})

connectDB()

app.listen(port, () => {
    console.log(`Server is running on  http://localhost:${port}`);
})