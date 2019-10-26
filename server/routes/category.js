const express = require('express');
const Category = require('../models/category');
const { verifyToken, verifyAdminRole } = require('../middlewares/auth');

const app = express();

app.get('/category', verifyToken, (req, res) => {
    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'an error ocurred while attempting to find the categories',
                    err
                })
            }

            res.json({
                success: true,
                message: 'categories obtained successfully',
                data: categories,
            });
        })
});

app.get('/category/:id', verifyToken, (req, res) => {
    const id = req.params.id;

    Category.findById(id, (err, foundCategory) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'an error ocurred while attempting to find the category',
                err
            })
        }

        res.json({
            success: true,
            message: 'category obtained successfully',
            data: foundCategory,
        });
    })
});

app.post('/category', verifyToken, (req, res) => {
    const body = req.body;
    const category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save((err, savedCategory) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: 'an error ocurred while attempting to create the category',
                err
            })
        }

        res.status(201).json({
            success: true,
            message: 'category was created successfully',
            data: savedCategory
        })
    });
});

app.put('/category/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    const body = req.body;

    Category.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
        context: 'query'
    }, (err, foundCategory) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'an error ocurred while attempting to update the category',
                err
            })
        }

        res.status(200).json({
            success: true,
            message: 'category was updated successfully',
            data: foundCategory
        })
    });
});

app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {
    const id = req.params.id;

    Category.findByIdAndRemove(id, (err, deletedCategory) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'an error ocurred while attempting to update the category',
                err
            });
        }

        if (!deletedCategory) {
            return res.status(400).json({
                success: false,
                message: `category with id ${id} is not exist`,
                err: { message: `category with id ${id} is not exist` }
            });
        }

        res.status(200).json({
            success: true,
            message: 'category was deleted successfully',
            data: deletedCategory
        });
    });
});

module.exports = app;
