require('./config/config')
const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/user', (req, res) => res.json('get user'))
app.post('/user', (req, res) => {
    let data = req.body;

    if (!data.name) {
        res.status(400).json({
            success: false,
            message: 'name is required'
        });
    }

    res.json({ data });
});

app.put('/user:id', (req, res) => {
    let id = req.params.id;
    res.json({ id });
});

app.delete('/user', (req, res) => {
    res.json('delete user');
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}!`)
});