import db from "../db";
import {Request, Response} from "express";
import bcrypt from 'bcrypt';

import jwtGenerator from "../utils/jwtGenerator";
import { I_JwtToken } from "interfaces/interfaces";
import jwt from 'jsonwebtoken';
import { User } from "@prisma/client";
import UserController from "./userController";

class AuthController {

    async register (req: Request, res: Response) {
        try {
            const user = { ...req.body};
            const newUser = await UserController.createUser(user);

            if(newUser) {
                const tokens: I_JwtToken = jwtGenerator(newUser.id);
                res.cookie('refresh_token', tokens.refreshToken, {httpOnly: true});
                res.json({...tokens, user: newUser});
            } else {
                res.status(401).send("User exist");
            } 
            
        } catch(e) {
            console.log(e);
            res.status(500).send('server error');
        }

    }
    
    async login (req: Request, res: Response) {
        try {
            const {email, password} = req.body;
            const user = await db.user.findFirst({where: {email: {equals: email}}});
            if(!user) {
                return res.status(401).json("User does not exist");
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if(!validPassword) {
                return res.status(401).json('Password is not correct');
            }

            const tokens: I_JwtToken = jwtGenerator(user.password);
            res.cookie('refresh_token', tokens.refreshToken, {httpOnly: true});
            res.json({...tokens, user});

        } catch (error) {
            console.log(error);
            return res.status(500).json({error: error.message});
        }
    }

    async refresh (req: Request, res: Response) {
        try {
            const refreshToken: string = req.cookies.refresh_token;
            if(refreshToken === null){
                return res.status(401).json({error: 'Null refresh token'});
            }

            jwt.verify(refreshToken, process.env.JWT_KEY, (error: Error, user: User) => {
                if(error) return res.status(403).json({error: error.message});
                let tokens: I_JwtToken = jwtGenerator(user.id);
                res.cookie('refresh_token', tokens.refreshToken, {httpOnly: true});
                res.json(tokens);
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({error: error.message});
        }
    }

    async logout (req: Request, res: Response){
        try {
            res.clearCookie('refresh_token');
            return res.status(200).json({message: 'refresh_token deletes'})
        } catch (error) {
            console.log(error);
            return res.status(500).json({error: error.message});
        }
    }
    
}

export default new AuthController;