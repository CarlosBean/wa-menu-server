const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyTokenImg } = require('../middlewares/auth');
const app = express();

app.get('/image/:collection/:img', verifyTokenImg, (req, res) => {
    const collection = req.params.collection;
    const img = req.params.img;

    const noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
    const imagePath = path.resolve(__dirname, `../../uploads/${collection}/${img}`);

    fs.existsSync(imagePath) ? res.sendFile(imagePath) : res.sendFile(noImagePath);
});

module.exports = app;