// middleware/adminAuth.js
import jwt from 'jsonwebtoken';

export const adminAuthMiddleware = (req, res, next) => {
  // Retrieve the token from cookies
  const token = req.cookies['admin-token'];
  
  if (!token) {
    console.log("No token ")
    return res.status(401).json({ msg: 'Unauthorized: No token provided' });
  }

  try {
    // Verify the token using the secret key from your environment variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Optionally, attach the decoded payload to the request object for further use
    req.admin = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Unauthorized: Invalid token' });
  }
};
