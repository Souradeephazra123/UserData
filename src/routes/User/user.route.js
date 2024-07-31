import express from 'express'
import { deleteUser, handleMissingUserId, showAllUserData, specificUserData, UpdateAnUserdata } from './user.controller.js';
import { authMiddleware } from '../authMiddleware.js';

const UserRouter=express.Router();

UserRouter.get("/users",authMiddleware,showAllUserData);
UserRouter.get("/user/:id",authMiddleware,specificUserData);
UserRouter.put("/user/:id",authMiddleware,UpdateAnUserdata);
UserRouter.delete("/user/:id",authMiddleware,deleteUser);
UserRouter.get("/user",authMiddleware,handleMissingUserId)

export {UserRouter}