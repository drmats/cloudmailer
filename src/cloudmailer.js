// ...

"use strict";

const
    path = require("path"),
    { access } = require("@xcmats/js-toolbox/struct"),
    { google } = require("googleapis"),
    { createTransport } = require("nodemailer"),
    client = require("../secrets/client.json")




// current directory (`__dirname` is not defined in REPL)
let curdir
try { curdir = __dirname }
catch (_) { curdir = path.resolve(".") }




// JWT class used to authorize against google services and obtain Access Token
const gjwt = new google.auth.JWT({
    keyFile: path.join(curdir, "../secrets/client_auth.json"),
    scopes: [
        "https://mail.google.com/",
        "https://www.googleapis.com/auth/gmail.modify",
        "https://www.googleapis.com/auth/gmail.compose",
        "https://www.googleapis.com/auth/gmail.send",
    ],
    subject: client.user,
});




// ...
async function main () {

    try {

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
            info = await transport.sendMail({
                from: client.from,
                to: "drmats <drmats@users.noreply.github.com>",
                subject: "🤘 Hi there! 🤘",
                text: "Just... Hello :-).",
                html: "Just... Hello 😎.",
            });

        console.log(info)

    } catch (ex) {

        console.error(access(
            ex, ["response", "data", "error_description"], ex
        ));

    }

}




// ...
if (module === require.main) {
    main().catch(console.error);
}

module.exports = main;
