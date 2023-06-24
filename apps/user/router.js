// Urls or Routers

import express from "express";
import { User } from "./userModel.js";
import pkg from "bcrypt";
import  jwt  from "jsonwebtoken";
import { config } from "dotenv";
import { authenticateToken, uploadImage } from "../../utils.js";


const router = express.Router();
config();




// create a user
router.post('/register', async (req, res)=> {
    const existUser = await User.findOne({where: {username: req.body.username}});
    if(existUser !== null){
        return res.status(409).json({message: 'User already registered'});
    }

    const salt = pkg.genSaltSync(10);
    const hashpassword = pkg.hashSync(req.body.password, salt);

    let user = await User.create({
        fullName: req.body.fullName, 
        username: req.body.username, 
        password: hashpassword, 
        email: req.body.email,
    }).catch((err)=>{
        return res.status(500).json({message: `${err}`});
    });
    return res.status(201).json({message: `Hello ${user.fullName}, Welcome to SocialMed`});
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

    const accessToken = jwt.sign({id: user.id}, 'securityKey', { expiresIn: '5h' });

    const userData = {
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        accessToken: accessToken
    }
    res.status(200).json({data: userData});
});



// logout the user
router.get('/logout', authenticateToken, (req, res) => {
    res.send('Logout successful');
});



// get user information
router.get('/detail', authenticateToken, async (req, res) =>{
    const user = await User.findOne({
        where: {id: req.id['id']}
    }).catch((err)=> res.status(500).send({message: err}));

    if(user===null){
        return res.status(404).send({message: 'User not found'});
    }
    return res.status(200).json(user);
    
});


// get user information
router.put('/add-profile', authenticateToken, async (req, res) =>{
    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const profile = uploadImage(req.files.profile, './mediafiles/users/');

    const user = await User.update({ profilePc: profile}, {
        where: {id: req.id['id']}
      }).catch((err)=>{
        return res.status(404).send({message: err});
      });

    if(user===null){
        return res.status(404).send({message: 'User not found'});
    }
    return res.status(200).json({message: 'Account updated successfully'});
});



export default router