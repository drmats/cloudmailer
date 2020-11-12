# cloudmailer

A (very) small-scale transactional email service.

<br />




## why?

There's a lot of good services out there: [sendgrid](https://sendgrid.com/),
[emaillabs](https://emaillabs.io/), [sendinblue](https://sendinblue.com/),
[amazon ses](https://aws.amazon.com/ses/), [mailgun](https://mailgun.com/)
to name a few. But I want my own that is able to send messages using custom
domain and ... I happen to have
[G Suite legacy free edition](https://support.google.com/a/answer/2855120).

<br />




## what?

[node.js](https://nodejs.org/), [nodemailer](https://nodemailer.com/),
a little bit of [google cloud](https://cloud.google.com/) + it's
[apis](https://www.npmjs.com/package/googleapis),
[express.js](https://expressjs.com/) and maybe a little bit of
[templating](https://handlebarsjs.com/).
(Almost) all in [typescript](https://www.typescriptlang.org/).

<br />




## how?

* clone repo and install dependencies
    ```bash
    $ git clone ...
    $ cd cloudmailer
    $ npm i
    ```

* create config files in [secrets](./secrets/)

* build and run
    ```bash
    $ npm run build
    $ npm start
    ```

* (optional) want to tinker yourself?
    ```bash
    $ npm run dev
    ```

<br />




## support

If you've found this useful, you can buy me a 🍺️ or 🍕️ via the [stellar][stellar] network:

* Payment address: [xcmats*keybase.io][xcmatspayment]
* Stellar account ID: [`GBYUN4PMACWBJ2CXVX2KID3WQOONPKZX2UL4J6ODMIRFCYOB3Z3C44UZ`][addressproof]

<br />




## license

**cloudmailer** is released under the BSD 2-Clause license. See the
[LICENSE](./LICENSE) for more details.




[stellar]: https://learn.stellar.org
[xcmatspayment]: https://keybase.io/xcmats
[addressproof]: https://keybase.io/xcmats/sigchain#d0999a36b501c4818c15cf813f5a53da5bfe437875d92262be8d285bbb67614e22
