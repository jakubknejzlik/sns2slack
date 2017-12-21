const assert = require("assert");

const sns = require("../sns");

const event = {
  Records: [
    {
      EventVersion: "1.0",
      EventSubscriptionArn: "arn:aws:sns:EXAMPLE",
      EventSource: "aws:sns",
      Sns: {
        SignatureVersion: "1",
        Timestamp: "1970-01-01T00:00:00.000Z",
        Signature: "EXAMPLE",
        SigningCertUrl: "EXAMPLE",
        MessageId: "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
        Message: "Hello from SNS!",
        MessageAttributes: {
          Test: {
            Type: "String",
            Value: "TestString"
          },
          TestBinary: {
            Type: "Binary",
            Value: "TestBinary"
          }
        },
        Type: "Notification",
        UnsubscribeUrl: "EXAMPLE",
        TopicArn: "arn:aws:sns:EXAMPLE",
        Subject: "TestInvoke"
      }
    }
  ]
};

describe("sns", () => {
  it("should parse event records", () => {
    let expectedResult = [
      {
        id: "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
        message: "Hello from SNS!",
        subject: "TestInvoke",
        attributes: {
          Test: { Type: "String", Value: "TestString" },
          TestBinary: { Type: "Binary", Value: "TestBinary" }
        }
      }
    ];
    let messages = sns.messagesFromEvent(event);
    assert.deepEqual(messages, expectedResult);
  });
});
