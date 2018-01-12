/* eslint-env node */
module.exports = {
  hasAccess: function(number) {
    return function (req, res, next) {
      if (!req._user) return res.status(400).json({ message: 'Not properly authenticated' })
      if (req._user.acc >= number) return next()
      return res.status(401).json({ message: 'Not valid permissions' })
    }
  }
}
