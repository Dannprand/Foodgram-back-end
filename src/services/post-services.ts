import { User } from "@prisma/client";
import { logger } from "../logger";
import { ErrorResponse } from "../responses/error";
import { prismaClient } from "../db";
import {
    PostCreateRequest,
    PostResponse,
    UserPostListResponse,
    RatePostRequest,
    PostUserTagResponse,
    CommentPostRequest,
    CommentPostResponse
} from "../models/Post";
import { Validation } from "../validations";
import { PostValidation } from "../validations/post-validation";

export class PostService {
    /**
     * Retrieves aggregated statistics for posts including ratings, comments, and likes
     * 
     * @returns An object containing:
     *  - postRatingCount: Record mapping post IDs to number of ratings received
     *  - postCommentCount: Record mapping post IDs to number of comments received  
     *  - postRatingValue: Record mapping post IDs to sum of rating values
     *  - postLikeCount: Record mapping post IDs to number of likes received
     * 
     * @remarks
     * This method performs multiple database queries to gather all post-related statistics
     * and aggregates them into separate mappings for each metric.
     * 
     * @private
     * @static
     */
    private static async getPostStats(): Promise<{
        postRatingCount: Record<number, number>;
        postCommentCount: Record<number, number>;
        postRatingValue: Record<number, number>;
        postLikeCount: Record<number, number>;
    }> {
        // Fetch all ratings from the database, selecting only post_id and rating fields
        const postRatings = await prismaClient.rating.findMany({
            select: {
                post_id: true,
                rating: true
            }
        });

        // Fetch all comments from the database, selecting only post_id field
        const postComments = await prismaClient.comment.findMany({
            select: {
                post_id: true
            }
        });

        // Fetch all likes from the database, selecting only post_id field
        const postLikes = await prismaClient.like.findMany({
            select: {
                post_id: true
            }
        });

        // Count the number of ratings for each post
        // Creates an object where key is post_id and value is the count of ratings
        const postRatingCount = postRatings.reduce<Record<number, number>>((acc, rating) => {
            acc[rating.post_id] = (acc[rating.post_id] || 0) + 1;
            return acc;
        }, {});

        // Count the number of comments for each post
        // Creates an object where key is post_id and value is the count of comments
        const postCommentCount = postComments.reduce<Record<number, number>>((acc, comment) => {
            acc[comment.post_id] = (acc[comment.post_id] || 0) + 1;
            return acc;
        }, {});

        // Calculate the sum of rating values for each post
        // Creates an object where key is post_id and value is the sum of ratings
        const postRatingValue = postRatings.reduce<Record<number, number>>((acc, rating) => {
            acc[rating.post_id] = (acc[rating.post_id] || 0) + rating.rating;
            return acc;
        }, {});

        // Count the number of likes for each post
        // Creates an object where key is post_id and value is the count of likes
        const postLikeCount = postLikes.reduce<Record<number, number>>((acc, like) => {
            acc[like.post_id] = (acc[like.post_id] || 0) + 1;
            return acc;
        }, {});

        return { postRatingCount, postCommentCount, postRatingValue, postLikeCount };
    }

    static async create(request: PostCreateRequest, user: User): Promise<PostResponse> {
        const postRequest = Validation.validate(
            PostValidation.CREATE,
            request
        )

        const path = JSON.parse(JSON.stringify(postRequest.image)).path.replace(/\\/g, '/').replace('public/', '')
        const post = await prismaClient.post.create({
            data: {
                title: postRequest.title,
                caption: postRequest.caption,
                image_url: path,
                user_id: user.user_id
            }
        })

        const tags = postRequest.tags.map((tag) => {
            return {
                post_id: post.post_id,
                tag_id: Number(tag)
            }
        })

        await prismaClient.postTag.createMany({
            data: tags
        })

        logger.info('Post created')
        return PostResponse(post)
    }

