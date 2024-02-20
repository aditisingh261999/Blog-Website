import User from "../Models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "Jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  // hash password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  try {
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }
  try {
    const validUser = await User.findOne(email);
    if (!validUser) {
      throw errorHandler(errorHandler(401, "Invalid credentials"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      throw errorHandler(errorHandler(401, "Invalid credentials"));
    }
    // now signin the user using jwt token
    const token = jwt.sign({ _id: validUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: 3600,
    });
    // we dont want to show the pasword
    const { password: pass, ...rest } = validUser._doc;

    res.cookie("access_token", token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    });
    res.json({
      success: true,
      rest,
    });
  } catch (error) {
    next(error);
  }
};
