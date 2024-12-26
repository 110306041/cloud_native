import jwt from 'jsonwebtoken';

// console.log(SECRET_KEY)

export const authenticateToken = (req, res, next) => {
  const SECRET_KEY = process.env.JWT_SECRET_KEY ;
  // console.log(SECRET_KEY)
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from `Authorization: Bearer <token>`

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token missing.' });
  }
  // console.log(token)
  try {
    const verified = jwt.verify(token, SECRET_KEY); // Verify the token
    // console.log(verified);
    req.user = verified; // Attach user info to request
    next(); // Proceed to the next middleware
  } catch (err) {
    res.status(403).json({ error: err });
  }
};
