import UserEntity from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { verifyJWT, createJWT } from "../utils/JWT.js";

const loginController = async function (req, res, next) {
  const { email, password } = req.body;
  let err, errStatus, errMsg;
  errMsg = "Email and password are required";
  try {
    if (email === "" || password === "") {
      throw createNewError(400, "Email or password should not be empty");
    }

    const { ok, message, data } = validateUserData(email, password);

    if (!ok) {
      throw createNewError(400, "Error while validating data");
    }

    const doesUserExist = await UserEntity.findOne({
      email: data.trimmedEmail,
    });

    if (!doesUserExist) {
      throw createNewError(401, "Email does not exist");
    }

    const comparePasswords = await bcrypt.compare(
      password,
      doesUserExist.password
    );

    if (!comparePasswords) {
      throw createNewError(400, "Password do not match");
    }
    const token = createJWT(doesUserExist._id);

    return res.status(200).json({
      ok: true,
      message: "User Logged in Successfully",
      token,
      name: doesUserExist.name,
    });
  } catch (error) {
    next(error);
  }
};

const registerController = async function (req, res, next) {
  const { email, password, fullName } = req.body;

  let err, errStatus, errMsg;
  errMsg = "Email and password are required";
  try {
    if (email === "" || password === "" || fullName === "") {
      throw createNewError(400, "All details should be filled");
    }

    const { ok, message, data } = validateUserData(email, password);

    if (!ok) {
      throw createNewError(400, "Error while validating data");
    }

    const doesEmailExist = await UserEntity.findOne({
      email: data.trimmedEmail,
    });

    if (doesEmailExist) {
      throw createNewError(401, "Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.trimmedPassword, salt);

    const createdUser = new UserEntity({
      name: fullName,
      email: data.trimmedEmail,
      password: hashedPassword,
    });

    try {
      const newUser = await createdUser.save();

      const token = createJWT(newUser._id);
      return res.status(201).json({
        message: "User created Successfully",
        ok: true,
        token,
        name: newUser.name,
      });
    } catch (error) {
      throw createNewError(400, "Error while creating user");
    }
  } catch (error) {
    next(error);
  }
};

function validateUserData(email, password) {
  let trimmedEmail, trimmedPassword;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  trimmedEmail = email.trim();
  trimmedPassword = password.trim();
  if (trimmedEmail === "" || trimmedPassword === "") {
    return {
      ok: false,
      message: "Email and password are required",
      data: null,
    };
  }

  if (!trimmedEmail.match(emailRegex)) {
    return {
      ok: false,
      message: "Invalid Email",
      data: null,
    };
  }

  return {
    ok: true,
    message: "Validated successfully",
    data: { trimmedEmail, trimmedPassword },
  };
}

function createNewError(status, message) {
  let err;
  err = new Error(message);
  err.status = status;
  return err;
}

export { loginController, registerController };
