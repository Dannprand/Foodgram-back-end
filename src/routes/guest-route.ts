import express from "express";
import { UserController } from "../controllers/user-controller";

export const guestRoute = express.Router();
guestRoute.post("/api/register", UserController.register);
guestRoute.post("/api/login", UserController.login);