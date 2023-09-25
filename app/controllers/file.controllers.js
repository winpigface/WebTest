const req = require("express/lib/request");
const uploadFile = require("../middleware/upload"); //นำ module.exports จาก upload มาใช้

const upload = async (req, res) => { // ใช้ async-await 
  try { //ใช้ try-catch (หา error)
    console.log("file controller");
    await uploadFile(req, res); //ส่ง req,res ไปยัง upload.js ก่อน
    if (req.file == undefined) { 
      return res.status(400).send({ //ถ้าสถานะอยู่ที่ 400 (File not found)
        message: "Not Found the upload file.",
      });
    }
    res.status(200).send({ //ถ้าสถานะอยู่ที่ 200 (Success)
      message: "Upload file successfilly: " + req.file.filename,
      uploadFileName: req.file.filename,
    });
  } catch (error) {//If found error
    res.status(500).send({//ถ้าสถานะอยู่ที่ 500 (Sever error)
      message: "Could not upload a file: " + error,
    });
  }
};

const download = (req,res)=>{
  const filename = req.params.name;
  const directoryPath = __basedir + "/assets/";
  res.download(directoryPath + filename,filename,(err)=>{
    if(err){
      res.status(500).send({message: "Could not display the file. " + err});
    }
  });
}
module.exports = { upload , download };//exports เพื่อให้ file อื่น สามารถใช้ตัวแปรนี้ได้ โดย require("ที่อยู่ไฟล์นี้")
