import prisma from '@/libs/prisma'
import { Prisma } from '@prisma/client'

export default class UserRepo {
    static async createUser(data: Prisma.UserCreateInput) {
        return await prisma.user.create({
            data,
        })
    }

    static async getUserbyEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email },
        })
    }
}
