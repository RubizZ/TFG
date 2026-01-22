import 'reflect-metadata'
import express from 'express';
import { connectDB } from './config/database.js';
import { RegisterRoutes } from '../build/routes.js';
import { ValidateError } from 'tsoa';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

RegisterRoutes(app)

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): express.Response | void => {
    if (err instanceof ValidateError) {
        console.warn(`Unhandled Error on path ${req.path}:\n`, err);
        return res.status(422).json({
            status: 'fail',
            data: {
                message: 'Validation Failed',
                details: err.fields,
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