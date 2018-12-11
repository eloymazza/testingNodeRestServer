const express = require('express');
let app = express();
let Product = require('../models/product');

const { verifyToken } = require('../middlewares/authentication');


// Get all products 
app.get('/product', verifyToken, (req,res) => {

    let query = req.query;

    let from = new Number(query.from || 0);
    let limit = new Number(query.limit || 3);

    Product.find({})
        .skip(from)
        .limit(limit)
        .populate('user', 'name email')
        .populate('category')
        .exec((err, products) => {

            if(err){
                return res.status(400).json({
                    ok:false,
                    errors : err
                });
            }
            res.json({
                ok:true,
                products,
            });
        })
})

// Get Products by id
app.get('/product/:id', verifyToken, (req,res) => {

    let id = req.params.id;

    Product.findById(id)
        .populate('user','name email')
        .populate('category')
        .exec((err, product) => {

        if(err){
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if(!product){
            return res.status(400).json({
                ok: false,
                error: {
                    message: `id: ${id} cannot be found `
                }
            });
        }

        res.json({
            ok:true,
            product
        });
    })
});

app.get('/product/search/:filter', verifyToken, (req,res) => {

    let filter = req.params.filter;

    let regex = new RegExp(filter,'i');

    Product.find({name:regex})
            .populate('category')
            .exec((err, products) => {

                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    products
                })

            })

})

// Create Product
app.post('/product', verifyToken, (req,res) => {

    let body = req.body;
    let user = req.user;

    let product = new Product({
        name: body.name,
        unitaryPrice: body.unitaryPrice,
        description: body.description,
        available: body.available,
        category: body.categoryID,
        user: user._id,
        img: body.img
    });

    product.save((error, productSaved) => {

        if(error){
            return res.status(500).json({
                ok: false,
                error
            });
        }

        res.status(201).json({
            ok:true,
            category: productSaved
        });

    })

});

// Actualizar producto
app.put('/product/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let user = req.user;

    let updateProduct = {
        name: body.name,
        unitaryPrice: body.unitaryPrice,
        description: body.description,
        available: body.available,
        category: body.categoryID,
        user: user._id,
        img: body.img
    }

    Product.findByIdAndUpdate(id, updateProduct, {new:true,runValidators:true}, (err, productUpdated) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productUpdated){
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Id cannot be found'
                }
            });
        }
   
        res.json({
            ok:true,
            category: productUpdated
        });

    })

});


// Disable product
app.put('/product/disable/:id',  verifyToken,  (req,res) => {

    let id = req.params.id;
    let data = {available : false}

    
    Product.findByIdAndUpdate(id, data, {new:true}, (err, disabledProduct) => {
        if(err){
            return res.status(400).json({
                ok:false,
                error : err
            }); 
        }
        res.json({
            ok:true,
            user: disabledProduct
        });
    })

})


module.exports = app;