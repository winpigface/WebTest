module.exports = app =>{
    const file_controller = require("../controllers/file.controllers"); //Use controllers from file.controllers
    console.log("file router");
    var router = require("express").Router();
    

    router.post("/upload", file_controller.upload); 
    router.get("/:name",file_controller.download);
    app.use("/api/file", router); 
    

};
