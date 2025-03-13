import jwt from 'jsonwebtoken';
import { addMinutes } from 'date-fns';
import activeEmailTemplate from '../emails/templates/activeEmail.template.js';
import { sendMail } from '../emails/emails.js';
import Token, { tokenTypes } from '../database/models/tokens.module.js';
import resetPasswordTemplate from '../emails/templates/resetPassword.template.js';

export const sendActiveEmail = async (user) => {
  try {
    // before send active email check if user has alrady token for active email what is not expired yet
    const oldToken = await Token.findOne({ userId: user._id, tokenType: tokenTypes.activeEmail, expires: { $gt: new Date() } });

    if (oldToken) return { error: false, isEmailSent: false, message: 'We alrady sent you an activation email please check your inbox' };

    // if no token then delete all tokens of user and create new token for active email
    await Token.deleteMany({ userId: user._id, tokenType: tokenTypes.activeEmail });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SEC_KEY, { expiresIn: '10m' });

    const activeEmailToken = await Token.create({
      userId: user._id,
      token,
      tokenType: tokenTypes.activeEmail,
      expires: addMinutes(new Date(), 10),
    });

    const CLIENT_WEBSITE_URL = process.env.NODE_ENV === 'production' ? process.env.CLIENT_WEBSITE_URL_P : process.env.CLIENT_WEBSITE_URL_D;

    const isEmailSent = await sendMail({
      to: user.emailData.emailAddress,
      subject: `${process.env.WEBSITE_NAME} account activation`,
      text: `${process.env.WEBSITE_NAME} account activation`,
      html: activeEmailTemplate({
        firstName: user.firstName,
        activeURL: `${CLIENT_WEBSITE_URL}/auth/verify-email/${activeEmailToken.token}`,
      }),
    });

    return { error: false, isEmailSent, message: '' };
  } catch (error) {
    return { error, isEmailSent: false, message: '' };
  }
};

export const sendResetPasswordEmail = async (user) => {
  try {
    // then check if has token for forgot password has not expired yet
    const oldToken = await Token.findOne({ userId: user._id, tokenType: tokenTypes.restPassword, expires: { $gt: new Date() } });

    if (oldToken) return { error: false, isEmailSent: false, message: 'We alrady sent you a reset password email please check your inbox' };

    // if no token then delete all tokens of user and create new token for forgot password
    await Token.deleteMany({ userId: user._id, tokenType: tokenTypes.restPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SEC_KEY, { expiresIn: '10m' });

    const restPasswordToken = await Token.create({
      userId: user._id,
      token,
      tokenType: tokenTypes.restPassword,
      expires: addMinutes(new Date(), 10),
    });

    const CLIENT_WEBSITE_URL = process.env.NODE_ENV === 'production' ? process.env.CLIENT_WEBSITE_URL_P : process.env.CLIENT_WEBSITE_URL_D;

    const isEmailSent = await sendMail({
      to: user.emailData.emailAddress,
      subject: `${process.env.WEBSITE_NAME} account activation`,
      text: `${process.env.WEBSITE_NAME} account activation`,
      html: resetPasswordTemplate({
        firstName: user.firstName,
        resetPasswordUrl: `${CLIENT_WEBSITE_URL}/auth/reset-password/${restPasswordToken.token}`,
      }),
    });

    return { error: false, isEmailSent, message: '' };
  } catch (error) {
    return { error, isEmailSent: false, message: '' };
  }
};
