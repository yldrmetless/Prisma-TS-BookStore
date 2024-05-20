import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["error", "warn", "query", "info"] });

const app = Fastify();

app.post("/author", async (req, res) => {
    const {firstName, lastName} = req.body as any;

    const author = await prisma.author.create({
        data: {
            firstName,
            lastName,
        }
    });
    return res.send(author)
})

app.get("/authors", async(req,res) => {
    const {skip, take} = req.query as any

    const authors = await prisma.author.findMany({
        skip: +skip || undefined,
        take: +take || undefined
    })

    return res.send(authors)
})

app.get("/author", async(req, res) => {
    const {authorId} = req.query as any;

    const author = await prisma.author.findUnique({
        where: {
            id: +authorId
        },
        select: {
            firstName: true,
            id: true,
            lastName: true,
            books: {
                select: {
                    pages: true,
                    title: true,
                    id: true
                }
            }
        }
    })
    return res.send(author)
})

app.post("/book", async(req, res) => {
    const {title, pages, authorId} = req.body as any;

    const books = await prisma.book.create({
        data: {
            title,
            pages,
            authorId
        }
    });
    return res.send(books)
})

app.listen({ port: 4545 });
