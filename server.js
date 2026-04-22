import "dotenv/config"
import express from "express";

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
    res.end(`Hey welcome to shop-flow-backend apis`);
})

app.listen(port, () => {
    console.log(`Server is running on  http://localhost:${port}`);
})