    /**
     * Creates a new post with the given request data and user information
     * @param request - The post creation request containing title, caption, image, and tags
     * @param user - The user creating the post
     * @returns Promise containing the created post response
     * @throws {ErrorResponse} If validation fails
     */
    static async findById(post_id: number, user_id: number): Promise<PostUserTagResponse> {
        const post = await prismaClient.post.findFirst({
            include: {
                user: {
                    select: {
                        user_id: true,
                        username: true,
                        profile_image: true
                    }
                },
                PostTag: {
                    select: {
                        Tag: true
                    }
                },
            },
            where: {
                post_id
            }
        })

        const { postRatingCount, postCommentCount, postRatingValue, postLikeCount } = await PostService.getPostStats();
        const isCurrentUserLiked = await prismaClient.like.findFirst({
            where: {
                post_id,
                user_id
            }
        })

        const isCurrentUserRated = await prismaClient.rating.findFirst({
            where: {
                post_id,
                user_id
            }
        })

        if (!post) {
            logger.error('Post not found')
            throw new ErrorResponse(404, 'Post not found')
        }

        return PostUserTagResponse(
            post,
            post.user,
            post.PostTag.map((postTag) => {
                return {
                    tag_id: postTag.Tag.tag_id,
                    name: postTag.Tag.name
                }
            }, []),
            postRatingValue[post.post_id] || 0,
            postRatingCount[post.post_id] || 0,
            postCommentCount[post.post_id] || 0,
            postLikeCount[post.post_id] || 0,
            !!isCurrentUserLiked,
            !!isCurrentUserRated
        )
    }

    /**
     * Retrieves all posts with their associated user interactions
     * @param user_id - The ID of the current user
     * @returns Promise containing an array of posts with user and tag information
     */
    static async findAll(user_id: number): Promise<PostUserTagResponse[]> {
        const posts = await prismaClient.post.findMany({
            include: {
                user: {
                    select: {
                        user_id: true,
                        username: true,
                        profile_image: true
                    }
                },
                PostTag: {
                    select: {
                        Tag: true
                    }
                }
            }
        })

        const { postRatingCount, postCommentCount, postRatingValue, postLikeCount } = await PostService.getPostStats();
        return Promise.all(
            posts.map(async (post) => {
                const isCurrentUserLiked = await prismaClient.like.findFirst({
                    where: {
                        post_id: post.post_id,
                        user_id
                    }
                })

                const isCurrentUserRated = await prismaClient.rating.findFirst({
                    where: {
                        post_id: post.post_id,
                        user_id
                    }
                })

                return PostUserTagResponse(
                    post,
                    post.user,
                    post.PostTag.map((postTag) => {
                        return {
                            tag_id: postTag.Tag.tag_id,
                            name: postTag.Tag.name
                        }
                    }, []),
                    postRatingValue[post.post_id] || 0,
                    postRatingCount[post.post_id] || 0,
                    postCommentCount[post.post_id] || 0,
                    postLikeCount[post.post_id] || 0,
                    !!isCurrentUserLiked,
                    !!isCurrentUserRated
                )
            })
        )
    }

    /**
     * Retrieves all posts created by a specific user
     * @param user_id - The ID of the user whose posts to find
     * @returns Promise containing an array of user posts
     */
    static async findAllByUserId(user_id: number): Promise<UserPostListResponse[]> {
        const posts = await prismaClient.post.findMany({
            where: {
                user_id
            }
        })

        return UserPostListResponse(posts)
    }

    /**
     * Finds all posts associated with a specific tag
     * @param tag_id - The ID of the tag to search for
     * @param user_id - The ID of the current user
     * @returns Promise containing an array of posts with user and tag information
     */
    static async findAllByTagId(tag_id: number, user_id: number): Promise<PostUserTagResponse[]> {
        const posts = await prismaClient.postTag.findMany({
            include: {
                Post: {
                    include: {
                        user: {
                            select: {
                                user_id: true,
                                username: true,
                                profile_image: true
                            }
                        },
                        PostTag: {
                            select: {
                                Tag: true
                            }
                        }
                    }
                }
            },
            where: {
                tag_id
            }
        })

        const { postRatingCount, postCommentCount, postRatingValue, postLikeCount } = await PostService.getPostStats();
        return Promise.all(
            posts.map(async (postTag) => {
                const isCurrentUserLiked = await prismaClient.like.findFirst({
                    where: {
                        post_id: postTag.Post.post_id,
                        user_id
                    }
                })

                const isCurrentUserRated = await prismaClient.rating.findFirst({
                    where: {
                        post_id: postTag.Post.post_id,
                        user_id
                    }
                })

                return PostUserTagResponse(
                    postTag.Post,
                    postTag.Post.user,
                    postTag.Post.PostTag.map((postTag) => {
                        return {
                            tag_id: postTag.Tag.tag_id,
                            name: postTag.Tag.name
                        }
                    }, []),
                    postRatingValue[postTag.Post.post_id] || 0,
                    postRatingCount[postTag.Post.post_id] || 0,
                    postCommentCount[postTag.Post.post_id] || 0,
                    postLikeCount[postTag.Post.post_id] || 0,
                    !!isCurrentUserLiked,
                    !!isCurrentUserRated
                )
            })
        )
    }

