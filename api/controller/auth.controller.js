import User from "../Models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
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

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  if (
    !email ||
    !name ||
    !googlePhotoUrl ||
    email === "" ||
    name === "" ||
    googlePhotoUrl === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: 3600,
      });
      // we dont want to show the pasword
      const { password, ...rest } = user._doc;

      res
        .status(200)
        .cookie("access_token", token, {
          expires: new Date(Date.now() + 3600000),
          httpOnly: true,
        })
        .json(rest);
    } else {
      /**
       * since we need password also according to our model,
       * so we need to generate a random password which user can change later
       */
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(generatedPassword, salt);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePhoto: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: 3600,
      });
      // we dont want to show the pasword
      const { password, ...rest } = newUser._doc;

      
      res
        .status(200)
        .cookie("access_token", token, {
          expires: new Date(Date.now() + 3600000),
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
