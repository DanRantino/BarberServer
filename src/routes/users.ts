import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { findOneByEmail } from '../lib/usersQuery';
import { userType } from '../types/userType';

dotenv.config();
const router = express.Router();

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
    } else res.status(401).json({ message: 'Wrong password' });
});

router.get('/refresh-token/:auth', (req: Request, res: Response) => {
    const { auth } = req.params;
    if (!auth) {
        return res.status(401).send({ error: 'No authorization' });
    }
    let ret: JwtPayload | string;
    let user;
    let token;
    try {
        ret = jwt.verify(auth, process.env.JWT_SECRET) as userType;
        user = {
            email: ret.email,
            firstName: ret.firstName,
            lastName: ret.lastName,
            id: ret.id,
            createdAt: ret.createdAt,
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
