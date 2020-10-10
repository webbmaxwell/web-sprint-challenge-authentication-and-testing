const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../users/user-model');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secrets');


router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  Users.add(user)
    .then((saved) => {
      res.status(201).json(saved)
    })
    .catch((err) => {
      res.status(500).json(err)
    })
});

router.post('/login', (req, res) => {
  // implement login
  let { username, password } = req.body;
  Users.findBy({username})
    .first()
    .then((user) => {
      if(user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user)
        res.status(200).json({ message: `Welcome ${user.username}`, token })
      } else {
        res.status(401).json({ message: 'Invalid Credentials' })
      }
    })
    .catch((err) => {
      res.status(500).json(err)
    })
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    lat: Date.now(),
  }
  const options = {
    expiresIn: '1h'
  }
  return jwt.sign(payload, jwtSecret, options)
}

module.exports = router;
