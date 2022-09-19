const express= require("express");
const dns=require("dns")
const app= express();
const fs=require("fs")
app.use(express.json())

app.post("/getmeip", (req,res)=>{
    const {website_name}=req.body;
    console.log(website_name);
    dns.lookup(website_name,(err,address)=>{
        if(err){
            res.send("Something went wrong");
        }
        res.send(address)
    });
})

app.get("/products",(req,res)=>{
    const data=fs.readFileSync("./products.json","utf-8")
    const products=JSON.parse(data).products
    res.send(products)
})

app.post("/products/create",(req,res)=>{
    const product=req.body;
    const prev_data=fs.readFileSync("./products.json", {encoding:"utf-8"})
    const parsed_prev_data=JSON.parse(prev_data);
    const products=parsed_prev_data.products;
    products.push(product);
    const latest_products= JSON.stringify(parsed_prev_data);

    fs.writeFileSync("./products.json", latest_products, "utf-8");

    res.send("product added")
})

app.put("/products/:productId", (req,res)=>{
    const product_id=req.params.productId;
    const product=req.body;
    const prev_data=fs.readFileSync("./products.json", {encoding:"utf-8"})
    const parsed_prev_data=JSON.parse(prev_data);
    const old_products=parsed_prev_data.products;
    const new_products=old_products.map((prod)=>{
        if(prod.id==product_id){
            return product;
        }
        else{
            return prod;
        }
    })
    parsed_prev_data.products=new_products;
    const latest_products=JSON.stringify(parsed_prev_data);

    fs.writeFileSync("./products.json", latest_products, "utf-8")

    res.send("product modified")

})


app.delete("/products/:productId", (req,res)=>{
    const id=req.params.productId
    const prev_data=fs.readFileSync("./products.json", {encoding:"utf-8"})
    const parsed_prev_data= JSON.parse(prev_data)
    const old_products=parsed_prev_data.products
    const product=old_products.find((prod)=> prod.id===id)
    const index = old_products.indexOf(product);
    old_products.splice(index, 1);
    const latest_data= JSON.stringify(parsed_prev_data)
    fs.writeFileSync("./products.json", latest_data, "utf-8")
    res.send("product deleted")

})


app.listen(7000, ()=>{
    console.log("listening to 7000")
})