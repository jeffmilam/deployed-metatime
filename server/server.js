const PORT = process.env.PORT ?? 8000
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const app = express()
const pool = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())

// Get all todos
app.get('/todos/:userEmail', async (req, res) => {
    const { userEmail } = req.params
    try {
        const todos = await pool.query("SELECT * FROM todos WHERE user_email = $1", [userEmail])
        res.json(todos.rows)
    } catch (error) {
        console.error(error)
    }
})

// Get all Times
app.get('/times/:userEmail', async (req, res) => {
    const { userEmail } = req.params
    try {
        const times = await pool.query("SELECT * FROM times WHERE user_email = $1", [userEmail])
        res.json(times.rows)
    } catch (error) {
        console.error(error)
    }
})


// Create a new todo
app.post('/todos', async(req, res) => {
    const { user_email, title, progress, date, description, timetype } = req.body
    const id = uuidv4()
    console.log(id, user_email, title, progress, date, description, timetype)
    try {
        const newToDo = await pool.query("INSERT INTO todos(id, user_email, title, progress, date, description, time_type) VALUES ($1, $2, $3, $4, $5, $6, $7)", [id, user_email, title, progress, date, description, timetype])
        res.json(newToDo)
    } catch (err) {
        console.error(err)
    }
})

// Edit a new todo
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params
    const { user_email, title, progress, date, description, timetype } = req.body
    try {
        const editToDo = await pool.query('UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4, description = $5, time_type = $6 WHERE id = $7;', [user_email, title, progress, date, description, timetype, id])
        res.json(editToDo)
    } catch (err) {
        console.error(err)
    }
})

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params
    try {
        const deleteToDo = await pool.query('DELETE FROM todos WHERE id = $1', [id])
        res.json(deleteToDo)
    } catch (err) {
        console.error(err)
    }
})

// Signup
app.post('/signup', async(req, res) => {
    const { email, password } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    try {
        const signUp = await pool.query(`INSERT INTO users (email, hashed_password) VALUES($1, $2)`,
        [email, hashedPassword])
        
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr'})
        res.json({ email, token })
    } catch (err) {
        console.error(err)
        if (err) {
            res.json({ detail: err.detail})
        }
    }
})

// Login
app.post('/login', async(req, res) => {
    const { email, password } = req.body
    try {
        const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (!users.rows.length) return res.json({ detail: 'User does not exist!' })
        const success = await bcrypt.compare(password, users.rows[0].hashed_password)
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr'})
        if (success) {
            res.json({ 'email' : users.rows[0].email, token })
        } else {
            res.json({ detail: 'Login failed'})
        }

    } catch (err) {
        console.error(err)
    }
})

app.listen(PORT, ()=> console.log(`Server running on PORT ${PORT}`))