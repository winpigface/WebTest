const { is } = require("express/lib/request");
const User = require("../models/user.model"); 
const bcrypt = require("bcryptjs");
const { escape } = require("mysql2");
const req = require("express/lib/request");

const validUsername = (req, res) => {
  User.checkUsername(req.params.us, (err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        res.send({
          message: "Not found: " + req.params.us,
          valid: true,
        });
      } else {
        res.status(500).send({
          message: "Error query: " + req.params.us,
        });
      }
    } else {
      res.send({ record: data, valid: false });
    }
  });
};

const createNewUser = (req,res)=>{
  
  if(!req.body){
   
    res.status(400).send({message: "Content can not be empty."});
  }
  const salt = bcrypt.genSaltSync(10);
  const userobj = new User({
    fullname: req.body.fullname,
    email: req.body.email,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password,salt),
    img: req.body.img
  });
  User.create(userobj,(err,data)=>{
    if(err){
      res.status(500).send({message: err.message || "Some error occured while creating" });
    }else res.send(data);

  })
};

const login = (req,res) => {
  if(!req.body){
    res.status(400).send({message: "Content can not be empty."});
  }
  const acc = new User({
    username: req.body.username,
    password: req.body.password
  });
  User.loginModel(acc,(err,data)=>{
    if(err){
      if(err.kind = "not_found"){
         res.status(401).send({message: "Not found " + req.body.username});
      }
      else if(err.kind == "invalid_pass"){
        res.status(401).send({message: "Invalid Password"});
      }else{
        res.status(500).send({message: "Query error."});
      }
    }else res.send(data);
  });
};

const getAllUsers = (req,res) =>{
  User.getAllRecords((err,data)=>{
    if(err){
      res.status(500).send({message: err.message || "some error ocurred"});
    }else res.send(data);
  });
}

const updateUserCtrl  = (req,res)=>{
  if(!req.body){
    res.status(400).send({message: "Content can not be empty"});
  }
  const data = {
    fullname: req.body.fullname,
    email: req.body.email,
    img: req.body.img
  };
  User.updateUser(req.params.id,data,(err,result)=>{
    if(err){
      if(err.kind == "not_found"){
        res.status(401).send({message: "Not found user: " + req.params.id});
      }else{
        res.status(500).send({message: "Error update user: "+ req.params.id});
      }
    }else{
      res.send(result);
    }
  });
};

const deleteUser = (req,res) => {
  console.log("parameters: "+ req.params.id + ", " +req.params.p1 + ", "+req.params.p2);
  User.removeUser(req.params.id,(err,data)=>{
    if(err){
      if(err.kind == "not_found"){
        res.status(401).send({message: "Not found user: " + req.params.id});
      }else{
        res.status(500).send({message: "Error delete user: " + req.params.id});
      }
    }else{
      res.send(data);
    }
  });
}
module.exports = { validUsername,createNewUser,login ,getAllUsers,updateUserCtrl,deleteUser};//exports เพื่อให้ file อื่น สามารถใช้ตัวแปรนี้ได้ โดย require("ที่อยู่ไฟล์นี้")
