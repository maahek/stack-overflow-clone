import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // This looks for token in header if missing then
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" }); // this message is provided to the user
    }
    // This removes the "Bearer " from the token and keeps only actual token if no token is found 
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({ message: "No token provided" }); // this message is provided to the user
    }
    // the token is checked against token if its valid we get back the data inside the token if invalid or expired error is thrown
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id || decoded.userId; // the userId from the token is stored in req.userId

    next(); // If everything is fine, the request continues to the next middleware or route.
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" }); 
  }
};

export default auth; 
