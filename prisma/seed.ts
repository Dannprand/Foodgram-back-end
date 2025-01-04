import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function main() {
    const sweet = await prisma.tag.upsert({
        where: { tag_id: 1 },
        update: {},
        create: {
            name: "Sweet"
        },
    })

    const savoury = await prisma.tag.upsert({
        where: { tag_id: 2 },
        update: {},
        create: {
            name: "Savoury"
        },
    })

    const dessert = await prisma.tag.upsert({
        where: { tag_id: 3 },
        update: {},
        create: {
            name: "Dessert"
        },
    })

    const drink = await prisma.tag.upsert({
        where: { tag_id: 4 },
        update: {},
        create: {
            name: "Drink"
        },
    })

    const healthy = await prisma.tag.upsert({
        where: { tag_id: 5 },
        update: {},
        create: {
            name: "Healthy"
        },
    })

    const foodGramUser = await prisma.user.upsert({
        where: { user_id: 1 },
        update: {},
        create: {
            username: "foodgram",
            email: "admin@foodgram.com",
            password: "admin",
            token: "admin",
            profile_image : "images/user.png"
        }
    })

    const postSweet = await prisma.post.upsert({
        where: { post_id: 1 },
        update: {},
        create: {
            title: "Sweet",
            caption: "This is a sweet post",
            user_id: foodGramUser.user_id,
            image_url: "images/sweet.jpg",
        }
    })

    const postSweetTag = await prisma.postTag.upsert({
        where: { post_id_tag_id: { post_id: postSweet.post_id, tag_id: sweet.tag_id } },
        update: {},
        create: {
            post_id: postSweet.post_id,
            tag_id: sweet.tag_id,
        }
    })

    const postSavoury = await prisma.post.upsert({
        where: { post_id: 2 },
        update: {},
        create: {
            title: "Savoury",
            caption: "This is a savoury post",
            user_id: foodGramUser.user_id,
            image_url: "images/savoury.jpg",
        }
    })

    const postSavouryTag = await prisma.postTag.upsert({
        where: { post_id_tag_id: { post_id: postSavoury.post_id, tag_id: savoury.tag_id } },
        update: {},
        create: {
            post_id: postSavoury.post_id,
            tag_id: savoury.tag_id,
        }
    })

    const postDessert = await prisma.post.upsert({
        where: { post_id: 3 },
        update: {},
        create: {
            title: "Dessert",
            caption: "This is a dessert post",
            user_id: foodGramUser.user_id,
            image_url: "images/dessert.jpg",
        }
    })

    const postDessertTag = await prisma.postTag.upsert({
        where: { post_id_tag_id: { post_id: postDessert.post_id, tag_id: dessert.tag_id } },
        update: {},
        create: {
            post_id: postDessert.post_id,
            tag_id: dessert.tag_id,
        }
    })

    const postDrink = await prisma.post.upsert({
        where: { post_id: 4 },
        update: {},
        create: {
            title: "Drink",
            caption: "This is a drink post",
            user_id: foodGramUser.user_id,
            image_url: "images/drink.jpg",
        }
    })

    const postDrinkTag = await prisma.postTag.upsert({
        where: { post_id_tag_id: { post_id: postDrink.post_id, tag_id: drink.tag_id } },
        update: {},
        create: {
            post_id: postDrink.post_id,
            tag_id: drink.tag_id,
        }
    })

    const postHealthy = await prisma.post.upsert({
        where: { post_id: 5 },
        update: {},
        create: {
            title: "Healthy",
            caption: "This is a healthy post",
            user_id: foodGramUser.user_id,
            image_url: "images/healthy.jpg",
        }
    })

    const postHealthyTag = await prisma.postTag.upsert({
        where: { post_id_tag_id: { post_id: postHealthy.post_id, tag_id: healthy.tag_id } },
        update: {},
        create: {
            post_id: postHealthy.post_id,
            tag_id: healthy.tag_id,
        }
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })