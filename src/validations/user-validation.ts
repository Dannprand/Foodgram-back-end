import { z, ZodType } from "zod";

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        username: z.string().min(3).max(255),
        email: z.string().email(),
        password: z.string().min(8).max(255)
    })

    static readonly LOGIN: ZodType = z.object({
        username: z.string().min(3).max(255),
        password: z.string().min(8).max(255)
    })

    static readonly UPDATE: ZodType = z.object({
        username: z.string().min(3).max(255),
        profile_image: z.object({
            fieldname: z.string(),
            originalname: z.string(),
            encoding: z.string(),
            mimetype: z.string(),
            filename: z.string(),
            path: z.string(),
            size: z.number()
        })
    })
}