export const sendToken = (user, res, message, statusCode) => {
  const token = user.generateToken();

  res
    .status(statusCode)
    .cookie("token", token, {
      // Expire : 90Day
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
    })
    .json({ success: true, message: message, token });
};
