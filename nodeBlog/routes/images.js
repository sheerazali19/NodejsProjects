const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path'); 
const { ensureAuthenticated } = require('../config/auth');
const fs = require('fs')

router.get('/coverpic/:imagename', (req, res) => {
    const options = { root: path.join(__dirname, '../blogCoverPic') };
    const imageid = req.params.imagename;
    res.sendFile(imageid , options)
});


router.delete('/coverpic/delete/:imagename', (req, res) => {
    const options = { root: path.join(__dirname, '../blogCoverPic') };
    const imageid = req.params.imagename;
    if ( imageid == 'placeholder.png'){
        console.log('image id was ',imageid);
        res.json('done')
    }else{
        const imageFullPath = path.join(__dirname, '../blogCoverPic') +  "\\" + req.params.imagename;
        fs.unlinkSync(imageFullPath);
        res.json('done')
        console.log('image have been deleted')
    }
    
});


module.exports = router;