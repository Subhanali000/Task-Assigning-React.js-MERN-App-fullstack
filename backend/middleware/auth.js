const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Received Authorization Header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or improperly formatted' });
  }

  const token = authHeader.split(' ')[1];

  try {
    if (!process.env.JWT_SECRET) {
      console.error(' JWT_SECRET is not set in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

   const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = { ...decoded, id: decoded._id }; // inject id for consistency
next();

    
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
