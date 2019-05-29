var express = require('express');
var router = express.Router();
var multer  = require('multer');
var path = require('path');
var fs = require('fs');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})
var upload = multer({ storage: storage });
router.ledDisplay = {};
/* GET Api listing. */
router.post('/image', upload.single('file'), function(req, res, next){
    var file = req.file;
    router.ledDisplay.setImage(file.path,function(){
        res.send({ret_code: '0'});
    });
});
module.exports = router;
