const express = require('express');
const cors = require('cors')
const registerRouter = require('./Routes/register');
const loginRouter = require('./Routes/login');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);

app.get('/', (req, res) => {
    console.log('Request received');
    res.send('Hello There!')
})

app.listen(3000, ()=>{
    console.log('Listening on port 3000');
})