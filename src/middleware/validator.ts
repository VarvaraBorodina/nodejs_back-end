import {Request, Response, NextFunction} from "express";

const validator = async (req, res: Response, next: NextFunction) => {

    const email: string = req.body.email;
    const password: string = req.body.password;

    const validationErrors: Array<string> = [];

    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        validationErrors.push("Invalid email");
    }

    if (!(/[\w\[\]`!@#$%\^&*()={}:;<>+'-]{8,255}/).test(password)) {
        validationErrors.push("Invalid password");
    }

    if(!req.body.lastName) {
        validationErrors.push("No last name");
    }

    if(!req.body.firstName) {
        validationErrors.push("No first name");
    }

    if(validationErrors.length != 0) {
        return res.status(400).send({validationErrors})
    }

    next();
} 

export default validator;