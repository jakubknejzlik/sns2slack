const messagesFromEvent = event => {
  return event.Records.map(record => {
    const sns = record.Sns;

    let attributes = {};
    for (let key in sns.MessageAttributes) {
      attributes[key] = sns.MessageAttributes[key];
    }
    return {
      id: sns.MessageId,
      message: sns.Message,
      subject: sns.Subject,
      attributes: attributes
    };
  });
};

module.exports = {
  messagesFromEvent: messagesFromEvent
};
