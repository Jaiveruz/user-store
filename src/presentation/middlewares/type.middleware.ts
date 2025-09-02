import { NextFunction, Request, Response } from 'express';


export class TypeMiddleware {

    static validTypes( validTypes: string[] ) {

        return ( req: Request, res: Response, next: NextFunction ) => {
    
            const types = req.url.split('/').at(2) ?? '';

            if ( !validTypes.includes(types) ) {
                return res.status(400).json({ error: `Invalid type. Allowed types: ${validTypes.join(', ')}` });
            }

            next();
        }
    }
}