    /**
     * Adds a like to a post for a specific user
     * @param post_id - The ID of the post to like
     * @param user_id - The ID of the user liking the post
     * @throws {ErrorResponse} If post is not found or already liked
     */
    static async like(post_id: number, user_id: number): Promise<void> {
        const post = await prismaClient.post.findFirst({
            where: {
                post_id
            }
        })

        if (!post) {
            logger.error('Post not found')
            throw new ErrorResponse(404, 'Post not found')
        }

        const like = await prismaClient.like.findFirst({
            where: {
                post_id,
                user_id
            }
        })

        if (like) {
            logger.error('Post already liked')
            throw new ErrorResponse(400, 'Post already liked')
        }

        await prismaClient.like.create({
            data: {
                post_id,
                user_id
            }
        })
    }

    /**
     * Removes a like from a post for a specific user
     * @param post_id - The ID of the post to unlike
     * @param user_id - The ID of the user unliking the post
     * @throws {ErrorResponse} If like is not found
     */
    static async unlike(post_id: number, user_id: number): Promise<void> {
        const like = await prismaClient.like.findFirst({
            where: {
                post_id,
                user_id
            }
        })

        if (!like) {
            logger.error('Post not found')
            throw new ErrorResponse(404, 'Post not found')
        }

        await prismaClient.like.deleteMany({
            where: {
                post_id,
                user_id
            }
        })
    }

    /**
     * Adds a rating to a post from a specific user
     * @param req - The rating request containing the rating value
     * @param post_id - The ID of the post to rate
     * @param user_id - The ID of the user rating the post
     * @throws {ErrorResponse} If post is not found or already rated
     */
    static async rating(req: RatePostRequest, post_id: number, user_id: number): Promise<void> {
        const post = await prismaClient.post.findFirst({
            where: {
                post_id
            }
        })

        if (!post) {
            logger.error('Post not found')
            throw new ErrorResponse(404, 'Post not found')
        }

        const rate = await prismaClient.rating.findFirst({
            where: {
                post_id,
                user_id
            }
        })

        if (rate) {
            logger.error('Post already rated')
            throw new ErrorResponse(400, 'Post already rated')
        }

        await prismaClient.rating.create({
            data: {
                post_id,
                user_id,
                rating: req.rating
            }
        })
    }

    /**
     * Removes a rating from a post for a specific user
     * @param post_id - The ID of the post to unrate
     * @param user_id - The ID of the user removing their rating
     * @throws {ErrorResponse} If rating is not found
     */
    static async unrate(post_id: number, user_id: number): Promise<void> {
        const rating = await prismaClient.rating.findFirst({
            where: {
                post_id,
                user_id
            }
        })

        if (!rating) {
            logger.error('Post not found')
            throw new ErrorResponse(404, 'Post not found')
        }

        await prismaClient.rating.deleteMany({
            where: {
                post_id,
                user_id
            }
        })
    }

    /**
     * Adds a comment to a post from a specific user
     * @param req - The comment request containing the comment content
     * @param post_id - The ID of the post to comment on
     * @param user_id - The ID of the user commenting
     * @throws {ErrorResponse} If post is not found
     */
    static async comment(req: CommentPostRequest, post_id: number, user_id: number): Promise<void> {
        const post = await prismaClient.post.findFirst({
            where: {
                post_id
            }
        })

        if (!post) {
            logger.error('Post not found')
            throw new ErrorResponse(404, 'Post not found')
        }

        await prismaClient.comment.create({
            data: {
                post_id,
                user_id,
                content: req.content
            }
        })
    }

    /**
     * Retrieves all comments for a specific post
     * @param post_id - The ID of the post to get comments for
     * @returns Promise containing an array of comments with user information
     */
    static async findAllCommentsByPostId(post_id: number): Promise<CommentPostResponse[]> {
        const comments = await prismaClient.comment.findMany({
            include: {
                user: {
                    select: {
                        username: true,
                        profile_image: true
                    }
                }
            },
            where: {
                post_id
            }
        })

        return comments.map((comment) => {
            return {
                comment_id: comment.comment_id,
                user: {
                    username: comment.user.username,
                    profile_image: comment.user.profile_image
                },
                content: comment.content
            }
        })
    }
}