
import jwt from "jsonwebtoken";
import User from "../model/user.js";

const checkAuth = async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({
      error: "You are not logged in.",
    });
  }

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(_id).select(
      "_id fullname phone isAdmin"
    );

    if (!user) {
      return res.status(401).json({
        error: "User account no longer exists.",
      });
    }

    req.user = {
      _id: user._id,
      fullname: user.fullname,
      phone: user.phone,
      isAdmin: user.isAdmin,
    };

    return next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid or expired authentication token.",
    });
  }
};

const checkAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Authentication is required.",
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      error: "You are not authorized to perform this operation.",
    });
  }

  return next();
};

export { checkAuth, checkAdmin };
