const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const router = express.Router();

router.post('/', async (req, res) => {
    try{
        console.log(req.body);
        const {fullname, email, password} = req.body;
        console.log(password);
        const pass_hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)`,
            [fullname, email, pass_hash]
        );
        if (result.rowCount == 1) {
            return res.json({"message":"Registration successful"});
        }
        res.json({"message":"Registration unsuccessful"});
    }catch (err){
        console.log(err);
        res.status(500).json({"message":"Internal Server Error"});
    }
    
})

module.exports = router;