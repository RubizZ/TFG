import 'dotenv/config'
import 'reflect-metadata'
import express from 'express';
import { connectDB } from './config/database.js';
import { RegisterRoutes } from '../build/routes.js';
import { ValidateError } from 'tsoa';
import { AppError } from './utils/errors.js';

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Middleware to wrap all successful responses in JSend format
app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function (body) {
        // Only wrap if it's a success status (2xx)
        // and it's not already wrapped (to accept manual JSend responses in controllers)
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const isAlreadyWrapped = body && typeof body === 'object' && 'status' in body && 'data' in body;
            if (!isAlreadyWrapped) {
                return originalJson.call(this, {
                    status: 'success',
                    data: body
                });
            }
        }
        return originalJson.call(this, body);
    };
    next();
});

// Register routes from tsoa
RegisterRoutes(app)

// Error handling middleware for validation request errors, business logic errors and unhandled errors
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