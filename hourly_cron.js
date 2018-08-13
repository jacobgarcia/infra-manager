const request = require('request')
const winston = require('winston')

request.put(
  'https://api.connus.mx/v1/sites/online',
  {
    auth: {
      bearer:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTg0ODMwMjQ3ZjBhZTEwZTkwMDNkZDciLCJhY2MiOjQsImNtcCI6IjVhMDA3Yzk2YjhhNWU4NDM1ZmQ5MGVhYSIsImlhdCI6MTUzMDY1MDAyNH0.r4qLHckl_Lw7HG3ZHipqm05hOVwLDeZLVjkZUi0mjzI'
    }
  },
  (err, resp) => {
    if (err) {
      winston.error(err)
    }
    if (resp.statusCode === 200) {
      winston.log('Hourly Only Update')
    }
  }
)
