class SESMailService {
  constructor(ses) {
    this.ses = ses;
  }

  async sendHtml(from, to, subject, body) {
    const params = {
      Destination: {
        ToAddresses: [
          to,
        ],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: from,
    };
    return this.ses.sendEmail(params).promise();
  }
}

export default SESMailService;
