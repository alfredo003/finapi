const express = require("express");
const {v4:uuidv4} = require("uuid");
const app = express();

const customers = [];
app.use(express.json());

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
app.get("/statement/:nif",(req,res)=>{
    const {nif} = req.params;

    const customer = customers.find(customer => customer.nif === nif);

    return res.status(200).json(customer.statement);
});
app.listen(3000);