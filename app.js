const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const UserModel = require('./model/User');
const { auth } = require('express-openid-connect');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const uri = `mongodb+srv://Oren:${process.env.MONGOPASS}@socially.whgla2v.mongodb.net/socially?retryWrites=true&w=majority`;
const app = express();
const port = 3000;
const corsOptions = {
  origin: "*", // Allow all origins
  credentials: true // Enable credentials
};
async function connect() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (e) {
    console.error(e);
  }
}
connect();
let socket;
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
const server = http.createServer(app);
const io = socketIo(server, {
  cors: corsOptions 
});
io.on('connection', (socketConnection) => {
  console.log('client connected');
  socket=socketConnection;
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

async function saveUser(userFlag, username, email) {
  if (userFlag) {
    return;
  }
  const user = new UserModel({
    username: username,
    email: email,
  });
  await user
    .save()
    .then(() => console.log('User created'))
    .catch((err) => console.error(err));
}
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASEURL,
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUER,
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/img'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(auth(config));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get(['', '/home'], (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.redirect('/dashboard');
  } else {
    res.render('index');
  }
});
app.get('/callback', (req, res) => {
  res.redirect('/dashboard');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/signup', (req, res) => {
  res.render('sign-up/signup');
});

app.get('/nearbyactivity', (req, res) => {
  res.render('nearbystuff');
});

app.get('/findyourgroup', (req, res) => {
  res.render('findYourGroup');
});

app.get('/finalpage', (req, res) => {
  res.render('finalPage');
});

app.get('/enroll', (req, res) => {
  res.render('enroll');
});
const isAuthenticated = (req, res, next) => {
  if (req.oidc.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
};
app.get('/dashboard', isAuthenticated, async (req, res) => {
  console.log('Accessing dashboard route');

  const username = req.oidc.user.name;
  const locationInfo = req.oidc.user.email;
  const pictureUrl = req.oidc.user.picture;

  await UserModel.findOne({ email: locationInfo })
    .then((user) => saveUser(user, username, locationInfo))
    .catch((err) => console.error(err));

  res.render('dashboard', {
    username: username,
    location: locationInfo,
    picture: pictureUrl,
  });
  console.log('Username:', username);
  console.log('Location:', locationInfo);
});

app.get('/get-user-groups', async (req, res) => {
  const locationInfo = req.oidc.user.email;
  let groupArr = [];
  await UserModel.findOne({ email: locationInfo }).then(
    (user) => (groupArr = user.groups)
  );
  res.json(groupArr);
});
app.get('/get-user-ngos', async (req, res) => {
  const locationInfo = req.oidc.user.email;
  let ngoArr = [];
  await UserModel.findOne({ email: locationInfo }).then(
    (user) => (ngoArr = user.ngos)
  );
  res.json(ngoArr);
});

app.put('/add-user-group/:group', async (req, res) => {
  const group = JSON.parse(req.params.group);
  const locationInfo = req.oidc.user.email;
  let userGroups = 0;
  await UserModel.findOne({ email: locationInfo }).then((user) => {
    userGroups = user.groups;
  });
  if (userGroups.find((userGroup) => userGroup.name == group.name)) {
    console.log('Exists already');
  } else {
    await UserModel.findOneAndUpdate(
      { email: locationInfo },
      { $push: { groups: group } }
    ).then(() => console.log('Added group'));
  }
});

app.put('/add-user-ngo/:ngo', async (req, res) => {
  try {
    const ngo = JSON.parse(req.params.ngo);
    //console.log('Parsed NGO:', ngo);

    const locationInfo = req.oidc.user.email;
    let userNgos = [];
    await UserModel.findOne({ email: locationInfo }).then((user) => {
      userNgos = user.ngos;
      //console.log('User NGOs:', userNgos);
    });

    if (userNgos.find((userNgo) => userNgo.title == ngo.title)) {
      //console.log('NGO already exists');
      res.send('NGO already exists');
    } else {
      await UserModel.findOneAndUpdate(
        { email: locationInfo },
        { $push: { ngos: ngo } }
      );
      //console.log('NGO added successfully');
      res.send('NGO added successfully');
    }
  } catch (error) {
    //console.error('Error adding NGO:', error);
    res.status(500).send('Error adding NGO');
  }
});
const generationConfig = {
  stopSequences: ["red"],
  maxOutputTokens: 5,
  temperature: 0.9,
  topP: 0.1,
  topK: 16,
};

const model = genAI.getGenerativeModel({ model: "MODEL_NAME",  generationConfig });

app.post('/generate', async (req, res) => {
  const { base64Image, prompt } = req.body
  // console.log(base64Image, prompt);
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: 'image/png'
    },
  };
  try {
    let result
    if(base64Image){
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision"});
      result = await model.generateContentStream([prompt, imagePart]);
    } else {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" , generationConfig});
      result = await model.generateContentStream(prompt);
    }
    
    let text = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      console.log(chunkText);
      text += chunkText;
      if (socket) {
        try {
          socket.emit('content', chunkText);
        } catch (error) {
          console.error('Error emitting content:', error.message);
        }
      }
    }
    if (socket) {
      socket.disconnect();
    }
    res.status(200).json({message:"success"});
  } catch (err) {
    console.error('Error generating content:', err.message);
    res.status(500).json({ error: 'Error generating content' });
  }
});
