const express = require('express');
const router = express.Router();
const Product = require('../models/product')
const mongoose = require('mongoose') 

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        testId: req.body.testId,
        testType: req.body.testType,
        name: req.body.name
    });
    product.save().then(result => {
        console.log("updated record in db: "+result);
        res.status(201).json({
        message: "handling post methods",
        product: product,
        result: "updated record in db "+result
    });
    }).catch(err => {
        console.log("error in updating the record in db: "+err)
        res.status(500).json({
            message: "handling post methods",
            err: err,
            result: "error in updating the record in db: "+err
        });
    });
});


router.get('/:testId', (req, res, next) => {
    const id = req.params.testId;
    Product.findById(id)
    .select('_id testType testId name')
    .exec()
    .then(doc =>{
        if(doc) {
            res.status(200).json({
                message: "handling get method",
                record: doc,
                result: "Received record from db "+doc,
            });
        } else {
            res.status(404).json({
                message: "handling get method",
                record: doc,
                result: "No valid record found"
            }); 
        }
    }).catch(err => {
        res.status(500).json({
            message: "handling get method",
            err: err,
            result: "Failed to Receive record from db "+err
        });
    });
});

router.get('/', (req, res, next) => {
    const id = req.params.testId;
    Product.find()
    .select('_id testType testId name')
    .exec()
    .then(docs =>{
        if(docs) {
            res.status(200).json({
                records: docs.map( doc => {
                    return {
                        testId:doc.testId,
                        testType:doc.testType,
                        recordId:doc._id,
                        name:doc.name,
                        meta: {
                            methodType: 'Get',
                            url: 'http://localhost:3000/test/' + doc._id,
                            dbType: 'Mongo cloud'
                        }
                    }
                }
                ),
                result: "Received record from db",
                noOfRecords: docs.length,
            });
        } else {
            res.status(404).json({
                methodType: 'Get',
                record: docs,
                result: "No valid record found"
            }); 
        }
    }).catch(err => {
        res.status(500).json({
            methodType: 'Get',
            err: err,
            result: "Failed to Receive record from db "+err
        });
    });
});

router.delete('/:testId', (req, res, next) => {
    const id = req.params.testId;
    Product.findByIdAndRemove(id)
    .exec()
    .then(result => {
        res.status(200).json({
            message: "handling delete method",
            result:result
        });
    })
    .catch(err => {
        res.status(500).json({
            message: "handling delete method",
            result : "Failed to delete record "+err
        })
    })
});
router.patch('/:testId', (req, res, next) => {
    const id = req.params.testId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.name] = ops.value
    }
    Product.findByIdAndUpdate({_id: id},{$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "handling patch method",
            result:"Record got updated"+result
        });
    })
    .catch(err => {
        res.status(500).json({
            message: "handling patch method",
            result : "Failed to update the record "+err
        })
    })
});
module.exports = router;