import express from 'express'
import { signup, verifySignup } from './auth.controller.js';

const AuthRouter=express.Router();


AuthRouter.post("/signup",signup);
AuthRouter.post("/signup/verify",verifySignup);

export {AuthRouter}