export const sendToken = (user, res, message, statusCode) => {
  const token = user.generateToken();

  res
    .status(statusCode)
    .cookie("token", token, {
      // secure :true, postman is not working, frontend is working
      ...cookieOptions,
      // Expire : 90Day
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
    })
    .json({ success: true, message: message });
};

export const cookieOptions = {
  secure: process.env.NODE_ENV === "Development" ? false : true,
  httpOnly: process.env.NODE_ENV === "Development" ? false : true,
  sameSite: process.env.NODE_ENV === "Development" ? false : "none",
};
