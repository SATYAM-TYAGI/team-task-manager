// simple role check, not best way but works for now
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: "not allowed for this role" });
    }
    next();
  };
};

module.exports = roleCheck;
