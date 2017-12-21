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

const sendMessage = (channel, message, attempt) => {
  channel = channel || SLACK_CHANNEL;

  //   if (!config.url) {
  //     if (!attempt) attempt = 1;
  //     if (config.tokenInitError) {
  //       console.log("Error in decrypt the token. Not retrying.");
  //       return context.fail(config.tokenInitError);
  //     }
  //     if (attempt > config.maxAttempts) {
  //       console.log("Decrypt timed out");
  //       return context.fail("Timeout");
  //     }
  //     console.log(
  //       "Cannot flush logs since authentication token has not been initialized yet. Retrying in 100ms"
  //     );
  //     setTimeout(function() {
  //       postToSlack(parsedEvents, attempt + 1);
  //     }, 100);
  //     return;
  //   }

  //   var messages = parsedEvents
  //     .map(function(e) {
  //       return e.message.stack + "/" + e.message.service + ": " + e.message.log;
  //     })
  //     .join("\n");
  //   var logGroup =
  //     (parsedEvents[0] && parsedEvents[0].logGroupName) || "Missing logGroup";
  //   var logStream =
  //     (parsedEvents[0] && parsedEvents[0].logStreamName) || "Missing logEvent";

  //   try {

  return getSlackURL().then(slackURL => {
    var postData = {
      channel: SLACK_CHANNEL,
      username: SLACK_USER_NAME,
      text: "...",
      icon_emoji: ":aws:"
    };

    postData.attachments = [
      {
        color: "danger",
        text: messages
      }
    ];
    return request.postAsync({ url: slackURL, json: postData }).catch(err => {
      if (attempt > 2) {
        throw new Error("Failed to post to slack, reason: " + err.message);
      } else {
        return postToSlack(channel, message, attempt + 1);
      }
    });
  });

  // var req = https.request(options, function(res) {
  //   res.setEncoding("utf8");
  //   res.on("data", function(chunk) {
  //     sendSNS(postData);
  //   });
  // });

  // req.on("error", function(e) {
  //   context.fail(e.message);
  // });

  // req.write(util.format("%j", postData));
  // req.end();

  // var sns = new AWS.SNS();
  //   } catch (ex) {
  //     console.log(ex.message);
  //     context.fail(ex.message);
  //   }
};

module.exports = {
  sendMessage: sendMessage
};
