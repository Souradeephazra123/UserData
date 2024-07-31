import http from "http";
import dotenv from "dotenv";
import { MongoConnect } from "./services/ConnectMongo.js";
import { app } from "./app.js";


dotenv.config();

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await MongoConnect();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
