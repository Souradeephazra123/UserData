import express from 'express'
import { AuthRouter } from './routes/Auth/auth.route.js';
import { UserRouter } from './routes/User/user.route.js';

const app = express();

app.use(express.json());

app.use("/",AuthRouter);
app.use("/",UserRouter)

export {app}