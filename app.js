const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

//Load  Models 
require('./models/User');
require('./models/Story');

//Passport config
require('./config/passport')(passport);
require('./config/passport-fb')(passport);

// load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

//load keys 
const keys = require('./config/keys');

// HandleBars Helpers
const {
  truncate,
  stripTags, 
  formatDate,
  select,
  editIcon
} = require('./helpers/hbs');

//map global promises
mongoose.Promise = global.Promise

//mongoose Connect
mongoose.connect(keys.mongoURI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err));

const app = express();

//BodyParser MW
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Method Override MW
app.use(methodOverride('_method'));

//Handlebars middleware
app.engine('handlebars', exphbs({
  helpers:{
    truncate: truncate,
    stripTags: stripTags, 
    formatDate: formatDate,
    select: select,
    editIcon: editIcon
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


app.use(cookieParser());
app.use(session({
  secret: 'secret', 
  resave: false, 
  saveUninitialized: false
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Set Global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.Year = new Date().getFullYear();
  next();
})

//Set Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use Routes
app.use('/auth', auth);
app.use('/', index);
app.use('/stories', stories);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});


