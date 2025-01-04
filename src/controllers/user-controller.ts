import { Request, Response, NextFunction } from "express"
import { UserRegisterRequest, UserLoginRequest, UserAuthResponse, UserUpdateRequest } from "../models/User"
import { UserService } from "../services/user-service"

export class UserController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: UserRegisterRequest = req.body as UserRegisterRequest
            const response: UserAuthResponse = await UserService.register(request)

            res.status(201).json({
                status: 201,
                message: 'OK',
                data: response
            })
        } catch (e) {
            next(e)
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: UserLoginRequest = req.body as UserLoginRequest
            const response: UserAuthResponse = await UserService.login(request)

            res.status(200).json({
                status: 200,
                message: 'OK',
                data: response
            })
        } catch (e) {
            next(e)
        }
    }

    static async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const user_id = parseInt(req.params.user_id)
            const response = await UserService.findById(user_id)

            res.status(200).json({
                status: 200,
                message: 'OK',
                data: response
            })
        } catch (e) {
            next(e)
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const user_id = parseInt(req.params.user_id)
            const file = req.file
            const request = {
                ...req.body,
                profile_image: file
            } as UserUpdateRequest

            const response = await UserService.update(request, user_id)
            res.status(200).json({
                status: 200,
                message: 'OK',
                data: response
            })
        } catch (e) {
            next(e)
        }
    }
}