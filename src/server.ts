import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRouter from './routes/users';

dotenv.config();

const app = express();
app.use(
    cors({
        exposedHeaders: ['Authorization'],
    }),
);
app.use(bodyParser.json());
/* 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads')
  },
  filename: (req: Request, file: Express.Multer.File, callback) => {
    callback(null, file.originalname)
  }
})

const upload = multer({ storage })
*/

app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRouter);

app.listen(process.env.PORT || 5000, () => {
    console.log(`${process.env.PORT || 5000}`);
});
