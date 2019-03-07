var express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoosse = require('mongoose');
const userRoute = require('./src/routes/user-route');
const courseRoute  = require('./src/routes/course-route');
mongoosse.connect('mongodb://Admin:0108444641g@ds153093.mlab.com:53093/course_center', { useNewUrlParser: true }, () => {
    console.log('db is running')
});

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});




app.use('/',userRoute);
app.use('/',courseRoute);


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});




app.use((req, res, next) => {
    const error = new Error('not found !');
    error.status(404);
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;