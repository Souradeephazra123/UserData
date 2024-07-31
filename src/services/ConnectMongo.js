import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

async function MongoConnect() {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("Database connected");
  } catch (error) {
    console.log(`Error in connecting mongodb database`);
  }
}


async function MongoDisconnect(){
    try {
        await mongoose.disconnect();
    } catch (error) {
        console.log(`Error in disconnecting mongodb database`);
    }
}

export {MongoConnect,MongoDisconnect}