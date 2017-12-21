const slack = require("./slack");
const sns = require("./sns");

module.exports = options => {
  options = options || {};

  const _transformFn = options.transformFn || transformFn;

  return (event, context, callback) => {
    let messages = sns.messagesFromEvent(event);

    let promises = messages
      .map(snsMessage => {
        return _transformFn(snsMessage);
      })
      .map(message => {
        return slack.sendMessage(null, message.message, message.attachments, 0);
      });

    Promise.all(promises)
      .then(() => {
        callback(null);
      })
      .catch(callback);
  };
};

const transformFn = snsMessage => {
  return {
    channel: null,
    message: snsMessage.subject,
    attachments: [snsMessage.message]
  };
};
