import {Request, Response} from "express";
import { User } from "@prisma/client";
import { randomUUID } from "crypto";
import bcrypt from 'bcrypt';
import fs from "fs";
import generatePDF from "../utils/pdfGenerator";

import db from "../db";

class UserController {

    async createUser (user: User) {
        try {
            const userFromDatabase: User = await db.user.findFirst({where: {email: {equals: user.email}}});
                
            if(userFromDatabase) {
                return null;
            }

            const saltRound: number = 10;
            const salt: string = await bcrypt.genSalt(saltRound);

            const bcryptPassword: string = await bcrypt.hash(user.password, salt);

            const newUser = await db.user.create({
                data: {
                    id: randomUUID(),
                    email: user.email,
                    password: bcryptPassword,
                    lastName: user.lastName,
                    firstName: user.firstName,
                    image: user.image,
                }
            })

            return newUser;

        } catch(e) {
            return e;           
        }
    }

    async addUserImage(req: Request, res: Response) {
        try {
            const filedata: string = `${__dirname}/../../storage/images/${req.file.filename}`;
            const user_id: string = req.params.id;

            const userFromDatabase: User = await db.user.findFirst({where: {id: {equals: user_id}}});
            if(!userFromDatabase) {
                return res.status(404).send("No user with that id");
            }     
            
            if(userFromDatabase.image) {
                fs.unlinkSync(userFromDatabase.image);
            }

            userFromDatabase.image = filedata;

            const updateUser: User = await db.user.update({where: { id: user_id}, data: {...userFromDatabase},});
            return res.send(updateUser);
            
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
    
    async getUserById(req: Request, res: Response) {
        try {
            const user_id: string = req.params.id;
            const user: User = await db.user.findFirst({where: {id: {equals: user_id}}});
            if(!user) {
                res.status(404).send("No users with that id");
            }
            res.send(user);
        } catch (error) {
            res.status(500).send(error.message);
        }        
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users: User[] = await db.user.findMany();
            res.json(users);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async updateUser(req: Request, res: Response) {

        try {
            const user_id : string = req.params.id;
            const userFromDatabase: User = await db.user.findFirst({where: {id: {equals: user_id}}});

            if(!userFromDatabase) {
                return res.status(404).send("No user with that id");
            }     

            if(req.body.firstName) {
                userFromDatabase.firstName = req.body.firstName;
            }
            if(req.body.lastName) {
                userFromDatabase.lastName = req.body.lastName;
            }
            
            const updateUser: User = await db.user.update({where: { id: user_id}, data: {...userFromDatabase},});
            return res.send(updateUser);
        } catch (error) {
            return res.status(500).send(error.message);
        }

        
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const user_id : string = req.params.id;
            const user = await db.user.findFirst({where: {id: {equals: user_id}}});
            if(user.image) {
                fs.unlinkSync(user.image);
            }

            const {count} = await db.user.deleteMany({where: {id: user_id}});
            if(!count) {
                return res.status(404).send("No user with that id");
            }     

            res.send("deleted");

        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

    async createPDF(req: Request, res: Response) {
        try {

            const user_email: string = req.body.email;
            
            const user: User = await db.user.findFirst({where: {email: {equals: user_email}}});
            if(!user) {
                res.status(404).send("No users with that email");
            }

            if(!user.image) {
                res.status(404).send("User does not have an image");
            }
        
            generatePDF(user.firstName, user.lastName, user.image, async (blob: Blob) => {
                const arrayBuffer: ArrayBuffer = await blob.arrayBuffer();
                const buffer: Buffer = Buffer.from(arrayBuffer);

                const updateUser: User = await db.user.update({where: {email: user_email}, data: {pdf: buffer}});
            });

            res.json(true);

        } catch (error) {
            res.status(500).send(error.message);
        }        
    }

}

export default new UserController;