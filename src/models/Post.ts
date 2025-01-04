import { Post } from "@prisma/client";

export interface PostCreateRequest {
    title: string
    tags: number[]
    caption: string
    image: File
}

export interface UserPostListResponse {
    post_id: number
    image_url: string
}

export interface RatePostRequest {
    rating: number
}

export interface CommentPostRequest {
    content: string
}

export interface CommentPostResponse {
    comment_id: number
    user: {
        username: string
        profile_image: string
    }
    content: string
}

export interface PostResponse {
    post_id: number
    title: string
    caption: string
    image_url: string
    user_id: number
}

export interface PostUserTagResponse {
    post_id: number
    title: string
    caption: string
    image_url: string
    user: {
        user_id: number
        username: string
        profile_image: string
    }
    tags: {
        tag_id: number
        name: string
    }[]
    ratingValue: number
    ratingCount: number
    commentCount: number
    like: number
    is_current_user_liked: boolean
    is_current_user_rated: boolean
}

export const PostResponse = (prismaPost: Post): PostResponse => {
    return {
        post_id: prismaPost.post_id,
        title: prismaPost.title,
        caption: prismaPost.caption,
        image_url: prismaPost.image_url,
        user_id: prismaPost.user_id
    }
}

export const UserPostListResponse = (prismaPost: Post[]): UserPostListResponse[] => {
    return prismaPost.map((post) => {
        return {
            post_id: post.post_id,
            image_url: post.image_url
        }
    })
}

export const PostUserTagResponse = (
    prismaPost: Post,
    user: { user_id: number, username: string, profile_image: string },
    tags: { tag_id: number, name: string }[],
    ratingValue: number,
    ratingCount: number,
    commentCount: number,
    like: number,
    isCurrentUserLiked: boolean,
    isCurrentUserRated: boolean
): PostUserTagResponse => {
    return {
        post_id: prismaPost.post_id,
        title: prismaPost.title,
        caption: prismaPost.caption,
        image_url: prismaPost.image_url,
        user,
        tags,
        ratingValue,
        ratingCount,
        commentCount,
        like,
        is_current_user_liked: isCurrentUserLiked,
        is_current_user_rated: isCurrentUserRated
    }
}

export const CommentPostResponse = (
    comment_id: number,
    user: { username: string, profile_image: string },
    content: string
): CommentPostResponse => {
    return {
        comment_id,
        user,
        content
    }
}