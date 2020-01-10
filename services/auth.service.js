const jwt = require('jsonwebtoken');
const config = require('config');

const secret = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret';

const authService = (res) => {
  const verify = (token, cb) => jwt.verify(token, config.get('jwtSecret') || secret, {}, cb);

  const issue = (payload) => {
    jwt.sign(
      payload,
      config.get('jwtSecret') || secret,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        if (res) { res.json({ token }); }
      },
    );
  };

  return {
    issue,
    verify,
  };
};

module.exports = authService;
