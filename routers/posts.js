import express from 'express';
import { User } from '../models/userModel';
import { authenticateToken } from './users.js';
import {Post} from '../models/postModels';


const router = express.Router();

router.post('/create', authenticateToken, async (req, res)=>{
    const user = await User.findOne(req.id);
    if(user === null) return res.status(400).json({message: 'User not found'})

    let post = new Post({user_id: user.id});

    if(req.body.desc) post.desc = req.body.desc
    if(req.body.image) post.image = req.body.image

    await post.save();
    return res.status(201).json({message: 'Post created successfully'});
});



// get all post
router.get('/get-all', authenticateToken, async (req, res)=>{
    const user = await User.findOne(req.id);
    if(user === null) return res.status(400).json({message: 'User not found'})
    // const relationships = await Relationships.findAll({
    //     where: {
    //       followeruserid: followedUserId,
    //     },
    //   });
    //   const followedUserPosts = [];
    
    //   for (const relationship of relationships) {
    //     const followedUserPost = await Post.findOne({
    //       where: {
    //         id: relationship.followeduserid,
    //       },
    //     });
    
    //     if (followedUserPost) {
    //       followedUserPosts.push(followedUserPost);
    //     }
    //   }

    const posts = await Post.findAll({
        where: {user_id: user.id},
        attributes: {exclude: ['updatedAt']},
    })
    res.status(200).json({data: posts});
});


// delete post
router.delete('/delete/:post_id', authenticateToken, async (req, res)=>{
    const user = await User.findOne(req.id);
    if(user === null) 
        return res.status(404).json({message: 'User not found'})

    const post = await Post.findOne({where: {
        user_id: user.id,
        id: req.params.post_id,
    }});

    if(post === null) 
        return res.status(404).json({message: 'Post not found'})

    await post.destroy();
    return res.status(204).json({message: 'Post deleted successfully'})
});


export default router