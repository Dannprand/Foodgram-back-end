import { Response, NextFunction } from "express";
import { prismaClient } from "../db";
import { UserRequest } from "../requests/user-request";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({
            status: 401,
            message: 'Unauthorized'
        });
        return;
    }

    const user = await prismaClient.user.findFirst({
        where: {
            token: token
        }
    });

    if (!user) {
        res.status(401).json({
            status: 401,
            message: 'Unauthorized'
        });
        return;
    }

    req.user = user;
    next();
    return;
}