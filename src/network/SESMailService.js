class SESMailService {
  constructor(ses) {
    this.ses = ses;
  }

  async sendHtml(from, to, subject, body) {
    return new Promise((resolve, reject) => {
      var params = {
        Destination: {
          ToAddresses: [
            to
         ]
        },
        Message: {
         Body: {
          Html: {
           Charset: "UTF-8",
           Data: body
          }
         },
         Subject: {
          Charset: "UTF-8",
          Data: subject
         }
        },
        Source: from,
       };
       this.ses.sendEmail(params, function(error) {
         if (error) {
          reject(error);
         }
         else {
          resolve();
         }
       });
    });
  }
}

export default SESMailService;
