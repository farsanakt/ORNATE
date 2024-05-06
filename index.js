const express = require('express');

const app = express();

const path = require('path');

const flash = require('express-flash');

const session = require('express-session');

const nocache = require('nocache');

const googleAuth = require('./googleAuth')
// Database connection

require('./config/config').connect()

app.use(session({

    secret:'678jm',resave:false,saveUninitialized:true

}))



// Setting view engine and static files directory

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));


// Flash messages middleware

app.use(flash());


// Nocache middleware

app.use(nocache());

// User route

const userRoute = require('./routes/userRoute');

app.use('/', userRoute);


// // Admin route

const adminRoute = require('./routes/adminRoute');

app.use('/admin', adminRoute);

app.use('/',googleAuth)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server Running http://localhost:${PORT}`);
});
