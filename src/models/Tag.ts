import { Tag } from "@prisma/client";

export interface TagResponse {
    tag_id: number
    name: string
}

export const TagResponseList = (prismaTag: Tag[]): TagResponse[] => {
    return prismaTag.map((tag) => {
        return {
            tag_id: tag.tag_id,
            name: tag.name
        }
    })
}