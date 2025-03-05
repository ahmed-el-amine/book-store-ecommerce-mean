import { isValidObjectId } from 'mongoose';
import User from '../database/models/user.model.js';
import AppError from '../utils/customError.js';
import httpStatus from 'http-status';

export const create = async (req, res) => {
  // check if there is a user with the same username and email
  const users = await User.find({
    $or: [{ username: req.body.username }, { 'emailData.emailAddress': req.body.email }],
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

  res.status(201).json({
    message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
    user,
  });
};

export const login = async (req, res) => {
  // check if there is user has username or email equal to req.body.username
  const user = await User.findOne({
    $or: [{ username: req.body.username }, { 'emailData.emailAddress': req.body.username }],
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

  res.status(200).json({ message: `Welcome back mr/ms ${user.firstName}`, data: { user, token } });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({ users });
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
