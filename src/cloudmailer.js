// ...

"use strict";

const
    path = require("path"),
    { access } = require("@xcmats/js-toolbox/struct"),
    { google } = require("googleapis"),
    { createTransport } = require("nodemailer"),
    hb = require("handlebars"),

    client = require("../secrets/client.json"),
    config = require("../secrets/config.json");




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
let compileTemplates = () => ({
    subject: hb.compile(
        access(config, ["domains", 0, 1, "subject"], "{{subject}}")
    ),
    text: hb.compile(
        access(config, ["domains", 0, 1, "text"], "{{text}}")
    ),
    html: hb.compile(
        access(config, ["domains", 0, 1, "html"], "{{html}}")
    ),
});




// ...
async function main () {

    let
        recipient = access(
            config, ["domains", 0, 1, "to"],
            "drmats <drmats@users.noreply.github.com>"
        ),
        t = compileTemplates(),
        mail = cloudmailer();

    try {

        console.log(
            await mail({
                from: client.from,
                to: recipient,
                subject: t.subject({
                    subject: `${(new Date).toISOString()} 🤘 Hi there! 🤘`
                }),
                text: t.text({ text: "Just... Hello :-)." }),
                html: t.html({ html: "Just... Hello 😎." })
            })
        );

    } catch (ex) {

        console.error(access(
            ex, ["response", "data"], ex
        ));

    }

}




// ...
if (module === require.main) {
    main().catch(console.error);
}

module.exports = main;
