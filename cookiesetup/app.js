let express = require('express'); 
let cookieParser = require('cookie-parser'); 
//setup express app 
let app = express() 

app.use(cookieParser()); 


//basic route for homepage 
app.get('/', (req, res)=>{ 
res.send('welcome to express app'); 
}); 

//JSON object to be added to cookie 
let users = { 
name : "Ritik", 
Age : "18"
} 

//Route for adding cookie 
app.get('/setuser', (req, res)=>{ 
res.cookie("userData", users);
res.cookie("lol","lolbros")
res.cookie('poop', 'value', {expire: 400000 + Date.now()});
res.cookie('windows','vista',{maxAge: 360000});
res.send('user data added to cookie');
}); 

//Iterate users data from cookie 
app.get('/getuser', (req, res)=>{ 
//shows all the cookies 
res.send(req.cookies); 
}); 


//Route for destroying cookie 
app.get('/logout', (req, res)=>{ 
    //it will clear the userData cookie 
    res.clearCookie('userData'); 
    res.clearCookie("lol");
    res.clearCookie('poop');
    res.clearCookie('windows');
    res.clearCookie('name');
    res.send('user logout successfully');
}); 
  
//server listens to port 3000 
app.listen(3000, (err)=>{ 
if(err) 
throw err; 
console.log('listening on port 3000'); 
}); 
