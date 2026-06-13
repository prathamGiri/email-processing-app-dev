const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.post('/', async (req, res) => {

    const { email, otp } = req.body;

    console.log("Received OTP:", otp);

    const result = await pool.query(
        `SELECT * FROM otp WHERE email = $1`,
        [email]
    );
    if (result.rowCount == 0) {
        return res.json({
            message: "OTP Expired"
        });
    }
    if (otp === result.rows[0].otp) {
        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)`,
            [result.rows[0].name, result.rows[0].email, result.rows[0].password_hash]
        )
        if (result.rowCount > 0) {
            return res.json({"message":"OTP Verified"})
        }
    }

    return res.status(400).json({
        message: "Invalid OTP"
    });
});

module.exports = router;