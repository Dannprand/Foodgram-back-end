import express from "express";
import { upload } from "../utils/storage";
import { authMiddleware } from "../middlewares/auth-middleware";
import { UserController } from "../controllers/user-controller";
import { PostController } from "../controllers/post-controller";

export const authenticatedRoute = express.Router();
authenticatedRoute.use(authMiddleware);

authenticatedRoute.get("/api/users/:user_id", UserController.findById);
authenticatedRoute.get("/api/users/:user_id/posts", PostController.findAllByUserId);

authenticatedRoute.patch(
    "/api/users/:user_id/update", 
    upload.single("profile_image"),
    UserController.update
);

authenticatedRoute.post(
    "/api/posts/create",
    upload.single("image"),
    PostController.create
);

authenticatedRoute.get("/api/posts/:post_id/likes", PostController.like);
authenticatedRoute.get("/api/posts/:post_id/likes/delete", PostController.unlike);
authenticatedRoute.post("/api/posts/:post_id/ratings", PostController.rating);
authenticatedRoute.post("/api/posts/:post_id/ratings/delete", PostController.unrate);
authenticatedRoute.get("/api/posts", PostController.findAll);
authenticatedRoute.get("/api/posts/:post_id", PostController.findById);
authenticatedRoute.post("/api/posts/:post_id/comments", PostController.comment);
authenticatedRoute.get("/api/posts/:post_id/comments", PostController.findAllCommentsByPostId);
authenticatedRoute.get("/api/tags/:tag_id/posts", PostController.findAllByTagId);