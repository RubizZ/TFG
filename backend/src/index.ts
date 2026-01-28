import 'dotenv/config'
import 'reflect-metadata'
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';
import { RegisterRoutes } from '../build/routes.js';
import { ValidateError } from 'tsoa';
import { AppError } from './utils/errors.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// Swagger UI documentation (only in development)
if (process.env.NODE_ENV !== 'production') {
    const openApiSpec = JSON.parse(fs.readFileSync(path.join(__dirname, '../build/openapi.json'), 'utf8'));
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
}

// Register routes from tsoa
RegisterRoutes(app)

// Error handling middleware for validation request errors, business logic errors and unhandled errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): express.Response | void => {
    if (err instanceof ValidateError) {
        console.log(`ValidateError on path ${req.path}:\n`, err);
        return res.status(422).json({
            status: 'fail',
            data: {
                code: 'VALIDATION_ERROR',
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
                code: err.code,
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