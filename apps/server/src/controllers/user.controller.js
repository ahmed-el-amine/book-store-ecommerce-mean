import { isValidObjectId } from 'mongoose';
import User from '../database/models/user.model.js';
import AppError from '../utils/customError.js';
import httpStatus from 'http-status';
import { sendActiveEmail, sendResetPasswordEmail } from '../services/email.service.js';
import jwt from 'jsonwebtoken';
import Token, { tokenTypes } from '../database/models/tokens.module.js';
import Notification from '../database/models/notification.model.js';
import handleCookieDomain from '../utils/handleCookieDomain.js';

export const create = async (req, res) => {
  // check if there is a user with the same username and email
  const users = await User.find({
    $or: [{ username: req.body.username }, { 'emailData.emailAddress': req.body.email }],
  });

  if (users.length > 0) {
    // check if username exist
    if (users.find((user) => user.username === req.body.username)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: true,
        message: 'Username already exists',
      });
    }

    // if no username then will be email
    return res.status(httpStatus.BAD_REQUEST).json({
      error: true,
      message: 'email already exists',
    });
  }

  const role = req.isAdminCreation ? 'admin' : 'user';

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
    role: role,
  });

  sendActiveEmail(user);

  res.status(201).json({
    message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully, please check your email to activate your account`,
    user,
  });
};

export const login = async (req, res) => {
  // check if there is user has username or email equal to req.body.username
  const user = await User.findOne({
    $or: [{ username: req.body.username }, { 'emailData.emailAddress': req.body.username }],
  });

  if (!user) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: true,
      message: 'Username or password is incorrect',
    });
  }

  // if there is an user then compare password
  const isMatch = await user.comparePassword(req.body.password);
  if (!isMatch) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: true,
      message: 'Username or password is incorrect',
    });
  }

  // before login check if email is active or not
  if (!user.emailData.isEmailVerified) {
    sendActiveEmail(user);

    return res.status(httpStatus.BAD_REQUEST).json({
      error: true,
      message: 'Your account is not verified, we alrady sent you an activation email please check your inbox to activate your account',
    });
  }

  // if password is correct then return user and create token
  const token = user.createAuthToken();

  const CLIENT_WEBSITE_URL = process.env.NODE_ENV === 'production' ? process.env.CLIENT_WEBSITE_URL_P : process.env.CLIENT_WEBSITE_URL_D;

  // then send token to client in response and cookie
  // In your login function
  res.cookie(process.env.JWT_Cookie_Name, token, {
    path: '/',
    secure: true,
    httpOnly: true,
    domain: handleCookieDomain(CLIENT_WEBSITE_URL, { allowSubDomain: true }),
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(httpStatus.OK).json({ message: `Welcome back mr/ms ${user.firstName}`, data: { user, token } });
};

export const activeEmail = async (req, res) => {
  const token = req.body.token;

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SEC_KEY);
  } catch (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: true, message: 'This token has expires please request another token to active your account' });
  }

  const user = await User.findById(payload.id);

  if (!user) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: true, message: 'Invalid token' });
  }

  if (user.emailData.isEmailVerified) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: true, message: 'Your account is already verified' });
  }

  user.emailData.isEmailVerified = true;
  await user.save();

  // delete token
  await Token.deleteMany({ userId: user._id, tokenType: tokenTypes.activeEmail });

  return res.status(httpStatus.OK).json({ message: 'Your account is verified successfully' });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  // first check if email is exist in database
  const user = await User.findOne({ 'emailData.emailAddress': email });

  if (!user) return res.status(httpStatus.BAD_REQUEST).json({ error: true, message: 'there is no user with this email' });

  sendResetPasswordEmail(user);

  return res.status(httpStatus.OK).json({ message: 'Password reset instructions have been sent to your email' });
};

export const resetForgotPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SEC_KEY);
  } catch (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: true, message: 'This token has expires please request another token to reset your password' });
  }

  const user = await User.findById(payload.id);

  if (!user) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: true, message: 'Invalid token' });
  }

  user.password = newPassword;

  Promise.all([user.save(), Token.deleteMany({ userId: user._id, tokenType: tokenTypes.restPassword })]);

  return res.status(httpStatus.OK).json({ message: 'Your account password reset successfully' });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(httpStatus.OK).json({ users });
};

export const update = async (req, res) => {
  const updatedData = req.body;

  if (updatedData.password) req.user.password = updatedData.password;
  if (updatedData.firstName) req.user.firstName = updatedData.firstName;
  if (updatedData.lastName) req.user.lastName = updatedData.lastName;
  if (updatedData.email) {
    // check if new email exist
    const isEmailExist = await User.findOne({ 'emailData.emailAddress': updatedData.email });
    if (isEmailExist) {
      throw new AppError(httpStatus.BAD_REQUEST, 'updated email is alrady exist please select another email');
    }
    req.user.emailData.emailAddress = updatedData.email;
  }
  if (updatedData.phone) req.user.phone = updatedData.phone;

  await req.user.save();

  res.json({ message: 'data updated successfully', user: req.user });
};

export const getAllAddresses = (req, res) => {
  return res.json({
    user: req.user,
    address: req.user.address,
  });
};

export const addAddress = async (req, res) => {
  // check if new address is the primarry address
  if (req.body.isDefault) {
    // if new address is the primarry address then set all other addresses to false
    req.user.address.forEach((address) => (address.isDefault = false));
  }

  req.user.address.push(req.body);

  // check if address is just one then force it to be default
  if (req.user.address.length == 1) {
    req.user.address[0].isDefault = true;
  }

  await req.user.save();

  return res.status(httpStatus.CREATED).json({
    user: req.user,
    address: req.user.address,
  });
};

export const deleteAddress = async (req, res) => {
  const id = req.params.id;

  if (!isValidObjectId(id)) throw new AppError(httpStatus.BAD_REQUEST, 'please provide a valid id');

  const address = req.user.address.find((x) => x._id.toString() == id);

  if (!address) throw new AppError(httpStatus.BAD_REQUEST, 'No address found for this id');

  req.user.address = req.user.address.filter((x) => x._id.toString() != id);

  // if deleted address is the defualt then set another address to defualt
  if (address.isDefault && req.user.address.length > 0) {
    req.user.address[0].isDefault = true;
  }

  await req.user.save();

  return res.json({
    message: 'Address deleted successfully',
    user: req.user,
    deleted: address,
    address: req.user.address,
  });
};

export const updateAddress = async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  if (!isValidObjectId(id)) throw new AppError(httpStatus.BAD_REQUEST, 'please provide a valid id');

  const addressToUpdate = req.user.address.find((x) => x._id.toString() == id);

  if (!addressToUpdate) throw new AppError(httpStatus.BAD_REQUEST, 'No address found for this id');

  // if updated address is the defualt then set all other addresses to false
  if (updatedData.isDefault) {
    req.user.address.forEach((address) => (address.isDefault = false));
  }

  // update the address
  Object.keys(updatedData).map((key) => {
    addressToUpdate[key] = updatedData[key];
  });

  await req.user.save();

  return res.json({
    message: 'Address updated successfully',
    user: req.user,
    updated: addressToUpdate,
    address: req.user.address,
  });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = req.user;

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password updated successfully' });
};

export const getNotifications = async (req, res) => {
  // get userid from req.user
  const userId = req.user._id;

  // then get last 20 notifications for this user
  const notifications = await Notification.find({ userId }).limit(20).sort({ createdAt: -1 });

  return res.json({
    notifications,
  });
};

export const markAsRead = async (req, res) => {
  const userId = req.user._id;
  const id = req.params.id;

  if (!isValidObjectId(id)) throw new AppError(httpStatus.BAD_REQUEST, 'please provide a valid id');

  await Notification.findOneAndUpdate({ _id: id, userId }, { isRead: true });

  res.json({
    message: 'Notification marked as read',
  });
};
export const markAllAsRead = async (req, res) => {
  const userId = req.user._id;

  await Notification.updateMany({ userId, isRead: false }, { isRead: true });

  res.json({
    message: 'All Notification marked as read',
  });
};
