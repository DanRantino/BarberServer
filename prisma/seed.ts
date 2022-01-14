import prisma from '../src/lib/prisma'
import { userData } from './userData'
import bcrypt from 'bcrypt'

const run = async () => {
    const salt = bcrypt.genSaltSync()
    const user = await prisma.user.upsert({
        where: {email: 'teste@teste.com'},
        update: {},
        create: {
            email: 'teste@teste.com',
            password: bcrypt.hashSync('123456', salt),
            firstName: 'Super',
            lastName: 'Admin',
        }
    })
}

run()
.catch(e => {
    console.error(e)
    process.exit(1)
}).finally(async () => {
    await prisma.$disconnect()
})