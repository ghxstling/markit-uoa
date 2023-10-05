import prisma from '@/libs/prisma'
import { Prisma } from '@prisma/client'

export default class SupervisorRepo {
    static async createSupervisor(data: Prisma.SupervisorUncheckedCreateInput) {
        return await prisma.supervisor.create({
            data,
        })
    }
    static async createSupervisorFromEmail(email: string, data: Prisma.SupervisorUncheckedCreateInput) {
        const user = await prisma.user.findUnique({
            where: { email },
        })
        return await prisma.supervisor.upsert({
            where: {
                userId: user!.id,
            },
            update: {
                ...data,
            },
            create: {
                ...data,
                userId: user!.id,
            }
        })
    }

    static async getSupervisorbyEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: { email },
        })
        if (user == null) {
            return null
        }
        return await prisma.supervisor.findUnique({
            where: {
                userId: user.id
            }
        })
    }

    static async getAllSupervisors() {
        return await prisma.supervisor.findMany()
    }

}

