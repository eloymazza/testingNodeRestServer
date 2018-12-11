const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require('../models/user');
const Product = require('../models/product');
const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:type/:id', (req,res) => {

    let type = req.params.type;
    let id = req.params.id;

    if(!req.files){
        return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'No se ha subido ningun archivo'
                    }
                });
    }

    // Validate type
    let validTypes = ['user', 'product'];
    if(validTypes.indexOf(type) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos de imagenes permitidas son: ' + validTypes.join(', ')
            }
        })
    }

    // Validate extension
    let file = req.files.file;
    let fileExt = file.name.split('.')[1];   
    let validExtensions = ['png', 'jpg', 'gif', 'svg', 'jpeg'];

    if(validExtensions.indexOf(fileExt) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + validExtensions.join(', ')
            }
        })
    }

    // Change name
    let fileName = `${id}-${new Date().getMilliseconds()}.${fileExt}`

    file.mv(`../../uploads/${type}/${fileName}`, (err) => {
        if (err)
          return res.status(500).json({
              ok: false,
              err: {
                  message: 'Move error ocurred',
                  url1: path.resolve(__dirname,`uploads/${type}/${fileName}`),
                  url2: `uploads/${type}/${fileName}`,
                  url3: `../uploads/product`,
                  err
                }
            });
        
        type == 'user'? imageUser(id,res, fileName) : imageProduct(id,res, fileName)
         
    });

})

let imageUser = (id,res,fileName) => {

    User.findById(id, (err, userDB) => {
        
        if(err){
            deleteFile(fileName,'user');
            return res.status(500).json({
                ok:false,
                err
            })
        }
        
        if(!userDB){
            deleteFile(fileName,'user');
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'The user does not exists'
                }
            })
        }
        
        deleteFile(userDB.img,'user');

        userDB.img = fileName;
        
        userDB.save( (err, userSaved) => {
            res.json({
                ok:true,
                user: userSaved,
                img: fileName
            }); 
        });  
    });
}
    
let imageProduct = (id,res,fileName) => {

    Product.findById(id, (err, productDB) => {
        
        if(err){
            deleteFile(fileName,'product');
            return res.status(500).json({
                ok:false,
                err
            })
        }
        
        if(!productDB){
            deleteFile(fileName,'product');
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'The product does not exists'
                }
            })
        }
        
        deleteFile(productDB.img,'product');

        productDB.img = fileName;
        
        productDB.save( (err, productSaved) => {
            res.json({
                ok:true,
                user: productSaved,
                img: fileName
            }); 
        });  
    });

}

let deleteFile = (fileName, type) => {
    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${fileName}`);
    if( fs.existsSync(pathImage) ){
        fs.unlinkSync(pathImage);
    } 
}

module.exports = app;
