const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const saltRounds = 10;
const { clearRes } = require('../middleware/jwt.middleware.js');

exports.signupAuth = async (req, res) => {
    const { email, name, password } = req.body;

    if(email === '' || password === '' || name === '') {
        res.status(400).json({ message: "Provide email, password and name" });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if(!emailRegex.test(email)) {
        res.status(400).json({ message: "Provide a valid email address."});
        return;
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if(!passwordRegex.test(password)) {
        res.status(400).json({ message: "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter."});
        return;
    }

    try {
        const found = await User.findOne({ email });
        if(found) {
            return res.status(400).json({ message: "User already exists."});
        }

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        
        const newUser = await User.create({ email, password: hashedPassword, name });
        const user = { email: newUser.email, name: newUser.name, _id: newUser._id };
        res.status(201).json({ user: user });
    } catch(error) {
        console.log(error);
        res.status(400).json({ message: `Internal Server Error: ${error}` });
    }
}

exports.loginAuth = async (req, res) => {
    const { email, password } = req.body;

    if(email === '' || password === '') {
        res.status(400).json({ message: "Provide email and password"});
        return;
    }

    try {
        const found = await User.findOne({ email });
        if(!found) {
            res.status(401).json({ message: "User not found." });
            return;
        }

        const correctPassword = bcrypt.compareSync(password, found.password);
        if(correctPassword) {
            const { _id, email, name } = found;
            const token = jwt.sign(
                {
                    userId: _id,
                    email: email,
                    name: name
                },
                process.env.TOKEN_SECRET,
                { algorithm: 'HS256', expiresIn: "6h" }
            );
            const [header, payload, signature] = token.split('.');

            res.cookie("headload", `${header}.${payload}`, {
              maxAge: 1000 * 60 * 60 * 24,
              httpOnly: true,
              sameSite: true,
            });

            res.cookie("signature", signature, {
              httpOnly: true,
              sameSite: true,
            });

            res.status(200).json({ message: 'Credentials have been authenticated.' });
        } else {
            res.status(401).json({ message: "Your username or password is incorrect" });
        }
    } catch(error) {
        res.status(500).json({ message: `Internal Server Error: ${error}`})
    }
}

exports.logoutProcess = (req, res) => {
    res.clearCookie('headload');
    res.clearCookie('signature');
    res.status(200).json({ message: 'User has been logged out.'})
}

exports.verifyAuth = (req, res) => {
    const { headload, signature } = req.cookies;
    jwt.verify(
      `${headload}.${signature}`,
      process.env.TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        User.findById(decoded.userId)
          .then((user) => {
            const newUser = clearRes(user.toObject());
            return res.status(200).json({ user: newUser });
          })
          .catch((error) => {
            return res.status(401).json({ message: error });
          });
      }
    );
    // const theUser = req.currentUser;
    // res.status(200).json({ user: theUser });
}