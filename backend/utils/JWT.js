import jwt from "jsonwebtoken";

const createJWT = function (id) {
  return jwt.sign({ id }, process.env.SECRET_KEY);
};

const verifyJWT = function (req, res, next) {
  const token = req.header("Authorization").split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "Access denied." });
  }

  try {
    const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);

    if (!verifiedToken) {
      return res.status(400).send({ message: "Invalid token" });
    }

    req.currentUser = verifiedToken;
    next();
  } catch (error) {
    next(error);
  }
};

export { createJWT, verifyJWT };
