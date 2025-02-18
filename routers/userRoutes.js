const express = require('express');

const UserRouter = express.Router();

const {handelToUserSignUp , handelToLoginUser , handelToGetAllUser , handelToUpdateUser , handelToSendForgotLinkOnUserMail , handelToUpdatePassword} = require('../controllers/userController.js')
const {verifyUserToken } = require('../controllers/authController');
const {authorizedApiRequest} = require('../middlewares/verifyToken.js');

UserRouter.get('/verify-token',verifyUserToken);
UserRouter.post('/sign-up',handelToUserSignUp);
UserRouter.get('/login',handelToLoginUser);
UserRouter.get('/all-user',authorizedApiRequest,handelToGetAllUser);
UserRouter.post('/update-user',authorizedApiRequest,handelToUpdateUser);
UserRouter.get('/forgot-password',handelToSendForgotLinkOnUserMail);
UserRouter.post('/updatePassword',authorizedApiRequest,handelToUpdatePassword);

module.exports = UserRouter;