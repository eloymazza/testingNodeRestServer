const express = require('express');
let  { verifyToken, verifyAdminRole } = require('../middlewares/authentication');
let app = express();

let Category = require('../models/category');

app.get('/category', verifyToken, (req, res) => {
    
    Category.find({})
        .populate('user', 'name email')
        .sort('description')
        .exec((err, categoriesDB) => {
        
        if(err){
            return res.status(500).json({
                ok: false,
                message: `Error ocurred : ${err}`
            });
        }
        else{
            res.status(200).json({
                ok: true,
                categories: categoriesDB
            })
        }

    })

});

// Category By ID
app.get('/category/:id', verifyToken, (req,res) => {

    let id = req.params.id;

    Category.findById(id, (err,category) => {

        if(err){
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if(!category){
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'id cannot be found'
                }
            });
        }

        res.json({
            ok:true,
            category: category
        });


    })
        


});

app.post('/category', verifyToken, (req, res) => {

    let body = req.body;
    let category = new Category({
        description : body.description,
        user : req.user._id
    });
    
    category.save((err, categorySaved) => {

        if(err){
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if(!categorySaved){
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok:true,
            category: categorySaved
        });

    });
    
});

app.put('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategory = {
        description: body.description
    }

    Category.findByIdAndUpdate(id, descCategory, {new:true,runValidators:true}, (err,categoryUpdated) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoryUpdated){
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Id cannot be found'
                }
            });
        }
   
        res.json({
            ok:true,
            category: categoryUpdated
        });

    })

});

app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {

    let id = req.params.id;
    
    Category.findByIdAndRemove(id, (err, deletedCategory) => {

        if(err){
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if(!deletedCategory){
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Id cannot be found'
                }
            });
        }
        
        res.json({
            ok:true,
            category: deletedCategory
        });

    })


});

module.exports = app;