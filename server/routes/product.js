const express = require('express');
const Product = require('../models/product');
const { verifyToken } = require('../middlewares/auth');

const app = express();

app.get('/product', verifyToken, (req, res) => {
    const from = Number(req.query.from || 0);
    const limit = Number(req.query.limit || 5);

    Product.find({ available: true })
        .skip(from)
        .limit(limit)
        .sort('description')
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'an error ocurred while attempting to find the products',
                    err
                })
            }

            Product.countDocuments({ available: true }, (err, total) => {
                res.json({
                    success: true,
                    message: 'products obtained successfully',
                    data: products,
                    total
                });
            });
        })
});

app.get('/product/search/:text', verifyToken, (req, res) => {
    const text = req.params.text;
    const regex = new RegExp(text, 'i');

    Product.find({ name: regex })
        .populate('user', 'name email')
        .populate('category')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'an error ocurred while attempting to find the products',
                    err
                });
            }

            res.json({
                success: true,
                message: 'products obtained successfully',
                data: products
            });
        })
});

app.get('/product/:id', verifyToken, (req, res) => {
    const id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, foundProduct) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'an error ocurred while attempting to find the product',
                    err
                })
            }

            if (!foundProduct) {
                return res.status(404).json({
                    success: false,
                    message: `product with id ${id} is not exist`,
                    err: { message: `product with id ${id} is not exist` }
                })
            }

            res.json({
                success: true,
                message: 'product obtained successfully',
                data: foundProduct,
            });
        })
});

app.post('/product', verifyToken, (req, res) => {
    const body = req.body;
    const product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        category: body.category,
        user: req.user._id
    });

    product.save((err, savedProduct) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: 'an error ocurred while attempting to create the product',
                err
            })
        }

        res.status(201).json({
            success: true,
            message: 'product was created successfully',
            data: savedProduct
        })
    });
});

app.put('/product/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    const body = req.body;

    Product.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
        context: 'query'
    }, (err, foundProduct) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'an error ocurred while attempting to update the product',
                err
            })
        }

        res.status(200).json({
            success: true,
            message: 'product was updated successfully',
            data: foundProduct
        })
    });
});

app.delete('/product/:id', verifyToken, (req, res) => {
    const id = req.params.id;

    Product.findByIdAndUpdate(id, { available: false }, (err, deletedProduct) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'an error ocurred while attempting to update the product',
                err
            });
        }

        if (!deletedProduct) {
            return res.status(400).json({
                success: false,
                message: `product with id ${id} is not exist`,
                err: { message: `product with id ${id} is not exist` }
            });
        }

        res.status(200).json({
            success: true,
            message: 'product was deleted successfully',
            data: deletedProduct
        });
    });
});

module.exports = app;