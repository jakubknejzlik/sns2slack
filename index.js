const slack = require('./slack');
const sns = require('./sns');

module.exports = options => {
  options = options || {};

  const _mapFn = options.map || mapFn;

  return (event, context, callback) => {
    let messages = sns.messagesFromEvent(event);

    let promises = messages
      .map(snsMessage => {
        return _mapFn(snsMessage);
      })
      .filter(message => {
        return !!message;
      })
      .map(message => {
        return slack.sendMessage(
          message.channel || null,
          message.message,
          message.attachments,
          0
        );
      });

    Promise.all(promises)
      .then(() => {
        callback(null);
      })
      .catch(callback);
  };
};

const mapFn = snsMessage => {
  return {
    channel: null,
    message: snsMessage.subject,
    attachments: [snsMessage.message]
  };
};
