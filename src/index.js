// ...

"use strict";

const
    cloudmailer = require("./cloudmailer"),
    { access } = require("@xcmats/js-toolbox/struct"),
    hb = require("handlebars"),

    client = require("../secrets/client.json"),
    config = require("../secrets/config.json");




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
