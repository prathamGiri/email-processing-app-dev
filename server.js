const express = require('express');
const registerRouter = require('./Routes/register');
const loginRouter = require('./Routes/login');
const app = express();

app.use(loginRouter, '/login');
app.use(registerRouter, '/register');

app.get('/', (req, res) => {
    console.log('Request received');
    res.send('Hello There!')
})

app.listen(8080, ()=>{
    console.log('Listening on port 8080');
})