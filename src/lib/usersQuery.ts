import prisma from './prisma';

export const findOneByEmail = (email: string) => {
    let user;
    try {
        user = prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                email: true,
                firstName: true,
                lastName: true,
                id: true,
                password: true,
                createdAt: true,
            },
        });
        if (user == null) throw new Error();
    } catch (error) {
        throw new Error('User not found');
    }
    return user;
};

export const findOneById = (id: number) => {
    let user;
    try {
        user = prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                email: true,
                firstName: true,
                lastName: true,
                id: true,
                password: true,
                createdAt: true,
            },
        });
        if (user == null) throw new Error();
    } catch (error) {
        throw new Error('User not found');
    }
};
