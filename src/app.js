import express from 'express'
import { AuthRouter } from './routes/Auth/auth.route.js';

const app = express();

app.use(express.json());

app.use("/",AuthRouter);

export {app}