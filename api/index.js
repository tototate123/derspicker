console.log("_________________")
console.log("Loading...")
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

const RegisterEnabled = true; // Hier kann die Regestrierung Deaktiviert werden.

const getTimeStamp = () => {
  const now = new Date();
  return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
};

console.log(`[${getTimeStamp()}] Sucsessfully loaded. Generating security code...`);

const salt = bcrypt.genSaltSync(10);
const secret = "a98p5746nvglt8k90ij7";

console.log(`[${getTimeStamp()}] Sucsess. Connecting to database...`);

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'))
try {
  mongoose.connect('mongodb+srv://blog:44ALylZE78l5Bf23@cluster0.8kxnxmv.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log(`[${getTimeStamp()}] Connected to database. Waiting for requests...`);
  })
  .catch((err) => {
    console.log(`[${getTimeStamp()}] Can't connect to database!`);
    console.error(err);
  });
} catch (error) {
 console.log(`[${getTimeStamp()}] [ERROR INFO] Couldn't connect to database!`) 
}

if (RegisterEnabled) {
    app.post('/register', async (req,res) => {
      const {username,password} = req.body;
      try{
        const userDoc = await User.create({username, password:bcrypt.hashSync(password,salt)});
        console.log(`[${getTimeStamp()}] New User created:`, req.body, userDoc);
        res.json(userDoc);
      } catch(e){
        console.error(e);
        console.log(`[${getTimeStamp()}] ^ Username Already in use`);
        res.status(400).json(e);
      }
    });
}
else {
app.post('/register', (req,res) =>{
  const {username,password} = req.body;
res.status(400).json("RegisterNotEnabled");
console.log(`[${getTimeStamp()}] Client "${username}" tried to Register, but Registration is Disabled.`)
})
}


//Einloggen

app.post("/login", async (req,res) => {
  const {username,password} = req.body;
  const userDoc = await User.findOne({username});
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    //Passwort richtig? Dann einloggen
    jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
      if(err) throw err;
      res.cookie('token', token).json({
        id:userDoc._id,
        username,
      });
      console.log(`[${getTimeStamp()}] User "${username}" logged in successfully.`);
    })

  }else {
    console.log(`[${getTimeStamp()}] User "${username}" tried to login.`)
    res.status(400).json('falsche eingabe');
  }
});


app.get('/profile', (req,res) => {
  try{
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err,info) => {
    if (err) throw err;
    res.json(info);
  });
  } catch (e){
    //if (e) throw e;
    console.log(`[${getTimeStamp()}] [ERROR INFO] Client didn't provide a jwt token`)
  }
});


app.post('/logout', (req, res) => {
  const { token } = req.cookies;
  const decodedToken = jwt.decode(token);
  const username = decodedToken.username;
  console.log(`[${getTimeStamp()}] User "${username}" has logged out.`);
  res.cookie('token', '').json("ok");
});
  
//2:32:40

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  try {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    const { title, summary, content } = req.body;
    fs.renameSync(path, newPath);

    if (!title || !summary || !content) {
      console.log(`[${getTimeStamp()}] Post creation failed due to missing information.`);
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
      if (err) throw err;
      
      const postDoc = await Post.create({ //Post wird erstellt
        title,
        summary,
        content,
        cover: newPath,
        author:info.id,
      });
      res.json(postDoc);
      console.log(`[${getTimeStamp()}] Post with file/picture name "${originalname}" uploaded. File: "${newPath}"`);
      console.log(`[${getTimeStamp()}] Post information: ${postDoc}`);
      console.log(`[${getTimeStamp()}] Post creation complete.`);
    });
  } catch (err) {
    console.log(`[${getTimeStamp()}] Someone tried to create an empty/incomplete post.`);
    console.log(`[${getTimeStamp()}] Post creation failed.`);
    res.status(400).send({ message: "Failed" });
  }
});


  
app.get('/post', async (req,res) => {
  //console.log(`[${getTimeStamp()}] Client loaded Posts`);
  res.json(await Post.find().populate('author', ['username']).sort({createdAt: -1}).limit(20)); //NUR MAX. DIE NEUESTEN 20 POSTS WERDEN GESCHICKT
})


app.get('/post/:id', async(req, res) => {
  try{
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
  console.log(`[${getTimeStamp()}] Post "${id}" with title "${postDoc.title}" was requested.`)
  }
  catch {
    console.log(`[${getTimeStamp()}] [ERROR INFO] Post was requested, but couldn't be processed.(Post diddn't exist)`);
  }
})

app.listen(4000);


