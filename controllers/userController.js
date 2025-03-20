const jwt = require('jsonwebtoken')
const { createUser, authLogin, getAllUserData, updateUserData, verifyEmailId, updateUserPassword } = require('../models/userModel')
const nodemailer = require('nodemailer');

// user Login api endpoint http://localhost:8080/api/user/sign-up
const handelToUserSignUp = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(500).json({ mag: 'wrong body parse ' })
        }       
        const { avatar, first_name, last_name, bio, email, date_of_birth, password, phone_number } = req.body;
        
        if (!first_name || !last_name || !email || !password) {
            return res.status(401).json({ mag: 'user credential are required for sign-up' })
        }        
        try {
            const signUpUser = await createUser({ avatar, first_name, last_name, bio, email, date_of_birth, password, phone_number })
            return res.status(201).json({ msg: "User created successfully", user: signUpUser });
        } catch (error) {
            console.error("Error creating user:", error);            
            
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ msg: "Email already exists" });
            }
            return res.status(500).json({ msg: "Internal server error while create new user", error: error.message });
        }
        
    } catch (error) {
        return res.status(500).json({ msg: "Internal server error", error: error.message });
    }
}


// user Login api endpoint http://localhost:8080/api/user/login
const handelToLoginUser = async (req, res) => {
    try {
        // console.log(req)
        const { email, password } = req.query;

        if (!email || !password) {
            return res.status(401).json({ mag: 'user credential are required for login' })
        }


        try {
            const loginUser = await authLogin({ email, password });

            if (!loginUser || loginUser.length === 0) {
                return res.status(404).json({ msg: "User not found" });
            }

            // return res.status(200).json({
            //     msg: "User login successful",
            //     user: loginUser[0],
            // });

            const payLoad = {
                id: loginUser[0].id,
                first_name: loginUser[0].first_name,
                last_name: loginUser[0].last_name,
                email: loginUser[0].email,
                date_of_birth: loginUser[0].date_of_birth
            }
            const Secret_Key = process.env.AUTH_SECRET_KEY;
            const token = jwt.sign(payLoad, Secret_Key, { expiresIn: '1h' });

            return res.status(200).json({
                msg: "User login successful",
                token,
                payLoad
            });


        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({ msg: "Internal server error while login user", error: error.message });
        }

    } catch (error) {
        return res.status(500).json({ msg: "Internal server error", error: error.message });
    }
}


// get all user api endpoint https://locahost:8080/api/user/all-user
const handelToGetAllUser = async (req, res) => {
    try {
        const allUserData = await getAllUserData();

        if (!allUserData) {
            return res.status(204).json({ msg: 'trouble to get all user data' })
        }

        return res.status(200).json({ msg: 'healthy response', allUserData })

    } catch (error) {
        return res.status(500).json({ msg: "Internal server error", error: error.message });
    }
}

// update user data api endpoint https://localhost:8080/api/user/update-user
const handelToUpdateUser = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(500).json({ mag: 'wrong body parse ' })
        }
        const { avatar, first_name, last_name, bio, email, date_of_birth, phone_number } = req.body;
        if (!email) {
            return res.status(401).json({ mag: 'user credential are required for sign-up' })
        }

        try {
            const signUpUser = await updateUserData({ avatar, first_name, last_name, bio, email, date_of_birth, phone_number })
            return res.status(201).json({ msg: "User update successfully", user: signUpUser });
        } catch (error) {
            console.error("Error creating user:", error);

            // change from here
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ msg: "Email already exists" });
            }

            return res.status(500).json({ msg: "Internal server error while create new user", error: error.message });
        }
    } catch (error) {
        return res.status(500).json({ msg: "Internal server error", error: error.message });
    }
}

