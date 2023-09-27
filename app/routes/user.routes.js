const authjwt = require("../middleware/auth.jwt");
module.exports = (app)=>{
    const user_controller = require("../controllers/user.controller");
    var router = require("express").Router();
    router.get("/:us", user_controller.validUsername);
    router.post("/signup",user_controller.createNewUser);
    router.post("/login",user_controller.login);
    router.get("/",authjwt,user_controller.getAllUsers);
    router.put("/:id",authjwt,user_controller.updateUserCtrl);
    router.delete("/:id",authjwt,user_controller.deleteUser);
    app.use("/api/auth",router);
};