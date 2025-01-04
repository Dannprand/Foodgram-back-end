import { z, ZodType } from "zod"

export class PostValidation {
    static readonly CREATE: ZodType = z.object({
        title: z.string().min(3).max(255),
        tags: z.array(z.string()),
        caption: z.string().min(3).max(255),
        image: z.object({
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