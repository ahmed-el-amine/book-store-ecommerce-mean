import User from '../database/models/user.model.js';

export const create = async (req, res) => {
  // check if there is a user with the same username and email
  const users = await User.find({
    $or: [
      { username: req.body.username },
      { 'emailData.emailAddress': req.body.email },
    ],
  });

  if (users.length > 0) {
    // check if username exist
    if (users.find((user) => user.username === req.body.username)) {
      return res.status(400).json({
        error: true,
        message: 'Username already exists',
      });
    }

    // if no username then will be email
    return res.status(400).json({
      error: true,
      message: 'email already exists',
    });
  }

  // create user
  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    emailData: {
      emailAddress: req.body.email,
    },
    phone: req.body.phone,
  });

  res.status(201).json({ message: 'User created successfully', user });
};

export const login = async (req, res) => {
  // check if there is user has username or email equal to req.body.username
  const user = await User.findOne({
    $or: [
      { username: req.body.username },
      { 'emailData.emailAddress': req.body.username },
    ],
  });

  if (!user) {
    return res.status(404).json({
      error: true,
      message: 'Username or password is incorrect',
    });
  }

  // if there is an user then compare password
  const isMatch = await user.comparePassword(req.body.password);
  if (!isMatch) {
    return res.status(404).json({
      error: true,
      message: 'Username or password is incorrect',
    });
  }

  // if password is correct then return user and create token
  const token = user.createAuthToken();

  // then send token to client in response and cookie
  res.cookie(process.env.JWT_Cookie_Name, token, {
    path: '/',
    secure: true,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res
    .status(200)
    .json({ message: 'User logged in successfully', data: { user, token } });
};
