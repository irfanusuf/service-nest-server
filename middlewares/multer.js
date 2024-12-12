const multer = require("multer")




const upload = multer({
    dest : "uploads/",
    limits :{
        fieldSize : 1024 *1024 *10    // 10mb
    }
})



const multmid = upload.single("image")


module.exports = {multmid}