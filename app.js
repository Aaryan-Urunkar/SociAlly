const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const UserModel = require('./model/User');
const { auth } = require('express-openid-connect');

require('dotenv').config();

const uri = `mongodb+srv://Oren:${process.env.MONGOPASS}@socially.whgla2v.mongodb.net/socially?retryWrites=true&w=majority`;
const app = express();
const port = 3000;

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (e) {
    console.error(e);
  }
}
connect();

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
  const ngo = JSON.parse(req.params.ngo);
  const locationInfo = req.oidc.user.email;
  let userNgos = 0;
  await UserModel.findOne({ email: locationInfo }).then((user) => {
    userNgos = user.ngos;
  });
  if (userNgos.find((userNgo) => userNgo.title == ngo.title)) {
    console.log('Exists already');
  } else {
    await UserModel.findOneAndUpdate(
      { email: locationInfo },
      { $push: { ngos: ngo } }
    ).then(() => console.log('Added ngo'));
  }
});

app.post('/', async (req, res) => {
  const prompt = req.body.prompt.trim();

  try {
    const aiResponse = await getResponse(prompt);

    const userMessage = userDiv(prompt);
    const botMessage = userDiv(aiResponse);

    res.send(`
      ${userMessage}
      ${botMessage}
    `);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});
