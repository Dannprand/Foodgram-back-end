import bcrypt from "bcrypt"
import { prismaClient } from "../db";
import { logger } from "../logger";
import { ErrorResponse } from "../responses/error";
import {
    UserRegisterRequest,
    UserLoginRequest,
    UserAuthResponse,
    UserResponse,
    UserDetailResponse,
    UserUpdateRequest
} from "../models/User";
import { UserValidation } from "../validations/user-validation";
import { Validation } from "../validations";
import { v4 as uuid } from "uuid";

export class UserService {
    static async register(request: UserRegisterRequest): Promise<UserAuthResponse> {
        const registerRequest = Validation.validate(
            UserValidation.REGISTER,
            request
        )

        const username = await prismaClient.user.findFirst({
            where: {
                username: registerRequest.username
            }
        })

        if (username) {
            logger.error('Username already exists')
            throw new ErrorResponse(400, 'Username already exists')
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10)
        const user = await prismaClient.user.create({
            data: {
                username: registerRequest.username,
                email: registerRequest.email,
                password: registerRequest.password,
                token: uuid().split('-').join('')
            }
        })

        logger.info('User registered successfully')
        return UserResponse(user)
    }

    static async login(request: UserLoginRequest): Promise<UserAuthResponse> {
        const loginRequest = Validation.validate(
            UserValidation.LOGIN,
            request
        )

        let user = await prismaClient.user.findFirst({
            where: {
                username: loginRequest.username
            }
        })

        if (!user) {
            logger.error('User not found')
            throw new ErrorResponse(404, 'Invalid credentials')
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password)
        if (!isPasswordValid) {
            logger.error('Invalid password')
            throw new ErrorResponse(400, 'Invalid credentials')
        }

        user = await prismaClient.user.update({
            where: {
                user_id: user.user_id
            },
            data: {
                token: uuid().split('-').join('')
            }
        })

        return UserResponse(user)
    }

    static async findById(user_id: number): Promise<UserDetailResponse> {
        const user = await prismaClient.user.findFirst({
            where: {
                user_id
            }
        })

        if (!user) {
            logger.error('User not found')
            throw new ErrorResponse(404, 'User not found')
        }

        return UserDetailResponse(user)
    }

    static async update(request: UserUpdateRequest, user_id: number): Promise<UserDetailResponse> {
        const updateRequest = Validation.validate(
            UserValidation.UPDATE,
            request
        )

        const path = JSON.parse(JSON.stringify(updateRequest.profile_image)).path.replace(/\\/g, '/').replace('public/', '')
        const user = await prismaClient.user.findFirst({
            where: {
                user_id
            }
        })

        if (!user) {
            logger.error('User not found')
            throw new ErrorResponse(404, 'User not found')
        }

        const updatedUser = await prismaClient.user.update({
            where: {
                user_id
            },
            data: {
                username: updateRequest.username,
                profile_image: path
            }
        })

        return UserDetailResponse(updatedUser)
    }
}
