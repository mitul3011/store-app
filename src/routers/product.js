const express = require('express');
const Product = require('../models/product');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');

const router = new express.Router();

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){                                    // cb = callback
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image!'));
        }

        cb(undefined, true);
    }
});

router.post('/createProduct', auth, upload.single('image'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.body.image = buffer;
    const product = new Product(req.body);

    try {
        await product.save();
        res.send('Product created.');
    } catch (error) {
        res.status(500).send({ 'error': error.message });
    }
}, (error, req, res, next) => {
    res.status(400).send({
        'error': error.message
    });
});

router.get('/products/:categories', auth, async (req, res) => {
    try {
        if(req.params.categories === 'true'){
            const categories = await Product.find({}).distinct('category').exec();
            res.send(categories);
        }else{
            const findObject = {};
            findObject.price = { $gte: req.query.minPrice || 1, $lte: req.query.maxPrice || 10000000000000 };
            if(req.query.category)
                findObject.category = req.query.category;
            findObject.rating = { $gte: req.query.rating || 0 };
            const products = await Product.find(findObject).lean().exec();
            res.send(products);
        }
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;