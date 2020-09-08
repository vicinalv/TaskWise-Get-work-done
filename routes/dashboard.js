const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const {ensureAuthenticated, forwardAuthenticated} = require('../config/auth');
const Joi = require('@hapi/joi');

// PROTECTED HOME PAGE ROUTE
// router.get('/', forwardAuthenticated, (req, res) => res.send('success'));

router.get("/", ensureAuthenticated,async (req, res) => {
  try{
      const posts = await Post.find({userID:req.user._id});
      res.render('dashboard',{user:req.user, posts:posts});
      // console.log(`${req.user} has ${posts.length} tasks`)
      console.log(posts)
  }
  catch(err){
      res.json({err})
  }
  
});


router.post('/new',ensureAuthenticated,async (req,res)=>{
  // const obj = JSON.parse(JSON.stringify(req.body));
  // console.log(obj)
  console.log(req.body)
  const post = new Post({
      title:req.body.title,
      description:req.body.description,
      userID:req.user._id,
      subtitle:req.body.subtitle,
      category:req.body.category,
      tags:req.body.tags,
      time:req.body.time,
      image:req.body.image,
      date:req.body.date
  });
  try{
      const savedPost = await post.save()
      req.flash('success_msg', 'New task created !')
      res.redirect('/dashboard')
  }
 catch(err){
  res.json({message:err})
 }
    
});

// Specific post
router.get('/:postId', ensureAuthenticated,async (req,res)=>{
  try{
      const post = await Post.findById(req.params.postId);
      res.json(post);
  }
  catch(err){
      res.json({message:err});
  }
});

// Route for searching particular task
router.post('/search/:query', ensureAuthenticated,async(req,res)=>{
  try{
      const post = await Post.find({title:req.params.query})
      res.json(post);
  }catch(err){
      res.json({
          message:'Requested document was not found in database.'
      });
  }
})


// Delete a specific post
router.delete('/:postId', ensureAuthenticated,async (req,res)=>{
  console.log('found a delete request from frontend')
  try{
      const removedPost = await Post.deleteOne({_id:req.params.postId});
      req.method = 'GET'
      res.redirect('/dashboard')
    }
  catch(err){
      res.json({message:err})
  }
});

// Update a post
router.patch('/:postId',ensureAuthenticated,async (req,res)=>{
  try{
     const updatedPost = await Post.updateOne({_id:req.params.postId},{$set:{title:req.body.title}}
      );
      res.json(updatedPost);
  }
  catch(err){
      res.json({message:err});
  }
})



// // Dashboard PROTECTED ROUTE
// router.get('/',ensureAuthenticated,async(req,res)=>{
//     const posts = await Post.find({userID:req.user._id});
//         res.render('dashboard',{
//             user:req.user
//         })
//   })
    

// Get create route on dashboard
// post request to new note 
// Add new Ongoing task
// Make a new form in frontend which submits to /new and then save that post and render to frontend using ejs

router.post('/new',ensureAuthenticated,(req,res)=>{

})

module.exports = router;