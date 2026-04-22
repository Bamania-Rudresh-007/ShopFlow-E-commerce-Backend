import mongoose from "mongoose";

const connectDB = async () => {
    try{
        mongoose.connect(process.env.MONGODB_KEY)
            .then(res => console.log("mongoDB connected successfully!!"))
            .catch(err => console.log(err));
    }
    catch(err){
        console.log("Internal server error: ", err);
    }
}

export default connectDB;