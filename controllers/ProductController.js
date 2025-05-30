const mongoose = require('mongoose');
const Product = require('../models/Product');


const addSelectedSceneWithProduct = async(req,res)=>{
    try {
        const {orgId,directoryId,sceneId,shopifyProductId,handleName,options} = req.body;
        if(!orgId ||!directoryId || !sceneId | !shopifyProductId || !handleName || !options ) return res.status(400).json({
            success:false,
            message:"missing fields"
        })
        const checkExisting = await Product.findOne({shopifyProductId:shopifyProductId});
        if(checkExisting) return res.status(400).json({
            success:false,
            message:"product already added kindly just map the variations"
        })
        const addProduct = new Product({
            orgId: orgId,
            directoryId: directoryId,
            sceneId: sceneId,
            shopifyProductId: shopifyProductId,
            handleName: handleName,
            options:options
        });
        await addProduct.save();
        if(!addProduct) return res.status(400).json({
             success:false,
            message:"some error occured kindly try again"
        })
        return res.status(200).json({
            success:true,
            message:"product added"
        })
    } catch (error) {
        
    }
}

const getProductInformation = async(req,res)=>{
    try {
        const {shopifyId} = req.query;
        if(!shopifyId) return res.status(400).json({
            success:false,
            message:"product id not found"
        });
        const findProduct = await Product.findOne({shopifyProductId:shopifyId});
        if(!findProduct) return res.status(400).json({
            success:false,
            message:"product not found"
        })
        return res.status(200).json({
            success:true,
            message:"product found successfully",
            data:findProduct
        })
    } catch (error) {
        console.log("error occured while finding product");
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const updateOptions = async (req,res)=>{
    try {
        const {id,options} = req.body;
        if(!id || !options) return res.status(400).json({
            success:false,
            message:"missing data"
        })
        const updateProduct = await Product.findOneAndUpdate({shopifyProductId:id},{$set:{options:options}},{new:true});
        if(!updateProduct) return res.status(400).json({
            success:false,
            message:"product not found"
        })
        return res.status(200).json({
            success:true,
            message:"product updated successfully",
        })
        
    } catch (error) {
        console.log("error occured while updating product");
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const deleteProductMapping = async(req,res)=>{
    try {
        const {shopifyId} = req.query;
        if(!shopifyId) return res.status(400).json({
            success:false,
            message:"product id not found"
        });
        const deleteProduct = await Product.findOneAndDelete({shopifyProductId:shopifyId});
        if(!deleteProduct) return res.status(400).json({
            success:false,
            message:"product not found"
        })
        return res.status(200).json({
            success:true,
            message:"product deleted successfully",
        })
    } catch (error) {
        console.log("error occured while deleting product");
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

module.exports = {addSelectedSceneWithProduct,getProductInformation, updateOptions,deleteProductMapping}