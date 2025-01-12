const mysql= require("mysql");

const con= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:""
})

con.connect((err)=>{
    if(err) throw err;
    console.log("connected to mysql");

    const createDatabase=`CREATE DATABASE IF NOT EXISTS KLE_library;`;
    con.query(createDatabase,(err)=>{
        if(err) throw err;
        console.log("database created");

        const switchh=`USE KLE_library`;
        
        con.query(switchh,(err)=>{
            if(err) throw err;
            console.log("switched to KLE_library");

            const createAuthorsTbl=`CREATE TABLE IF NOT EXISTS authors(
                author_id INT AUTO_INCREMENT PRIMARY KEY,
                author_name VARCHAR(255) NOT NULL,
                author_bio TEXT
           );`
    
           con.query(createAuthorsTbl,(err)=>{
            if(err) throw err;
            console.log("authors table created");
    
            const createBooksTable=`CREATE TABLE IF NOT EXISTS books(
                    book_id INT AUTO_INCREMENT PRIMARY KEY,
                    book_title VARCHAR(255) NOT NULL,
                    author_id INT NOT NULL,
                    published_yr YEAR,
                    quantity INT DEFAULT 0,
                    FOREIGN KEY (author_id) REFERENCES authors(author_id)
            );`
    
            con.query(createBooksTable,(err)=>{
                if(err) throw err;
                console.log("books table created");
    
                con.end((err)=>{
                    if(err) throw err;
                    console.log("connection ended");
                })
            })
           })
        })

      
    })
})