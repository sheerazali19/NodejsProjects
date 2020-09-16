const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path'); 
const { ensureAuthenticated } = require('../config/auth');

router.get('/coverpic/:imagename', (req, res) => {
    const options = { root: path.join(__dirname, '../blogCoverPic') };
    const imageid = req.params.imagename;
    res.sendFile(imageid , options)
});



module.exports = router;