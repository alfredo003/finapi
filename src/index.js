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
function getBalance(statement)
{ 
    const balance = statement.reduce((acc,operation)=>{
        if(operation.type == 'credit')
        {
            return acc + operation.anount;
        }else
        {
            return acc - operation.anount;
        }

    },0);

    return balance;
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
app.post("/deposit",verifyExistsAccountNIF,(req,res)=>{
        const {description, anount} = req.body;

        const {customer} = req;

        const statementOperation = {
            description,
            anount,
            create_at: new Date(),
            type: "credit"
        }
        customer.statement.push(statementOperation);
        return res.status(200).send();
});
app.post("/withdraw",verifyExistsAccountNIF,(req,res)=>{
    const {anout} = req.body;
    const {customer} = req;
    const balance = getBalance(customer.statement);

    if(balance < anout)
        return res.status(400).json({error:"Insufficient funds!"})
   
    const statementOperation = {
        anout,
        create_at: new Date(),
        type: "debit"
    }
    customer.statement.push(statementOperation);

    return res.status(201).send();

})
app.listen(3000);