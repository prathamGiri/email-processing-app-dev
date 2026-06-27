const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
// const sendEmail = require('../../email-worker/utils/sendEmail');
const router = express.Router();
const producer = require('../kafka/producer');

router.post('/', async (req, res) => {
    try{
        console.log(req.body);
        const {fullname, email, password} = req.body;
        const pass_hash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        )
        if (result.rowCount > 0) {
            return res.json({"message" : "Email already taken!"});
        }
        const emailInOtpTable = await pool.query(
            `SELECT * FROM otp WHERE email = $1`,
            [email]
        )
        if (emailInOtpTable.rowCount > 0) {
            await pool.query(
                'DELETE FROM otp WHERE email = $1',
                [email]
            )
        }
        const otp = (
            Math.floor(100000 + Math.random() * 900000)
        ).toString();
        const insertToUsers= await pool.query(
            `INSERT INTO otp (name, email, password_hash, otp) VALUES ($1, $2, $3, $4)`,
            [fullname, email, pass_hash, otp]
        );
        if (insertToUsers.rowCount == 1) {
            const subject = "OTP Verification";
            const body = `the otp is : ${otp}`
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
            return res.json({"message":"Email Queued!"});
        }
        res.json({"message":"Registration unsuccessful"});
    }catch (err){
        console.log(err);
        res.status(500).json({"message":"Internal Server Error"});
    }
})

module.exports = router;