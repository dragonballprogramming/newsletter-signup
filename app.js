const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");
const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({apiKey: "f32966e6b0dfd3ebfe2cdc9b83806b2b-us9",  server: "us9",});

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("Public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/Public/templates/signup.html")
});

app.post("/", function(req, res){
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email

  const subscribingUser = {firstName: firstName, lastName: lastName, email: email}
  const run = async () => {
      const response = await client.lists.addListMember("c4539a80b1", {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
        }
      });
      console.log(response.status)
      const callResult = response.status;
      // console.log(response.status); // (optional)
      if (callResult == "subscribed"){
        res.sendFile(__dirname + "/Public/templates/success.html")
      } else {
        res.sendFile(__dirname + "/Public/templates/failure.html")
      }
    };
    run();
});

app.post("/failure", function(req, res){
  res.redirect("/")
})


app.listen(process.env.PORT || 3000, function(){
  console.log("Server is up and listening on port 3000.")
});


// const apiKey = "f32966e6b0dfd3ebfe2cdc9b83806b2b-us9"
// const auciencID = "c4539a80b1"
