const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const username = pgiri;
    const password = 1234;
    const {user, pass} = req.body;
    if (user == username && pass == password) {
        res.json({"message" : "Login Successful"});
    }
    res.json({"message" : "Login Failed"});
})

module.exports = router;