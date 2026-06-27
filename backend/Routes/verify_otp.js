const express = require('express');
const pool = require('../config/db');
const router = express.Router();
const {producer} = require('../kafka/producer');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {

    const { email, otp } = req.body;

    console.log("Received OTP:", otp);

    const getOTP = await pool.query(
        `SELECT * FROM otp WHERE email = $1`,
        [email]
    );
    if (getOTP.rowCount == 0) {
        return res.json({
            message: "OTP Expired"
        });
    }
    if (otp === getOTP.rows[0].otp) {
        const insertToUsers = await pool.query(
            `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email`,
            [getOTP.rows[0].name, getOTP.rows[0].email, getOTP.rows[0].password_hash]
        )
        if (insertToUsers.rowCount > 0) {
            await pool.query(
                `DELETE FROM otp WHERE email = $1`,
                [email]
            );
            const token = jwt.sign(
                {
                    userId: insertToUsers.rows[0].id,
                    email: insertToUsers.rows[0].email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN
                }
            );
            const subject = "Registration Successful";
            const body = `Welcome to the community!`;
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
            return res.json({"message":"OTP Verified", "token":token})
        }
    }
    return res.status(400).json({
        message: "Invalid OTP"
    });
});

module.exports = router;