// Urls or Routers

import express from "express";
import { User } from "../models/userModel.js";
import pkg from "bcrypt";
import  jwt  from "jsonwebtoken";



const router = express.Router();

// create a user
router.post('/register', async (req, res)=> {
    const existUser = await User.findOne({where: {username: req.body.username}});
    if(existUser !== null){
        return res.status(409).json({message: 'User already registered'});
    }
    const salt = pkg.genSaltSync(10);
    const hashpassword = pkg.hashSync(req.body.password, salt);

    await User.create({
        fullName: req.body.fullName, username: req.body.username, 
        password: hashpassword, email: req.body.email
    }).then((data)=>{
        return res.status(201).json({message: "User created successfully"});
    }).catch((err)=>{
        return res.status(500).json({message: err});
    });

})


// login user
router.post('/login', async (req, res) => {
    const user = await User.findOne({
        where: {username: req.body.username}
    });
    if(user === null){
        return res.status(404).json({message: 'Invalid credentials'});
    }

    const checkPassword = pkg.compareSync(req.body.password, user.password);
    if(!checkPassword) 
        return res.status(400).json({message: 'Invalid credentials'}); 

    const accessToken = jwt.sign({id: user.id}, "secretKey");

    const userData = {
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        accessToken: accessToken
    }
    res.cookie("accessToken", accessToken, {
        httpOnly: true
    }).status(200).json({data: userData});
});



// logout the user
router.get('/logout', (req, res) => {
    res.clearCookie('accessToken', {
        secure: true,
        sameSite: 'none'
    }).status(200).json({message: 'User has benn logout'});
});




router.get('/:userId', async (req, res) =>{
    const user = await User.findOne(req.params.userId);
})


export default router