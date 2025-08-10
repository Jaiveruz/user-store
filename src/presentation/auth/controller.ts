import { Response, Request } from "express";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";
import { UserModel } from "../../data";



export class AuthController {


    constructor(
        public readonly authService: AuthService
    ) {}

    private handleError = (error: unknown, res: Response ) => {
        if ( error instanceof CustomError ) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`Error: ${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    registerUser = async (req: Request, res: Response) => {

        const [error, registerDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.authService.registerUser(registerDto!)
            .then( data => res.json(data) )
            .catch( error => this.handleError(error, res) );
    }

    loginUser = async (req: Request, res: Response) => {
        
        const [error, loginUserDto] = LoginUserDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.authService.loginUser(loginUserDto!)
            .then( data => res.json(data) )
            .catch( error => this.handleError(error, res) );
    }

    validateEmail = async (req: Request, res: Response) => {
        // Implement registration logic here
        res.status(201).json({ message: 'validateEmail' });
    }

}