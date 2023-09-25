const multer = require("multer"); //สามารถเข้าถึง object ของ user ที่ส่งมา
const util = require("util"); //แหล่งรวม function เพื่อใช้ง่ายขึ้น (สามารถแปลง callback เป็น promise หรือ async-await) 

const storage = multer.diskStorage({ //DiskStorage - ปรับแต่ง multer (setting)
    destination: (req,file,cb)=>{ //destination - บอกว่าให้ upload ที่ folder ไหน
        cb(null, __basedir + "/assets/"); //cb(error เป็น null(ไม่มี),โฟลเดอร์ปลายทางที่จะเก็บ) 
    },
    filename: (req,file,cb)=>{ //filename - กำหนดชื่อ file 
        //แสดงนามสกุลไฟล์ 
        const extArray = file.mimetype.split("/");
        const extension = extArray[extArray.length-1]; //-1 เพราะ string ตัวสุดท้ายเป็น null
        //ตั้งชื่อไฟล์ที่ upload มาให้ใหม่
        const newFilename = "Fileupload" + Date.now() + "."+extension; 
        cb(null,newFilename); //cb(error เป็น null(ไม่มี),ชื่อไฟล์ใหม่) 

    }
});
const uploadFile = multer({storage:storage}).single("singlefile"); 
//promisify => async-await
const uploadMiddleware = util.promisify(uploadFile); //ทำให้ ตัวแปร uploadFile กลายเป็น function asyn-await
module.exports = uploadMiddleware; //exports เพื่อให้ file อื่น สามารถใช้ตัวแปรนี้ได้ โดย require("ที่อยู่ไฟล์นี้")