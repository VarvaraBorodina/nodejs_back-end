import { Router } from "express";
import authenticateToken from "./middleware/authorization";
import validator from "./middleware/validator";

import AuthController from "./controllers/authConstoroller";
import UserController from "./controllers/userController";

import upload from "./upload/upload";

const router: Router = Router();

router.post('/regist', validator, AuthController.register);
router.post('/login', AuthController.login);
router.get('/refreshToken', AuthController.refresh);
router.delete('/logout', AuthController.logout);

router.get('/getAllUsers', authenticateToken, UserController.getAllUsers);
router.get('/getUserById/:id', authenticateToken, UserController.getUserById);

router.put('/updateUser/:id', authenticateToken, UserController.updateUser);
router.post('/uploadImage/:id', [authenticateToken, upload.single('image')], UserController.addUserImage);

router.delete('/deleteUser/:id', authenticateToken, UserController.deleteUser);

router.get('/createPDF', authenticateToken,  UserController.createPDF)

export default router;