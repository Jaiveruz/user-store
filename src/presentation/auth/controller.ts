import { Response, Request } from "express";



export class AuthController {


    constructor() {}

    registerUser = async (req: Request, res: Response) => {
        // Implement registration logic here
        res.status(201).json({ message: 'registerUser' });
    }

    loginUser = async (req: Request, res: Response) => {
        // Implement registration logic here
        res.status(201).json({ message: 'loginUser' });
    }

    validateEmail = async (req: Request, res: Response) => {
        // Implement registration logic here
        res.status(201).json({ message: 'validateEmail' });
    }

}