'use strict';


// load package
const express = require('express');
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
var mysql = require('mysql');
app.set("view engine", "ejs");
var db = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  database: 'cbo',
  password: '#0121080Pr'
});

app.get("/", (req, res) => {
    res.render("index.ejs");
  });

//get the html page to delet an employee
app.get("/employees-delete", (req, res) => {
    res.render("deleteEmployee", {title : "DeletEmployee"});
});
//get the html page to add an employee
app.get("/employees-add", (req, res) => {
    res.render("AddEmployee", {title : "AddEmployee"});
});

//get the update an employee page
app.get("/employees-update", (req, res) => {
    res.render("updateEmployee", {title : "UpdateEmployee"});
});

//get the update an employee page
app.get("/employees-id", (req, res) => {
    res.render("getEmployeeById", {title : "Employee"});
});

//get the page to add a report
app.get("/report-add", (req, res) => {
    res.render("addReport", {title : "Add Report"});
});

//get the page to get customer report
app.get("/reports", (req, res) => {
    res.render("customerReports", {title : "Get Report"});
});

//add a report
app.post("/reports", (req, res) => {
    let sql = `INSERT INTO reports (customerEmail, customerName  ,employeeEmail, employeeName,data) VALUE('${req.body.customerEmail}','${req.body.customerName}' ,'${req.body.employeeEmail}', '${req.body.employeeName}','${req.body.data}') `;
    db.query(sql,(err, result)=>{
        if(err){
            console.log(err);
        }else res.redirect("/");
    });
});

//get a report for a customer
app.get("/reports/:email", (req, res) => {
    let sql = `SELECT * FROM reports WHERE customerEmail = ?`;

        db.query(sql, req.params.email, (err, results) => {
            if(err){
                console.log(err);
            }else {
                console.log(results);
                res.send(results);
            }
        });
});

//add an employee
app.post("/employees", (req, res) =>{
    // console.log(req);
        let sql = `INSERT INTO employees(email, name, lastName, position) VALUE('${req.body.email}','${req.body.name}', '${req.body.lastName}','${req.body.position}') `;
        db.query(sql,(err, result)=>{
            if(err){
            if(err.code ===  "ER_DUP_ENTRY"){
                console.log(err);
                    res.render("error",{
                        message : "An employer with this email address already exists",
                        title : "Duplication error"
                    });}
                
            }else res.redirect("/");
        });
});
  //get all employees
app.get("/employees", (req, res) => {
    let sql = "SELECT * FROM employees";
    db.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
        
        else {
            console.log(results);
            res.render("allEmployees", {title : "ALL Employees",employees: results});
            
        }
    });
});

//delete an employee
app.delete("/employees/:email", (req, res) => {
    console.log("delete request received");
    let sql = "DELETE FROM employees wHERE email = ?";
    db.query(sql, req.params.email, (err, results) => {
        if(err){
            console.log(err);
        }
        else console.log("Deletion was successful");
    });
});

//update an employee
app.put("/employees", (req, res) => {
    console.log("received");
    // const data = JSON.parse(req.body);
    console.log(req.body);
    let sql = `UPDATE employees SET email = "${req.body.newEmail}" , name = "${req.body.name}", lastName = "${req.body.lastName}", position = "${req.body.position}" WHERE email = "${req.body.oldEmail}"` ;

    db.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
        else res.redirect("/");
    });
});


//get employees by ID 
app.get("/employees/:email", (req, res) => {
    let sql = "SELECT * FROM employees wHERE email = ?";
    console.log(req.params.email);
    db.query(sql, req.params.email, (err, results) => {
        if(err){
            console.log(err);
        }
        else 
        {
            console.log(results);
            res.send(results);
        }
    });
});

// app.delete("/employee/:id", (req, res) =>{
//     let sql = "DELETE FROM employees wHERE employee_ID = ?";
//     db.query(sql, req.params.id, (err, results) => {
//         if(err){
//             console.log(err);
//         }
//         else res.send("Data deletion successful");
//     });
// });

//get the page to add a customer
app.get("/customers-delete", (req, res) => {
    res.render("deleteCustomer", {title : "Delete Customer"});
});
//get the html page to add an employee
app.get("/customers-add", (req, res) => {
    res.render("addCustomer", {title : "Add Customer"});
});

//get the update an employee page
app.get("/customers-update", (req, res) => {
    res.render("updateCustomer", {title : "Update Customer"});
});

//get cusstomer by ID 
app.get("/customers/:email", (req, res) => {
    res.redirect(`/reports/${req.params.email}`);
});

//get the update an customer page
app.get("/customers-id", (req, res) => {
    res.render("getCustomerById", {title : "Customer"});
});

  //get all customers
  app.get("/customers", (req, res) => {
    let sql = "SELECT * FROM customers";
    db.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
        
        else {
            console.log(results);
            res.render("allCustomer", {title : "ALL Customers",customers: results});
            
        }
    });
});

//deleting customer
// app.delete("/customers/:email", (req, res) =>{
//     let sql = "DELETE FROM customers wHERE email = ?";
//     db.query(sql, req.params.email, (err, results) => {
//         if(err){
//             console.log(err);
//         }
//         else res.redirect("/");
//     });
// });

//add an customers
app.post("/customers", (req, res) =>{
    // console.log(req);
        let sql = `INSERT INTO customers(email, name, lastName) VALUE('${req.body.email}','${req.body.name}', '${req.body.lastName}') `;
        db.query(sql,(err, result)=>{
            if(err){
                if(err.code ===  "ER_DUP_ENTRY"){
                    console.log(err);
                    res.render("error",{
                        message : "An Customer with this email address already exists",
                        title : "Duplication error"
                    });
                }
            }else res.redirect("/");
        });
});

//update an customer
app.put("/customers", (req, res) => {
    console.log("received");
    // const data = JSON.parse(req.body);
    console.log(req.body);
    let sql = `UPDATE customers SET email = "${req.body.newEmail}" , name = "${req.body.name}", lastName = "${req.body.lastName}" WHERE email = "${req.body.oldEmail}"` ;

    db.query(sql, (err, results) => {
        if(err){
            console.log(err);
        }
        else res.redirect("/");
    });
});
app.listen(8080, ()=>{
    console.log("listening on 8080")
  });