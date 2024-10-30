const express = require("express");
const {v4:uuidv4} = require("uuid");
const app = express();

const customers = [];
app.use(express.json());

function verifyExistsAccountNIF(req,res,next)
{
    const {nif} = req.headers
    const customer = customers.find((customer)=>customer.nif == nif);
    
    if(!customer)
        return res.status(400).json({error:"custormer not found!"});
    req.customer = customer;
    return next();
}
app.post("/account",(req,res)=>{
    const {nif,name} = req.body;
    const id = uuidv4();

    const customerAlredyExists = customers.some(
        (customer) => customer.nif === nif
    );
    if(customerAlredyExists)
        return res.status(400).json({error:"Customer alredy exists!"});
  
    customers.push({
        nif,
        name,
        id:uuidv4,
        statement:[]
    });

    return res.status(201).send();
});
app.get("/statement",verifyExistsAccountNIF,(req,res)=>{
    const {customer} = req;
    return res.status(200).json(customer.statement);
});
app.listen(3000);