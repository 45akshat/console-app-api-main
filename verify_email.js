const disposableEmailDetector = require('disposable-email-detector').default;

const email = 'iguana10840@gmail.com';

disposableEmailDetector(email)
  .then(isDisposable => {
    if (isDisposable) {
      console.log(`${email} is a disposable email address.`);
    } else {
      console.log(`${email} is not a disposable email address.`);
    }
  })
  .catch(error => {
    console.error('Error detecting disposable email:', error);
  });
