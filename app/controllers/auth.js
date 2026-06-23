const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, Unauthenticated } = require("../errors");
const {
  registration: userRegistration,
  verifyUser,
} = require("../sevices/auth");
const { sendEmailVerification, sendResetEmail } = require("../utils/mail");
const uuid = require("uuid");
const { issueTokensForUser } = require("../sevices");
const { getDeviceIdHeader, deleteToken } = require("../sevices/token");
const { toUserDto, logger } = require("../utils");
const { clearCookiesToken, isTokenValid } = require("../utils/jwt");
const { Token } = require("../models");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const verificationToken = uuid.v4();
  await userRegistration({
    name,
    email,
    password,
    verificationToken,
  });

  logger.info("auth", "User registered, sending verification email", { email });

  await sendEmailVerification({
    email,
    verificationToken,
    origin: process.env.CLIENT_ORIGIN,
  });

  logger.info("auth", "Verification email sent", { email });

  return res.status(StatusCodes.OK).send();
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthenticated("No credential");
  }

  if (!user.isVerified) {
    throw new Unauthenticated("Please verify your email before logging in");
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new Unauthenticated("Password not valid");
  }

  const deviceId = getDeviceIdHeader({ req });
  const { accessToken } = await issueTokensForUser({ res, deviceId, user });

  res
    .status(StatusCodes.OK)
    .json({ data: toUserDto(user), accessToken, success: true });
};

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body;
  if (!email || !verificationToken) {
    throw new BadRequest("Please provide email and verificationToken");
  }
  const deviceId = getDeviceIdHeader({ req });

  const user = await verifyUser({ email, verificationToken });
  const { accessToken } = await issueTokensForUser({ res, deviceId, user });

  return res
    .status(StatusCodes.OK)
    .json({ data: toUserDto(user), accessToken, success: true });
};

const logout = async (req, res) => {
  const { userId } = req.query;
  const deviceId = req.headers["device-id"];

  await deleteToken({ deviceId, userId });
  await clearCookiesToken(res);

  return res.status(StatusCodes.OK).send();
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new Unauthenticated(`User with email ${email} not found`);
  }

  const passwordToken = uuid.v4();
  const expires = 1000 * 60 * 60 * 24; // 1d

  user.passwordToken = passwordToken;
  user.passwordTokenExpirationDate = new Date(Date.now() + expires);
  await user.save();

  logger.info("auth", "Sending password reset email", { email });

  await sendResetEmail({
    email,
    token: passwordToken,
    origin: process.env.CLIENT_ORIGIN,
  });

  logger.info("auth", "Password reset email sent", { email });

  return res.status(StatusCodes.OK).send();
};

const resetPassword = async (req, res) => {
  const { email, token: passwordToken, password } = req.body;

  if (!email) {
    throw new BadRequest(`Please provide valid email`);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Unauthenticated(`Credentials failed`);
  }

  const isTokenVerified = user.passwordToken === passwordToken;
  const isTokenExpired =
    !user.passwordTokenExpirationDate ||
    new Date() > user.passwordTokenExpirationDate;

  if (!isTokenVerified || isTokenExpired) {
    throw new Unauthenticated(`Token not valid`);
  }

  user.password = password;
  user.passwordToken = "";
  await user.save();

  return res
    .status(StatusCodes.OK)
    .json({ success: true, data: toUserDto(user) });
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.signedCookies;

  if (!refreshToken) {
    throw new Unauthenticated(`Authentication invalid`);
  }

  const userData = isTokenValid(refreshToken, process.env.JWT_REFRESH_SECRET);
  const tokenFromDb = await Token.findOne({ refreshToken });
  if (!userData || !tokenFromDb) {
    throw new Unauthenticated("Authentication invalid");
  }

  const user = await User.findOne({ _id: userData.id });
  const { deviceId } = userData;

  const { accessToken } = await issueTokensForUser({ res, user, deviceId });

  return res
    .status(StatusCodes.OK)
    .json({ data: toUserDto(user), accessToken, success: true });
};

const me = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new Unauthenticated("User not found");
  }
  return res.status(StatusCodes.OK).json({ data: toUserDto(user), success: true });
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
  refreshToken,
  me,
};
