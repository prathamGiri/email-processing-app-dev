require('dotenv').config();
const express = require('express');
const pool = require('./config/db');
const cors = require('cors')

const registerRouter = require('./Routes/register');
const loginRouter = require('./Routes/login');
const verifyOtpRouter = require('./Routes/verify_otp');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);
app.use('/api/verify_otp', verifyOtpRouter);

app.get('/health/db', async (req, res) => {
    var result = await pool.query('SELECT NOW()');
    res.json(result.rows);
})

app.get('/', (req, res) => {
    console.log('Request received');
    res.send('Hello There!')
})

app.listen(3000, ()=>{
    console.log('Listening on port 3000');
})