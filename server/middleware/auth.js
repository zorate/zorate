const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = payload.id;
    next();
  } catch (err) {
    res.clearCookie('token');
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function checkAdminPage(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.redirect('/zorate');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = payload.id;
    next();
  } catch (err) {
    res.clearCookie('token');
    return res.redirect('/zorate');
  }
}

module.exports = { requireAuth, checkAdminPage };