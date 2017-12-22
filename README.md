# sns2slack

AWS SNS to slack notifications handler for AWS Lambda

# Installation

_Assuming you already have SNS topic with subscribed lambda..._

1. Create node project and add dependency:
   `npm install sns2slack`

2. Create `index.js` file with following content:

```
const sns2slack = require("sns2slack");

exports.handler = sns2slack();
```

3. Zip your project file and upload it to AWS Lambda.

4. Setup environment variables:

* `SLACK_URL` - slack webhook integration url
* `SLACK_ENCRYPTED_URL` - AWS KMS encrypted value of `SLACK_URL`
* `SLACK_CHANNEL` - default slack channel name (you can override this value by map function)
* `SLACK_USER_NAME` - slack user name (default: `AWS SNS`)
* `SLACK_USER_ICON` - slack user icon (default: `:aws:`)

# Reference

`sns2slack(options)`: lambda handler function

`options`:

* `map(snsMessage)`: optional function for transforming and filtering messages (return null to filter the log)
