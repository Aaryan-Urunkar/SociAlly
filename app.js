const express = require('express');
const bodyParser = require('body-parser');
const { auth } = require('express-openid-connect');
require('dotenv').config();

const app = express();
const port = 3000;

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASEURL,
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUER
};


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))
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
  res.render('sign-up');
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
app.get('/dashboard', isAuthenticated, (req, res) => {
  console.log("Accessing dashboard route");

  const username = req.oidc.user.name;
  const locationInfo = req.oidc.user.email;
  const pictureUrl = req.oidc.user.picture;

  res.render('dashboard', { username: username, location: locationInfo, picture: pictureUrl });
  console.log('Username:', username);
  console.log('Location:', locationInfo);
  
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
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});