const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/UserModel");

const userVerification = async (req, res, next) => {

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") 
    ? authHeader.split(" ")[1] 
    : req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "YOUR_SECRET_KEY");
  
    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; 
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { userVerification };