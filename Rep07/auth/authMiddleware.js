const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.username = req.user.login;
    next();
  } else {
    return res.status(401).json({
      timestamp: Date.now(),
      message: `Access Denied, user unauthenticated`,
      code: 401,
    });
  }
};

module.exports = requireAuth;
