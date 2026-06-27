const express = require('express');
const pool = require('../config/db');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {producer} = require('../kafka/producer');

router.post('/', async (req, res) => {
    try{
        const {email, password} = req.body;
        const result = await pool.query(
            `SELECT id, email, password_hash FROM users WHERE email = $1`,
            [email]
        )
        if (result.rowCount == 0) {
            return res.json({"message" : "No Such Account Created"});
        }
        
        if (result.rowCount == 1) {
            const valid = await bcrypt.compare(password, result.rows[0].password_hash);
            if(valid){
                const token = jwt.sign(
                    {
                        userId: result.rows[0].id,
                        email: result.rows[0].email
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    }
                );
                const subject = "Login Successful";
                const body = `Welcome Back`;
                // const email_status = sendEmail(email, subject, body);
                await producer.send({
                    topic: 'email-jobs',
                    messages: [
                        {
                            value: JSON.stringify({
                                email,
                                subject,
                                body
                            })
                        }
                    ]
                });
                return res.json({"message" : "Login Successful", "token":token});
            }
            return res.json({"message" : "Incorrect Username or Password"});
        }
        res.json({"message" : "Login Failed"});
    }catch (err){
        console.log(err);
        res.json({"message":"Internal Server Error"});
    }
})

module.exports = router;