const express = require("express");
const request = require("request");
//to grab user input data from a html file
const bodyParser = require("body-parser"); 
const https = require("https");

const app = express();

//allow to use the stylesheets
app.use(express.static("public"));

//allow to use body parser
app.use(bodyParser.urlencoded({extended: true}));

//get the file and respond to browser
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

//grab data from signup form with body parser
app.post("/", function(req, res){
    const firstname = req.body.fName;
    const lastname = req.body.lName;
    const email = req.body.Email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }

            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us7.api.mailchimp.com/3.0/lists/b1dfbe0c14";
    const options = {
        method: "POST",
        auth: "WilbertP:kfd4a016d66b52dfc6f68b3fe76a92aa0-us7"
    }

    const request = https.request(url,options, function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
    
});

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(3000, function(){
    console.log("server is on port 3000");
});

//Api ID
//fd4a016d66b52dfc6f68b3fe76a92aa0-us7

//List Id
//b1dfbe0c14