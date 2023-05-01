import {Request, Response, NextFunction} from "express";
import jwt from 'jsonwebtoken';

const authenticateToken = async (req, res: Response, next: NextFunction) => {

        const authHeader: string = req.headers.authorization;
        const token: string = authHeader && authHeader.split(" ")[1];

        if(token == null) return res.status(401).json({error: "Null token"});

        jwt.verify(token, process.env.JWT_KEY, (error, user) => {
            if(error) return res.status(403).json({error: error.message});
            req.user = user;
            next();
        });

} 

export default authenticateToken;