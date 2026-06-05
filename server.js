import express from "express";
import "dotenv/config";

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
    res.end("Hey there, \n\nWelcome to ShopFlow-API's");
})

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
})