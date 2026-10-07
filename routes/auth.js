const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../db/pool');

const router = express.Router();
const { validateRegister, validateLogin } = require('../middleware/validation')

router.post('/register', validateRegister, async (req, res, next) => {
    const {email, password} = req.body;
    try{
        const result = await pool.query('SELECT * FROM USERS WHERE email = $1', [email])

        if(result.rowCount !== 0){
            return res.status(400).json({
                message: "Email ID already exists."
            })
        }
        const passwordHash = await bcrypt.hash(password, 10)
        await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *', [email, passwordHash])
        return res.status(201).json({
            message: "Successfully registered."
        })

    }catch(error){
        next(error)
    }
})

router.post('/login', validateLogin, async (req, res, next) =>{
    const {email, password} = req.body;
    try{
        const result = await pool.query('SELECT * FROM USERS WHERE email = $1', [email])
            if(result.rowCount === 0){
            return res.status(401).json({
                message: "Invalid email or password." //to avoid account enumeration
            })
        }
        const passwordHash = result.rows[0].password_hash
        const passwordMatch = await bcrypt.compare(password, passwordHash)
        
        if(!passwordMatch){
            return res.status(401).json({
                message: "Invalid email or password." //enumeration, again
            })
        }
        const token = jwt.sign(
            {   userId: result.rows[0].id,
                email: result.rows[0].email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h'})

        return res.status(200).json({
            message: "Logged in successfully!",
            token: token
        })
    }catch(error){
        next(error)
    }
})

module.exports = router