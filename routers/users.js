// Urls or Routers

import express from "express";
import { User } from "../models/userModel.js";
import pkg from "bcrypt";
import  jwt  from "jsonwebtoken";
import { config } from "dotenv";




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

    const accessToken = jwt.sign({id: user.id}, 'process.env.SSECRET_KEY', { expiresIn: '5h' });

    const userData = {
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        accessToken: accessToken
    }
    res.status(200).json({data: userData});
});


// authorization logic
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token === null) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, 'environ.SECRET_KEY', (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
  
      req.user = user;
      next();
    });
}


// logout the user
router.get('/logout', authenticateToken, (req, res) => {
    res.send('Logout successful');
});



// get user information
router.get('/detail', authenticateToken, async (req, res) =>{
    const user = await User.findOne(req.id);
    if(user===null){
        return res.status(404).send({message: 'User not found'});
    }
    return res.status(200).json(user);
    
});


export default router