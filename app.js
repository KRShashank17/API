const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended : false}));     // good practice-security : extended 
app.use(express.json());

        // Database Connection
// mongoose.connect("mongodb://127.0.0.1:27017/crud" , { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect("mongodb://127.0.0.1:27017/crud" )
        .then( ()=> { 
            console.log("DB connected");
        } )
        .catch((err)=> {
            console.log(err);
        })

        // Schema
const productSchema = new mongoose.Schema({
    name:{type:String},
    price:{type:Number}
})

        // Model
const Products = new mongoose.model("Products" , productSchema);

        // Create
app.post("/api/v1/product/new" , async(req, res)=>{
    const newpdt = await Products.create(req.body);

    res.status(201).json({
        success:true,
        newpdt
    })
})

        // Read
app.get('/api/v1/products',async (req,res) =>{
    const allpdt = await Products.find();

    res.status(200).json({
        success:true,
        allpdt
    })
})

        // Update
app.put("/api/v1/product/:id", async(req,res)=>{
    // if id not found : handled by "Try catch"
    try{

        let updpdt = await Products.findById(req.params.id);
        if (! updpdt){
            return res.status(500).json({
                status : false,
                message: "Product not found : 404"
            })
        }
    
                // works fine
        // updpdt = await Products.findByIdAndUpdate(req.params.id , req.body , {
        //     new: true,
        //     runValidators: true,
        //     useFindAndModify : false
        // })

        updpdt = await Products.updateOne({_id : req.params.id} , req.body);
    
        res.status(200).json({
            status : true,
            updpdt
        })
    }
    catch(err){
        // console.log(err);
        res.status(500).json({
            status : false,
            message: "Product not found : 500"
        })
    }
})

        // Delete
app.delete("/api/v1/product/:id" , async(req,res)=>{
    // try catch - if id not found , handles properly
    try{

        let pdtid = req.params.id;
        const delpdt = await Products.findById(pdtid);
    
        if (!delpdt){
            return res.status(404).json({
                status : false,
                message: "Product not found : 404"
            })
        }
    
        await delpdt.deleteOne({_id : pdtid});      // ***
    
        res.status(200).json({
            status : true,
            message: "Product deleted"
        })
    }
    catch(err){     
        res.status(500).json({
            status : false,
            message: "Product not found :500"
        })
    }


})


app.listen(8001 , ()=>{
    console.log("Server started on port 8001  http://localhost:8001");
})