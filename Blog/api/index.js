const express= require('express')
const app = express()
const cors = require('cors')
const mongoose=require('mongoose')
const bcrypt = require('bcryptjs')
const jwt =require('jsonwebtoken')
const User = require('./models/User')
const Post= require('./models/Post')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const uploadMiddleware = multer({dest:'uploads/'})
const fs = require('fs')
app.use(cors({credentials:true,origin:'http://localhost:5173'}))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads',express.static(__dirname+ '/uploads'))


const salt = bcrypt.genSaltSync(10)
const  secret = "vhjbjvvh/nbhvvkvvtftg954447"

mongoose.connect("your mongodb url")

app.post('/register' , async (req,res) =>{

    const {username,password}=req.body;
    try{
        const UserDoc = await User.create({username,
            password:bcrypt.hashSync(password,salt)})
            res.json(UserDoc)
    }
    catch(e){
        console.log(e)
        res.status(400).json(e.message)
    }
})
app.post('/login', async (req,res)=>{
    const {username,password} = req.body;
    const UserDoc =  await User.findOne({username})
    const passOk = bcrypt.compareSync(password,UserDoc.password)
    if (passOk){
        //logged in
        jwt.sign({username,id:UserDoc._id},secret,{},(err,token)=>{
            if (err) throw err;
            res.cookie('token', token).json({
                id:UserDoc._id,
                username
            })
        })

    }else{
        res.status(400).json("wrong credentials")
    }
})
app.get('/profile',(req,res)=>{
    const {token}=req.cookies
    jwt.verify(token,secret,{},(err,info)=>{
        if (err) throw err
        res.json(info)
    })
})
app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok')
})
app.post('/post',uploadMiddleware.single('file'),async (req,res)=>{
    res.json({files:req.file})
    const {originalname,path}= req.file
    const parts = originalname.split('.')
    const ext = parts[parts.length -1]
    const NewPath=path+'.'+ext
    fs.renameSync(path,NewPath)

    const {token}=req.cookies
    jwt.verify(token,secret,{},async (err,info)=>{
        if (err) throw err
        const {title,summary,content}=req.body

        const PostDoc = await Post.create({
            title,
            summary,
            content,
            cover:NewPath,
            author:info.id
    })
     
    
    })
    
    

    
   

})

app.put('/post',uploadMiddleware.single('file'), async (req,res) => {
    let newPath = null;
    if (req.file) {
      const {originalname,path} = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path+'.'+ext;
      fs.renameSync(path, newPath);
    }
  
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
      if (err) throw err;
      const {id,title,summary,content} = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('you are not the author');
      }
      await postDoc.updateOne({
        title,
        summary,
        content,
        cover: newPath ? newPath : postDoc.cover,
      });
  
      res.json(postDoc);
    });
  
  });


app.get('/post',async (req,res)=>{
    res.json(await Post.find().populate('author',['username']).sort({createdAt:-1}).limit(20))
})

app.get('/post/:id',async (req,res)=>{
    const {id}=req.params
    const postDoc=await Post.findById(id).populate('author',['username'])
    res.json(postDoc)
})

app.listen(4000)