import jwt from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SECRET;

export class JwtAdapter {

    static generateToken( payload: any, duration: number = 2000000 ) {

        return new Promise( (resolve) => {
            jwt.sign( payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
                if (err) return resolve(null);

                return resolve(token);
            });
        })

    }

    static validateToken( token: string ) {

        console.log(token);

        return new Promise( (resolve) => {
            jwt.verify( token, JWT_SEED, (err, decoded) => {
                console.log(err)
                if (err) return resolve(null);

                return resolve(decoded);
            });
        })
    }
}