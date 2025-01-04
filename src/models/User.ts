import { User } from "@prisma/client";

export interface UserRegisterRequest {
    username: string
    email: string
    password: string
}

export interface UserLoginRequest {
    username: string
    password: string
}

export interface UserAuthResponse {
    user_id: number
    token: string
}

export interface UserDetailResponse {
    username: string
    profile_image: string
}

export interface UserUpdateRequest {
    username: string
    profile_image: File
}

export const UserResponse = (prismaUser: User): UserAuthResponse => {
    return {
        user_id: prismaUser.user_id,
        token: prismaUser.token ?? ""
    }
}

export const UserDetailResponse = (prismaUser: User): UserDetailResponse => {
    return {
        username: prismaUser.username,
        profile_image: prismaUser.profile_image ?? ""
    }
}