import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

const validateRequest = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error: any) {
        if (error.errors) {
            const errorMessages = error.errors.map((err: any) => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            return res.status(400).json({ message: 'Validation error', errors: errorMessages });
        }
        next(error);
    }
};

export default validateRequest;
