import 'dotenv/config'
import 'reflect-metadata'
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';
import { RegisterRoutes } from '../build/routes.js';
import { ValidateError } from 'tsoa';
import { AppError } from './utils/errors.js';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

RegisterRoutes(app)

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): express.Response | void => {
    if (err instanceof ValidateError) {
        console.log(`ValidateError on path ${req.path}:\n`, err);
        return res.status(422).json({
            status: 'fail',
            data: {
                message: 'Request validation failed',
                details: err.fields,
            },
        });
    }
    if (err instanceof AppError) {
        console.log(`AppError on path ${req.path}:\n`, err);
        return res.status(err.statusCode).json({
            status: 'fail',
            data: {
                message: err.message,
            },
        });
    }
    if (err instanceof Error) {
        console.error(`Unhandled Error on path ${req.path}:\n`, err);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }

    next();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});