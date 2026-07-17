const brandmodel = require("../Model/brandmodel")
const uploadfile = require("../Services/cloud.services")

async function createbrand(req,res){
    const {name,description,status} = req.body
    const id = req.user.id
    const result = await uploadfile(req.file.buffer)
    if(!name||!description){
        return res.status(400).json({
            message:"All fields are required"
        })
    }
    const brand = await brandmodel.create({
        name,
        logo:result.url,
        description,
        status,
        sellerId:id
    })
    res.status(200).json({
        message:"Brand created successfully",
        brand
    })
}

async function deletebrand(req,res){
    const id = req.params.id
    await brandmodel.findByIdAndDelete(id)
    res.status(200).json({
        message:"Brand Deleted"
    })
}

async function allbrands(req,res){
    const {id} = req.user
    const brands = await brandmodel.find({
        sellerId:id
    })
    res.status(200).json({
        message:"Fetch all brands",
        brands
    })
}

async function updatebrand(req,res){
    const {id }= req.params
    const {status}  = req.body
    const brand = await brandmodel.findById(id)
    brand.status = status
    await brand.save()
    res.status(200).json({
        message:"Brand Deleted"
    })
}

module.exports = {createbrand,allbrands,deletebrand,updatebrand}