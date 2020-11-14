#!/bin/bash

#
# Cloudmailer.
#
# @license BSD-2-Clause
# @copyright Mat. 2020
#

curl \
    -X POST \
    -H "Content-Type: application/json" \
    -H "Origin: http://localhost" \
    -d '{"replyTo": "cloudmailer@mailinator.com", "subject": "Hi!", "text": "Good. ;)"}' \
    localhost:8080/cloudmailer/api/v1/send/ | \
    python -m json.tool
