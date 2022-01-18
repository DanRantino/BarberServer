import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { findOneByEmail } from '../lib/usersQuery';
import { userType } from '../types/userType';
import prisma from '../lib/prisma';

dotenv.config();
const router = express.Router();

router.post('/signup', async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;
    console.log(req.body);
    const user = await findOneByEmail(email);
    if (user != null) {
        return res.status(406).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
        },
        select: {
            email: true,
            createdAt: true,
            lastName: true,
            firstName: true,
            id: true,
        },
    });

    return res.status(201).json({ ...newUser });
});

router.post('/signin', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await findOneByEmail(email);

    if (!user) {
        return res.status(401).send({ error: 'User not found' });
    }

    const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: '10m',
    });
    if (bcrypt.compareSync(password, user.password)) {
        const ret = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.id,
            createdAt: user.createdAt,
        };
        res.setHeader('Authorization', token);
        res.json(ret);
        res.status(200);
    } else res.status(401).json({ error: 'Wrong password' });
});

router.get('/refresh-token/:auth', (req: Request, res: Response) => {
    const { auth } = req.params;
    if (!auth) {
        return res.status(401).send({ error: 'No authorization' });
    }
    let response: JwtPayload | string;
    let user;
    let token;
    try {
        response = jwt.verify(auth, process.env.JWT_SECRET) as userType;
        user = {
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            id: response.id,
            createdAt: response.createdAt,
        };
        token = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
    } catch (err) {
        return res.status(401).send({ error: 'No authorization' });
    }
    res.status(200).json({ user, authorization: token });
});

export default router;
