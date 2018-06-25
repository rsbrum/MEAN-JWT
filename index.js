const express           = require('express');
const jwt               = require('jsonwebtoken');
const morgan            = require('morgan');
const mongoose          = require('mongoose');
const cors              = require('./cors');
const path              = require('path');
const server            = require('./server');
const DB                = process.env.MONGODB_URI;
const PORT              = process.env.PORT || 5000; 
const app               = express();

process.env.JWT_KEY = 'secret_key';

/* mongoose.Promise = global.Promise;
mongoose.connect(DB);
mongoose.connection.once('open', () => {
    console.log("Database connection was succesfull");
}).on('error', (error) =>{
    console.log("Connection error " + error );
}); */

//CORS && CORBS
app.use((req, res, next) => {   
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Expose-Headers', '*');
    res.header('X-Content-Type-Options', 'nosniff');
    next();
});

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(morgan('dev'));

app.use('/posts', require('./routes/posts'));
app.use('/users', require('./routes/users'));

app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname+'/public/index.html'));
});    

app.use((req, res, next) => {
    const error = new Error('Route not found!');
    error.status = 404;
    next(error);
});

app.use( (error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
}); 

app.listen(PORT, () => console.log('Listening on port ' + PORT));