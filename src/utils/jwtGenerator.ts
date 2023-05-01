import jwt from 'jsonwebtoken';
import { I_JwtToken } from '../interfaces/interfaces';

const jwtGenerator = (user_id: string):I_JwtToken => {
    const payload = {
        user: user_id,
    }
    const accessToken: string = jwt.sign(payload, process.env.JWT_KEY, {expiresIn: '15m'});
    const refreshToken: string = jwt.sign(payload, process.env.JWT_KEY, {expiresIn: '1hr'});
    return ({accessToken, refreshToken});
}

export default jwtGenerator;