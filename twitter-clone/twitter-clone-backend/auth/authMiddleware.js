const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.login = req.user.login;
    req.userId = req.user._id;
    req.follows = req.user.follows;
    next();
  } else {
    return res.json({
      login: null,
      message: `Access Denied, user unauthenticated`,
      code: 401,
    });
  }
};

module.exports = requireAuth;
