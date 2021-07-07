import { IUser } from './../interfaces/user.interface';
import { MESSAGES, SECRET_KEY, EXPIRETIME } from './../config/constans';
import jwt from 'jsonwebtoken';
import { IJwt } from '../interfaces/jwt.interface';

class JWT {

    private secretKey = SECRET_KEY as string;


    sign(data: IJwt ){
        return jwt.sign(
            { user: data.user},
            this.secretKey,
            { expiresIn: 24* 60 * 60}
        );
    }

    verify(token: string){
        try {
            return jwt.verify(token,this.secretKey);
        } catch (e) {
          return MESSAGES ; 
        }
    }
}

export default JWT;