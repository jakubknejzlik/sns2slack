const sns2slack = require("sns2slack");

const mapFn = snsMessage => {
  const parsedMsg = JSON.parse(snsMessage.message);

  return {
    channel: null, // use default channel from SLACK_CHANNEL
    message: `*${parsedMsg.grid}/${parsedMsg.stack}/${parsedMsg.service}*`,
    attachments: [parsedMsg.log]
  };
};

exports.handler = sns2slack({ map: mapFn });
