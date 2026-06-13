const express = require('express');
const pool = require('../config/db');
const router = express.Router();

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
            `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)`,
            [getOTP.rows[0].name, getOTP.rows[0].email, getOTP.rows[0].password_hash]
        )
        if (insertToUsers.rowCount > 0) {
            return res.json({"message":"OTP Verified"})
        }
    }
    return res.status(400).json({
        message: "Invalid OTP"
    });
});

module.exports = router;