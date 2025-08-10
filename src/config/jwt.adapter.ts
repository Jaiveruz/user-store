import jwt from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SECRET;

export class jwtAdapter {

    static generateToken( payload: any, duration: number = 2 ) {

        return new Promise( (resolve) => {
            jwt.sign( payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
                if (err) return resolve(null);

                return resolve(token);
            });
        })

    }

    static validateToken( token: string ) {
        throw new Error('Method not implemented.');
    }
}