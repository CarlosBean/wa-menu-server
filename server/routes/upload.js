const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');

app.use(fileUpload());

const models = {
    product: Product,
    user: User
};

app.put('/upload/:collection/:id', (req, res) => {
    const collection = req.params.collection;
    const id = req.params.id;

    const allowedCollections = ['user', 'product'];

    if (!allowedCollections.includes(collection)) {
        return res.status(400).json({
            success: false,
            message: `${collection} collection is not allowed`,
            errors: { message: `${collection} collection is not allowed` }
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            success: false,
            message: 'no files were uploaded',
            err: { message: 'no files were uploaded' }
        });
    }

    const file = req.files.file;
    const filetype = file.name.split('.').pop();
    const allowedFiletypes = ['jpg', 'jpeg', 'gif', 'png'];

    if (!allowedFiletypes.includes(filetype)) {
        return res.status(400).json({
            success: false,
            message: `${filetype} files are not allowed`,
            errors: { message: `allowed filetypes are ${allowedFiletypes.join(', ')}` }
        });
    }

    models[collection].findById(id, (err, foundResource) => {
        const filename = `${id}-${new Date().getMilliseconds()}.${filetype}`;

        if (err) {
            if (err.name === 'CastError' && err.kind === 'ObjectId') {
                return res.status(404).json({
                    success: false,
                    message: `resource with id ${id} is not exist`,
                    err: { message: `resource with id ${id} is not exist` }
                });
            }

            return res.status(500).json({
                success: false,
                message: `an error ocurred while attempting to search the resource`,
                err
            });
        }

        if (!foundResource) {
            return res.status(404).json({
                success: false,
                message: `resource with id ${id} is not exist`,
                err: { message: `resource with id ${id} is not exist` }
            });
        }

        file.mv(`uploads/${collection}/${filename}`, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: 'an error ocurred while attempting to upload the file',
                    err
                });
            }
        });

        const oldpath = `./uploads/${collection}/${foundResource.img}`;
        if (fs.existsSync(oldpath)) { fs.unlinkSync(oldpath); }

        foundResource.updateOne({ img: filename }, (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'an error ocurred while attempting to update the image',
                    err
                });
            }

            return res.json({
                success: true,
                message: 'image has been updated successfully',
                data: { name: foundResource.name, img: filename }
            });
        })
    });
});

module.exports = app;