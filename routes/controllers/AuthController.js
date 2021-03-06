// const express = require('express');

// const router = express.Router();
const bcrypt = require('bcryptjs');
// const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator/check');

const User = require('../../models/User');

const AuthController = () => {
  // @route    GET api/auth
  // @desc     Test route
  // @access   Public
  const testRoute = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

  // @route    POST api/auth
  // @desc     Authenticate user & get token
  // @access   Public
  const postAuthUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };

  return {
    testRoute,
    postAuthUser,
  };
};

module.exports = AuthController;
