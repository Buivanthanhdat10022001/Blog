const express = require('express');
const router = express.Router();
const Post = require('../models/post')
const User = require('../models/user')
const adminLayout = ('../views/layouts/admin')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtsecret = process.env.JWTMYSERCET

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message: 'Unauthorized'})
    }
    
    try {
        const decode = jwt.verify(token,jwtsecret );
        req.userId =decode.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized'})
    }
}




router.get('/admin', async (req, res, next) => {
    

    try {
        const local = {
            title: "Admin",
            description: ' '
        }
        
        res.render('admin/index', { 
          local,
          layout: adminLayout
        });
    }catch(error){
        console.log(error);
    }

    
})


router.post('/admin', async (req, res, next) => {
    try {
        const {username , password} = req.body;
        
        const user = await User.findOne({username});

        if(!user){
           return res.status(401).json({message: ' Invalid credentials'})
        }

        const ispassword = await bcrypt.compare(password, user.password);

        if(!ispassword) {
            return res.status(401).json({message: ' Invalid credentials'})
        }

        const token = jwt.sign({userId: user._id}, jwtsecret)
        res.cookie('token',token, {httpOnly: true});
        res.redirect('/dashboard')

    }catch(error){
        console.log(error);
    }

    
})

router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
      const locals = {
        title: 'Dashboard',
        description: 'Simple Blog created with NodeJs, Express & MongoDb.'
      }
  
      const data = await Post.find();
      res.render('admin/dashboard', {
        locals,
        data,
        layout: adminLayout
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });

  router.get('/add-post', authMiddleware, async (req, res) => {
    try {
      const locals = {
        title: 'Add Post',
        description: 'Simple Blog created with NodeJs, Express & MongoDb.'
      }
  
      const data = await Post.find();
      res.render('admin/add-post', {
        locals,
        layout: adminLayout
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });
  

  router.post('/add-post', authMiddleware, async (req, res) => {
    try {
      try {
        const newPost = new Post({
          title: req.body.title,
          body: req.body.body
        });
  
        await Post.create(newPost);
        res.redirect('/dashboard');
      } catch (error) {
        console.log(error);
      }
  
    } catch (error) {
      console.log(error);
    }
  });
  

  router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
  
      const locals = {
        title: "Edit Post",
        description: "Free NodeJs User Management System",
      };
  
      const data = await Post.findOne({ _id: req.params.id });
  
      res.render('admin/edit-post', {
        locals,
        data,
        layout: adminLayout
      })
  
    } catch (error) {
      console.log(error);
    }
  
  });
  
  
  router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
  
      await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        updatedAt: Date.now()
      });
  
      //res.redirect(`/edit-post/${req.params.id}`);
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }
  
  });

  router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

    try {
      await Post.deleteOne( { _id: req.params.id } );
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }
  
  });


router.post('/register', async (req, res, next) => {
    try {
        const {username, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({username, password:hashPassword});
            res.status(201).json({message: 'User creater', user});

        } catch (error) {
            if(error.code === 11000){
                res.status(409).json({message: 'User already'})
            }
            res.status(500).json({message: 'internal server error'});
        }

        
    }catch(error){
        console.log(error);
    }

    
})

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
  });


module.exports = router;