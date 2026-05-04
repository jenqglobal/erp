import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jenq-erp-secret-key-2024';

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  req.user = decoded;
  next();
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

export const requireModuleAccess = (module) => {
  return (req, res, next) => {
    const moduleAccess = {
      starter: ['dashboard', 'crm', 'inventory', 'accounting'],
      professional: ['dashboard', 'crm', 'inventory', 'accounting', 'hr', 'projects'],
      enterprise: ['dashboard', 'crm', 'inventory', 'accounting', 'hr', 'projects', 'reports', 'settings']
    };
    
    const userLicense = req.user.license_type || 'starter';
    const allowed = moduleAccess[userLicense] || moduleAccess.starter;
    
    if (!allowed.includes(module)) {
      return res.status(403).json({ 
        error: 'Module not available in your license',
        upgrade: true 
      });
    }
    
    next();
  };
};