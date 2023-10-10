import prisma from '@/libs/prisma'
import { Prisma } from '@prisma/client'

export default class SupervisorRepo {
    static async createSupervisor(data: Prisma.SupervisorUncheckedCreateInput) {
        return await prisma.supervisor.create({
            data,
        })
    }

    static async createSupervisorFromEmail(email: string, additionalData: Partial<Prisma.SupervisorUncheckedCreateInput> = {}) {
        const user = await prisma.user.findUnique({
            where: { email },
        })
        if (!user) {
            throw new Error(`User with email ${email} not found.`);
        }
        
        const fullData = {
            ...additionalData,
            userId: user.id,
        };
    
        return await prisma.supervisor.upsert({
            where: {
                userId: user.id,
            },
            update: fullData,
            create: fullData
        })
    }
    

    static async getSupervisorByUserId(userId: number) {
        return await prisma.supervisor.findUnique({
            where: { userId },
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
        return await prisma.supervisor.findMany({
            include: {
                user: true,
            },
        });
    }

}

