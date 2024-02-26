import express = require('express');
import dotenv = require('dotenv');
import router from './routes/router';
dotenv.config(); //required for process.env.Port not to return undefined.

//App
const app = express();

//Middleware
app.use(express.static(__dirname + '/view'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

//Listening
app.listen(process.env.PORT, () => {
    console.log(`<!> Server Running on Port ${process.env.PORT}`);
})