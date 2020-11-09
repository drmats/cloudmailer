// ...

"use strict";

const
    path = require("path"),
    { google } = require("googleapis"),
    { createTransport } = require("nodemailer"),

    client = require("../secrets/client.json");




// ...
function cloudmailer () {

    // JWT class used to authorize against google services
    // and obtain Access Token
    const gjwt = new google.auth.JWT({
        keyFile: path.join(__dirname, "../secrets/client_auth.json"),
        scopes: [
            "https://mail.google.com/",
            "https://www.googleapis.com/auth/gmail.modify",
            "https://www.googleapis.com/auth/gmail.compose",
            "https://www.googleapis.com/auth/gmail.send",
        ],
        subject: client.user,
    });


    // email sending logic
    return async function send (...args) {

        let
            { token } = await gjwt.getAccessToken(),
            transport = createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    type: "OAuth2",
                    user: client.user,
                    accessToken: token,
                }
            }),
            response = await transport.sendMail(...args);

        transport.close();

        return response;

    }

}




// ...
module.exports = cloudmailer;
