const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const sendEmail = require('../utils/sendEmail');
const router = express.Router();

router.post('/', async (req, res) => {
    try{
        console.log(req.body);
        const {fullname, email, password} = req.body;
        const pass_hash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `SELECT * FROM users WHERE email == $1`,
            [email]
        )
        if (result.rowCount > 0) {
            return res.json({"message" : "Email already taken!"});
        }
        const otp = () => {
            let curr = '';
            for (let i = 0; i < 6; i++) {
                curr=curr+Math.floor(Math.random()*10);
            }
            return curr;
        };
        const result = await pool.query(
            `INSERT INTO otp (name, email, password_hash, otp) VALUES ($1, $2, $3, $4)`,
            [fullname, email, pass_hash, otp]
        );
        if (result.rowCount == 1) {
            const subject = "OTP Verification";
            const body = `the otp is : ${otp}`
            const email_status = sendEmail(email, subject, body);
            if ((await email_status).accepted.includes(email)) {
                return res.json({"message":"OTP Sent"});
            }
        }
        res.json({"message":"Registration unsuccessful"});
    }catch (err){
        console.log(err);
        res.status(500).json({"message":"Internal Server Error"});
    }
})

module.exports = router;