import { parseArgs } from 'node:util'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const args = ["constant", "random"];

const options = {
    "environment": {
        type: "string" as const,
    },
}

async function main() {
    const {
        values: { environment },
      } = parseArgs({ options });

    switch (environment) {
        case "constant":
            /** data for your development */
            break
        case "random":
            /** data for your test environment */
            break
        default:
            break
    }
    console.log("Seeding finished.")
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
