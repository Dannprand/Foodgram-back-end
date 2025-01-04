import { Request, Response, NextFunction } from "express";
import { PostService } from "../services/post-service";

export class PostController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const file = req.file;
            const user = req.user;

            req.body.tags = JSON.parse(req.body.tags);
            const request = {
                ...req.body,
                image: file
            };

            const response = await PostService.create(request, user);
            res.status(201).json({
                status: 201,
                message: 'OK',
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const post_id = parseInt(req.params.post_id);
            const user = req.user;
            const response = await PostService.findById(post_id, user.user_id);

            res.status(200).json({
                status: 200,
                message: 'OK',
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user;
            const response = await PostService.findAll(user.user_id);
            res.status(200).json({
                status: 200,
                message: 'OK',
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async findAllByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const user_id = parseInt(req.params.user_id);
            const response = await PostService.findAllByUserId(user_id);

            res.status(200).json({
                status: 200,
                message: 'OK',
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async findAllByTagId(req: Request, res: Response, next: NextFunction) {
        try {
            const tag_id = parseInt(req.params.tag_id);
            const user = req.user;
            const response = await PostService.findAllByTagId(tag_id, user.user_id);

            res.status(200).json({
                status: 200,
                message: 'OK',
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async like(req: Request, res: Response, next: NextFunction) {
        try {
            const post_id = parseInt(req.params.post_id);
            const user = req.user;

            await PostService.like(post_id, user.user_id);
            res.status(200).json({
                status: 200,
                message: 'OK'
            });
        } catch (e) {
            next(e);
        }
    }

    static async unlike(req: Request, res: Response, next: NextFunction) {
        try {
            const post_id = parseInt(req.params.post_id);
            const user = req.user

            await PostService.unlike(post_id, user.user_id)
            res.status(200).json({
                status: 200,
                message: 'OK'
            });
        } catch (e) {
            next(e)
        }
    }

    static async rating(req: Request, res: Response, next: NextFunction) {
        try {
            const post_id = parseInt(req.params.post_id);
            const user = req.user;

            await PostService.rating(req.body, post_id, user.user_id);
            res.status(200).json({
                status: 200,
                message: 'OK'
            });
        } catch (e) {
            next(e);
        }
    }

    static async unrate(req: Request, res: Response, next: NextFunction) {
        try {
            const post_id = parseInt(req.params.post_id);
            const user = req.user

            await PostService.unrate(post_id, user.user_id)
            res.status(200).json({
                status: 200,
                message: 'OK'
            });
        } catch (e) {
            next(e)
        }
    }

    static async comment(req: Request, res: Response, next: NextFunction) {
        try {
            const post_id = parseInt(req.params.post_id);
            const user = req.user;

            await PostService.comment(req.body, post_id, user.user_id);
            res.status(200).json({
                status: 200,
                message: 'OK'
            });
        } catch (e) {
            next(e);
        }
    }

    static async findAllCommentsByPostId(req: Request, res: Response, next: NextFunction) {
        try {
            const post_id = parseInt(req.params.post_id);
            const response = await PostService.findAllCommentsByPostId(post_id);

            res.status(200).json({
                status: 200,
                message: 'OK',
                data: response
            });
        } catch (e) {
            next(e);
        }
    }
}