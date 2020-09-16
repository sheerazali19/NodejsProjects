module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Plase log in to view this reasource');
        res.redirect('/users/login');
    }
}