const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views');
app.set('view engine', 'ejs');


app.get(['', '/home'], (req, res) => {
  res.render('index');
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

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
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