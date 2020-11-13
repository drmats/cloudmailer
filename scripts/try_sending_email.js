/* eslint-disable */

//
// Cloudmailer.
//
// @license BSD-2-Clause
// @copyright Mat. 2020
//




// try it in a browser's dev. tools console
await (
    await fetch("http://localhost:8080/cloudmailer/api/v1/send/", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "replyTo": "cloudmailer@mailinator.com",
            "subject": "Hi!",
            "text": "Good. ;)"
        })
    })
).json()
