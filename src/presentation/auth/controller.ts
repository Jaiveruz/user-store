import { Response, Request } from "express";
import { CustomError, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";
import { UserModel } from "../../data";



export class AuthController {


    constructor(
        public readonly authService: AuthService
    ) {}

    registerUser = async (req: Request, res: Response) => {

        const [error, registerDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.authService.registerUser(registerDto!)
            .then( data => res.json(data) )


        try {
            const user = new UserModel(registerDto);
            await user.save();

            return user;
        } catch (error) {
           throw CustomError.internalServer(`${error}`);
        }

        // Implement registration logic here
        res.json(registerDto);
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