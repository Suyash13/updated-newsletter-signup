const express = require('express');
const app = express();
const request = require('request');
const dotenv = require('dotenv');
const https = require('https');
const bodyParser = require('body-parser');

dotenv.config({ path: './config.env' });

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, function (req, res) {
    console.log("Server running on port 3000");
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = process.env.URL;

    const options = {
        method: "POST",
        auth: process.env.AUTH
    }

    const request = https.request(url, options, function (response) {
        // console.log(response.new_members[0]);
        // const response1 = JSON.stringify(response);
        // res.send(response1);
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
            // res.send(data);
        });

    });

    request.write(jsonData);
    request.end();

    // console.log(firstName + " " + lastName + " " + email);
    // res.send("Post Request Received");
});

app.post("/failure", function (req, res) {
    res.redirect("/");
})