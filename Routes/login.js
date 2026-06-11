const express = require('express');
const pool = require('../config/db');
const router = express.Router();
const bcrypt = require('bcrypt');

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
                return res.json({"message" : "Login Successful"});
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