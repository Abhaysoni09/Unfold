const uploadfile = require("../Services/cloud.services");
const productmodel = require("../Model/productmodel");

async function createproduct(req, res) {
  try {
    const {
      title,
      description,
      category,
      brand,
      price,
      stock,
      colors,
      sizes,
      material,
      warranty,
    } = req.body;

    if (!title || !description || !category || !brand || !price) {
      return res.status(400).json({
        success: false,
        message: "Title, description, category, brand, and price are required",
      });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadResults = await Promise.all(
        req.files.map((file) => uploadfile(file.buffer, file.originalname))
      );
      imageUrls = uploadResults.map((r) => r.url);
    }

    const toArray = (val) => {
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    };

    const product = await productmodel.create({
      createrId:req.user.id,
      title,
      description,
      category,
      brand,
      price,
      stock,
      images: imageUrls,
      colors: toArray(colors),
      sizes: toArray(sizes),
      material,
      warranty,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    const statusCode = error.name === "ValidationError" || error.name === "CastError" ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
}


async function allproducts(req,res){
    try {
        const products = await productmodel.find({
          createrId:req.user.id
        })
        res.status(200).json({
            message:"fetch all products",
            products
        })
    } catch (err) {
        console.log(err);
    }
}

async function getallproduct(req,res){
    try {
        const products = await productmodel.find().sort({ createdAt: -1 });
        res.status(200).json({
            message:"fetch all products",
            products
        })
    } catch (err) {
        console.log(err);
    }
}


async function getproduct(req,res){
  const id = req.params.id
  const products = await productmodel.findById(id).populate("brand")
  res.status(200).json({
    message:"get product",
    products
  })
}

async function deleteproduct(req,res){
    try{
        const id = req.params.id
    await productmodel.findByIdAndDelete(id)
    res.status(200).json({
        message:"Product deleted Successfully"
    })
    }catch(err){console.log(err);}
}

async function updateproduct(req,res){
  const productId = req.params.id;

        const {
            title,
            description,
            category,
            brand,
            price,
            stock,
            colors,
            sizes,
            material,
            warranty
        } = req.body;


        const product = await productmodel.findById(productId);

        if(!product){
            return res.status(404).json({
                message:"Product not found"
            })
        }
        product.title = title || product.title;
        product.description = description || product.description;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.colors = colors || product.colors;
        product.sizes = sizes || product.sizes;
        product.material = material || product.material;
        product.warranty = warranty || product.warranty;


        await product.save();


        res.status(200).json({
            message:"Product updated successfully"
        })
}

module.exports = {createproduct,allproducts,deleteproduct,getproduct,updateproduct,getallproduct}