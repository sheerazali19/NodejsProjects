# Step 1 setting up registration
    - make a express server with all the routes like login root and others
    - set up views of all the get routes 
    - connect to the mongoose database
    - create models for signup and other forms 
    - validate if user exists and all feilds and send messages via partial and ejs login 


# step 2 setting up connect flash 
    - connect-flash requiere it 
    - express-session and requiere it 
    - add the middleware under body parser and set two global variables for success and error
    
    ```
    app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();}); 
    ``` 
    - now add a flash setter on the redirect you wanna send flash message on `req.flash('success_msg','You are now registerd and can login');`
    - and on your ejs message file add a ejs display for these messages 


# step 3 login 
    - make a local stratagy 
    - use it and check if there is a user that exists if yes than check if the password hash in db is same as the password we gave with bcrypt.compare 
    - serialize and deserialzee the user with passport
    - now setup a post route to login and set success reqirect and failure redirect
    - now set another global variable for passport errors 

# step 4 logout

    - set up  dashboard  get route 
    - setup get route on logout and do req.logout to logout
    - now handle access controll in auth.js file in config