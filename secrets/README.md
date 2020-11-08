# cloudmailer secrets


This directory should contain a following files:


- `client_auth.json` which is a google cloud service account credentials file
    with a proper permissions and an appropriate private key (go to
    https://console.cloud.google.com/iam-admin/serviceaccounts and create one)

- `client.json` with a structure as follows:
    ```json
    {
        "user": "email-address-of-a-user-that-service-account-will-impersonate",
        "from": "email-address-to-be-put-to-FROM-field (e.g. configured alias)"
    }
    ```

- `config.json` with a following structure:
    ```json
    {
        "domains": [
            [
                "localhost",
                {
                    "to": "recipient <email@address>",
                    "subject": "localhost: {{subject}}",
                    "text": "Message from localhost:\n\n{{text}}",
                    "html": "<i>Message from localhost:</i><br /><br />{{html}}"
                }
            ]
        ]
    }
    ```
