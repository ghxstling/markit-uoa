import prisma from '@/libs/prisma'
import { Role } from '@/models/role'
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

    static async doesUserHaveRole(email: string, role: Role) {
        const user = await prisma.user.findUnique({
            where: { email },
        })
        if (!user) {
            return false
        }
        return user.role === role
    }

    static async getAllUsers() {
        return await prisma.user.findMany();
    }

    static async getUserById(id: number) {
        return await prisma.user.findUnique({
            where: { id },
        });
    }
    
    static async updateUserRole(id: number, role: string) {
        return await prisma.user.update({
            where: { id },
            data: { role },
        });
    }
}

