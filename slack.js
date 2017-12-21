const Promise = require("bluebird");
const request = Promise.promisifyAll(require("request"));
const kms = require("kms");

const SLACK_ENCRYPTED_URL = process.env.SLACK_ENCRYPTED_URL;
const SLACK_URL = process.env.SLACK_URL;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;
const SLACK_USER_NAME = process.env.SLACK_USER_NAME || "AWS SNS";

let _slackUrl = SLACK_URL;
const getSlackURL = () => {
  if (_slackUrl) return Promise.resolve(_slackUrl);

  const blob = new Buffer(SLACK_ENCRYPTED_URL, "base64");

  return kms.decrypt(blob).then(result => {
    const url = result.toString();
    _slackUrl = url;
    return url;
  });
};

const sendMessage = (channel, message, attachments, attempt) => {
  return getSlackURL().then(slackURL => {
    var postData = {
      channel: channel || SLACK_CHANNEL,
      username: SLACK_USER_NAME,
      text: message,
      icon_emoji: ":aws:"
    };

    postData.attachments = attachments.map(attachment => {
      if (typeof attachment === "string") {
        return { color: "danger", text: attachment };
      }
      return attachment;
    });

    return request.postAsync({ url: slackURL, json: postData }).catch(err => {
      if (attempt > 2) {
        throw new Error("Failed to post to slack, reason: " + err.message);
      } else {
        console.log("retrying slack post, attempt", attempt + 1);
        return postToSlack(channel, message, attempt + 1);
      }
    });
  });
};

module.exports = {
  sendMessage: sendMessage
};
