import { bcryptAdapter, jwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity, LoginUserDto } from "../../domain";


export class AuthService {

    constructor () {}

    public async registerUser( registerUserDto: RegisterUserDto ) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if ( existUser ) throw CustomError.badRequest('Email already exists');

        try {
            const user = new UserModel(registerUserDto);
            
            user.password = bcryptAdapter.hash(registerUserDto.password);
            await user.save();
            
            const { password, ...userEntity } = UserEntity.fromObject(user);

            return {
                user: userEntity,
                token: '123'
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async loginUser( loginUserDto: LoginUserDto ) {

        try {
            const user = await UserModel.findOne({ email: loginUserDto.email });
            if ( !user ) throw CustomError.badRequest('Email not exist');

            const isValidPassword = bcryptAdapter.compare(loginUserDto.password, user.password);
            if ( !isValidPassword ) throw CustomError.badRequest('Invalid email or password');

            const { password, ...userEntity } = UserEntity.fromObject(user);

            const token = await jwtAdapter.generateToken({ id: user.id })
            if ( !token ) throw CustomError.internalServer('Error generating token');


            return {
                user: userEntity,
                token: token
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}