const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  // getting Express flash messages with req.flash('success') that will pull all success mesages you have to pass it in a variable or it wont work 

  //express flash message variable 
  let expressFlash = req.flash('success');
  
  // if statment to pass in a express flash success variable if there is any messaages or just render the page normally 
  if(expressFlash != undefined){
   res.render('index', { title: 'Members' ,  expressFlashSuccess: expressFlash });
  }else{
    res.render('index', { title: 'Members' });
  }
  });

module.exports = router;
