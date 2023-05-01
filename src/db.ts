import { PrismaClient } from "@prisma/client";

const db: PrismaClient = new PrismaClient({
    log:['query', 'info', 'warn', 'error']
})
export default db;