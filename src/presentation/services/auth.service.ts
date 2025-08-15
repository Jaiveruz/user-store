import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity, LoginUserDto } from "../../domain";
import { EmailService } from './email.service';


export class AuthService {

    constructor (
        private readonly emailService: EmailService,
    ) {}

    public async registerUser( registerUserDto: RegisterUserDto ) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if ( existUser ) throw CustomError.badRequest('Email already exists');

        try {
            const user = new UserModel(registerUserDto);
            
            user.password = bcryptAdapter.hash(registerUserDto.password);
            await user.save();

            await this.sendEmailValidationLink(user.email);
            
            const { password, ...userEntity } = UserEntity.fromObject(user);

            const token = await JwtAdapter.generateToken({ id: user.id })
            if ( !token ) throw CustomError.internalServer('Error generating token');

            return {
                user: userEntity,
                token: token
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    };

    public async loginUser( loginUserDto: LoginUserDto ) {

        try {
            const user = await UserModel.findOne({ email: loginUserDto.email });
            if ( !user ) throw CustomError.badRequest('Email not exist');

            const isValidPassword = bcryptAdapter.compare(loginUserDto.password, user.password);
            if ( !isValidPassword ) throw CustomError.badRequest('Invalid email or password');

            const { password, ...userEntity } = UserEntity.fromObject(user);

            const token = await JwtAdapter.generateToken({ id: user.id })
            if ( !token ) throw CustomError.internalServer('Error generating token');


            return {
                user: userEntity,
                token: token
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    };

    private sendEmailValidationLink = async ( email: string ) => {
        const token = await JwtAdapter.generateToken({ email });
        if (!token) throw CustomError.internalServer('Error generating token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email?token=${token}`;
        const html = `
            <h1>Email Validation</h1>
            <p>Please validate your email by clicking on the following link:</p>
            <a href="${ link }">validate your email: ${ email }</a>
        `;

        const options = {
            to: email,
            subject: 'Email Validation',
            htmlBody: html
        };

        const isSet = await this.emailService.sendEmail(options);
        if (!isSet) throw CustomError.internalServer('Error sending email');

        return true;
    };

    public validateEmail = async ( token: string ) => {
        const payload = await JwtAdapter.validateToken(token);
        if ( !payload ) throw CustomError.unauthorized('Invalid token');

        const { email } = payload as { email: string };
        if ( !email ) throw CustomError.internalServer('Email not in token');

        const user = await UserModel.findOne({ email });
        if ( !user ) throw CustomError.internalServer('Email not exists');

        user.emailValidated = true;
        await user.save();

        return true;
    };
}