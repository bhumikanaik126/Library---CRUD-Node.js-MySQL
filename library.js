const express= require("express");
const mysql= require("mysql");
const app= express();

const con= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"KLE_library"
})

//middlewares
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

con.connect((err)=>{
    console.log("connected to mysql");
})

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/index.html");
})

app.post("/addauthor",(req,res)=>{
    const {auth_name,auth_bio}=req.body;
    const addAuthor=`INSERT INTO authors(author_name, author_bio) VALUES(?,?)`;
    con.query(addAuthor,[auth_name,auth_bio],(err)=>{
        if(err){
            console.log(err);
            res.send("error adding author");
            return;
        }
        res.send(`author added successfully <a href='/'>Go back</a>`);
    })
})

app.post("/addbook",(req,res)=>{
    const {title,auth_id,pub_yr,quantity} =req.body;
    const year=parseInt(pub_yr);
    if(year< 1800 || year>2025){
        res.send("invalid year <a href='/'>Go back</a>");
        return;
    }
    const addBook=`INSERT INTO Books (book_title, author_id, published_yr, quantity) VALUES (?,?,?,?)`;
    con.query(addBook,[title,auth_id, pub_yr,quantity],(err)=>{
        if(err){
            console.log(err);
            res.send("error adding book");
            return;
        }
        res.send(`book addded sucessfully <a href='/'>Go back</a> `);
    })
})

app.get("/deletebook",(req,res)=>{
    const id=req.query.id;
    const deleteBook=`DELETE FROM books WHERE book_id=?`;
    con.query(deleteBook,[id],(err)=>{
        if(err){
            console.log(err);
            res.send("error deleting book <a href='/'> Go back </a>");
            return;
        }

        res.send("book deleted successfully <a href='/'> Go back </a>");
    })
})

app.get("/searchbook",(req,res)=>{
    const id=req.query.id;
    const searchbook=`SELECT * from books WHERE book_id=?`;
    con.query(searchbook,[id],(err,results)=>{
        if(err){
            console.log(err);
            res.send("error seraching book <a href="/">Go back </a>");
            return;
        }

        if(results.length==0){
            res.send("book not found <a href="/">Go back </a>");
            return;
        }
        
        const book=results[0];
        res.send(
            ` <h1> Book details <h1>
            <p> Title: ${book.book_title} <p>
            <p> Author: ${book.author_id} <p>
           <p> Published year: ${book.published_yr} <p>
            <p> Quantity: ${book.quantity} <p>
            <a href="/"> Go back </a>
            `
        )
    })

})

app.get("/updatequantity",(req,res)=>{
    const quantity=req.query.quantity;
    const id= req.query.id;
    const updateQuantity=`Update books  SET quantity=? where book_id=?`;
    con.query(updateQuantity,[quantity,id],(err)=>{
        if(err){
            console.log(err);
            res.send("error updtaing quantity <a href='/'>Go back </a>");
            return;
        }
        res.send("quantity updated successfully <a href='/'>Go back </a>");
    })
})

app.get("/displaybooks",(req,res)=>{
    const displayBooks=`select * from books`;

    con.query(displayBooks,(err,results)=>{
        if(err){
            console.log(err);
            res.send("error displaying books <a href='/'>Go back </a>");
            return;
        }

        results= results.map((book)=>{
            return(
                `<div style="background-color:balck; color:white">
                <h1> Book details <h1>
                <p> Title: ${book.book_title} <p>
                <p> Author: ${book.author_id} <p>
                <p> Published year: ${book.published_yr} <p>
                <p> Quantity: ${book.quantity} <p>
                </div>
                `
            )
        })
        res.send(results.join("<br>"));
    })
})
app.listen(3000,()=>{
    console.log("server started");
})



