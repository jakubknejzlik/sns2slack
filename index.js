const slack = require("./slack");
const sns = require("./sns");

module.exports = () => {
  return (event, context, callback) => {
    let messages = sns.messagesFromEvent(event);

    let promises = messages.map(message => {
      return slack.sendMessage(null, message.message, 0);
    });

    Promise.all(promises)
      .then(() => {
        callback(null);
      })
      .catch(callback);
  };
};