// send forgot link on mail api endpoint https://locahost:8080/api/user/forgot-password
const handelToSendForgotLinkOnUserMail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(401).json({ msg: 'forgot credential required' });
        }

        const isValidUser = await verifyEmailId(email);

        if (!isValidUser) {
            return res.status(404).json({ msg: 'user not found' })
        }

        const sendEmailToUser = async (email, url) => {

            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.OFFICIAL_EMAIL,
                        pass: process.env.OFFICIAL_EMAIL_PASSWORD,
                    }
                });

                // Set up the mail options
                const mailOptions = {
                    from: 'vishal.kumar.17.official@gmail.com',
                    to: email,
                    subject: `Forgot Your kortex password`,
                    html: updatePassEmailSchema(url),
                };

                // Send the email
                await transporter.sendMail(mailOptions);
                console.log('Email sent successfully.');
                return true;

            } catch (error) {
                console.log('Error while sending OTP email:', error);
                return false; // Return false if email fails to send
            }
        }
        
        const payload = {
            email: isValidUser[0].email,
            first_name: isValidUser[0].first_name,
            last_name: isValidUser[0].last_name,
        }

        
        const Secret_Key = process.env.AUTH_SECRET_KEY;
        const updatePasswordToken = jwt.sign(payload, Secret_Key, { expiresIn: '5m' });
        
        const url = `${process.env.IS_LIVE==='true'?'https://vishalkumar1007.github.io':'http://localhost:5173'}/user-management-system/auth/forgot-password?token=${updatePasswordToken}&open=${true}`;
        console.log(url);
        const emailSent = await sendEmailToUser(email,url);

        if(!emailSent){
            console.log('email not sent');
            return res.status(500).json({ msg: 'server error while sending email' });
        }
        res.status(200).json({msg: 'check mail to update your password' });


    } catch (error) {
        console.log('error in forgot password ', error)
        res.status(500).json({ msg: 'internal server error' })
    }
}

// html schema for email
const updatePassEmailSchema = (url) => {
    return (
        `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password update</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #0c0e12;
            margin-top: 60px;
        }

        .container {
            width: 90%;
            max-width: 600px;
            margin: auto auto;
            background-color: #171717;
            border: 2px solid #8b8b8b8a;
            box-shadow: 0 0 15px #414141ae;
            color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
        }

        .header_x {
            color: #242222;
            text-align: center;
        }

        .header_x h2 {
            font-size: 40px;
            font-weight: bold;
            background-image: linear-gradient(to right, #818cf8, #c084fc);
            color: transparent;
            background-clip: text;
        }

        .header_x p a {
            color: #6e696969;
            text-align: center;

        }

        .header_title {
            font-size: 13px;
            color: #6e696969;
        }

        .content {
            text-align: center;
            padding: 5px 40px 40px 40px;    
            color: #dcdcdc;
        }

        .content p {
            color: #5b5a5c;
            font-size: 16px;
            line-height: 1.5;
        }

        .content h1 {
            color: #2ea89e;
        }

        .footer {
            text-align: center;
            padding: 10px 0px 5px 0px;
            font-size: 12px;
            color: #7b7a7a;
        }

        #xht {
            font-size: 19px;
            color: #818cf8;
        }

        #xht2 {
            font-size: 13px;
            color: rgb(192, 45, 31);
        }

        #xht3 {
            font-size: 12px;
            color: rgb(112, 114, 114);
        }

        #xht3 a {
            font-size: 12px;
            color: rgb(62, 156, 167);
        }
        #update_pass_btn{
            background-color: #2ea89e;
            width: 90px;
            height: 35px;
            border: none;
            border-radius: 7px;
            margin: 10px 0px 20px 0px;
            cursor: pointer;
        }
        #update_pass_btn:hover{
            background-color: #2a9c92;
        }
            #update_pass_btn a{
            text-decoration: none;
            color: rgb(233, 233, 233);
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header_x">
            <h2>Kortex</h2>
            <!-- <p class="header_title"><a href="https://vishalkumar07.me">by vishalkumar07.me</a></p> -->
        </div>
        <div class="content">
            <p id="xht">
                Click bellow to update your password
            </p>
            <Button id="update_pass_btn"><a href=${url}>Update</a></Button>
            <p id="xht2">Note : This update link is valid for only 5min</p>
            <p id="xht3">Trouble in update Password ? <a href="https://vishalkumar07.me">report</a></p>
        </div>
        <div class="footer">
            &copy; 2025 vishalkumar07. All rights reserved.
        </div>
    </div>
</body>

</html>`
    )
}

const handelToUpdatePassword = async (req,res)=>{
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({msg:'credential required'});
        }

        const updatingPassword = await updateUserPassword({email,password});

        if(!updatingPassword){
            return res.status(404).json({msg:'trouble to update password , may user invalid'})
        }

        res.status(200).json({msg:'Password update successfully'});

    } catch (error) {
        res.status(500).json({msg:'internal Server error'})
    }
}


module.exports = { handelToUserSignUp, handelToLoginUser, handelToGetAllUser, handelToUpdateUser, handelToSendForgotLinkOnUserMail, handelToUpdatePassword }