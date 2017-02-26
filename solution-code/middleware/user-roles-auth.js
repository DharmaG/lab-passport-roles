function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}
function checkIfStaff(role){
  return ((role === "Boss") || (role === "Developer") || (role === "TA"));
}

function ensureEmployee(req, res, next){
    if (req.isAuthenticated() && checkIfStaff(req.user.role) ) {
      return next();
    } else {
      res.redirect('/forbidden');
    }
}
function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/forbidden');
    }
  };
}

module.exports = {
  checkRoles, ensureEmployee, checkIfStaff, ensureAuthenticated
}
