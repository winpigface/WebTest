const sql = require("./db"); //นำ file ที่สร้างการเข้าถึง database มาใช้
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const scKey = require("../config/jwt.config");
const expireTime = "2h"; //Token expire
const fs = require('fs');
const User = function(user){ 
    this.fullname = user.fullname;
    this.email = user.email;
    this.username = user.username;
    this.password = user.password;
    this.img = user.img;
}
User.checkUsername = (username,result) =>{ // check Username then send result
    sql.query("SELECT * FROM users WHERE username = '"+username+"'",(err,res)=>{
        if(err){ //error
            console.log("Error : "+err);
            result(err,null);
            return; // return เพื่ออกจาก  callback ของ sql.query
        }
        if(res.length){ // found username
            console.log("Found username: "+res[0]);
            result(null,res[0]);
            return;// return เพื่ออกจาก  callback ของ sql.query
        }
        result({kind: "not_found"},null);
    });
}

User.create = (newUser,result)=>{
    sql.query("INSERT INTO users SET ?",newUser,(err,res)=>{
        if(err){
            console.log("Query error: "+ err);
            result(err,null);
            return;
        }
        const Token = jwt.sign({id: res.insertId},scKey.secret,{expiresIn: expireTime});
        result(null,{id:res.insertId,...newUser,accesstoken: Token});
        console.log("Created User:",{id:res.insertId,...newUser,accesstoken: Token});
    });
};

User.loginModel = (account,result)=>{
    sql.query("SELECT * FROM users WHERE username = ?",[account.username],(err,res)=>{
        if(err){
            console.log("err: "+ err);
            result(err,null);
            return;
        }
        if(res.length){
            const currentpassword = bcrypt.compareSync(account.password,res[0].password);
            if(currentpassword){
                    const token = jwt.sign({id: res.insertId},scKey.secret,{expiresIn: expireTime});
                    console.log("Login success. Token +" + token);
                    res[0].accesstoken = token;
                    result(null,res[0]);
                    return;
            }else{
                console.log("Password not match");
                result({kind: "invalid_pass"},null);
                return;

            }
        }
        result({kind: "not_found"},null);
    });
};

User.getAllRecords = (result) => {
    sql.query("SELECT * FROM users",(err,res)=>{
        if(err){
            console.log("Query err:" + err);
            result(err,null);
            return;
        }
        result(null,res);
    });
}

const removeOldimage = (id,result) =>{
    sql.query("SELECT * FROM users WHERE id=?",[id],(err,res)=>{
        if(err){
                   console.log("err :" +err);
        result(err,null);
        return;
        }
         if(res.length){
        let filepath = __basedir + "/assets/" + res[0].img
        try {
            if(fs.existsSync(filepath)){
                fs.unlink(filepath,(e)=>{
                    if(e){
                        console.log("Error: " + e);
                        return;
                    }else{
                        console.log("File: "+res[0].img + " was removed.");
                        return;
                    }
                });
            }else{
                console.log("File: " + res[0].img + " not found.");
                return;
            }
        } catch (error) {
            console.log(error);
            return;
        }
         }
    });
   
};

User.updateUser = (id,data,result) =>{
    removeOldimage(id);
    sql.query("UPDATE users SET fullname=?,email=?,img=? WHERE id=?",[data.fullname,data.email,data.img,id],(err,res)=>{
        if(err){
            console.log("Update Error: " +err);
            result(err,null);
            return;
        }
        if(res.affectedRows == 0){
            //NO any record update
            result({kind: "not_found"},null);
            return;
        }
        console.log("Update user: "+ {id: id,...data});
        result(null,{id: id,...data});
        return;
    });
}

User.removeUser =(id,result) => {
    sql.query("DELETE FROM users WHERE id=?",[id],(err,res)=>{
        if(err){
            console.log("Delete Error:" + err);
            result(err,null);
            return;
        }
        if(res.affectedRows == 0){
            //NO any record delete
            result({kind: "not_found"},null);
            return;
        }
        console.log("Delete user id : "+ id);
        result(null,{id:id});
    });
};
module.exports = User;//exports เพื่อให้ file อื่น สามารถใช้ตัวแปรนี้ได้ โดย require("ที่อยู่ไฟล์นี้")