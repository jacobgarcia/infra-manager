const request = require('request')
const winston = require('winston')

// AT&T
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
      winston.info('Hourly Only Update')
    }
  }
)

// DEMO
request.put(
  'https://api.connus.mx/v1/sites/online',
  {
    auth: {
      bearer:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTZiZGMwZDE3NjI2MmVmMjQ3OGFkZTIiLCJhY2MiOjQsImNtcCI6IjVhMTg5OGUyZjQwMzZhMzM5NzI2ZGJhZSIsImlhdCI6MTUzNzg5MTQ2Nn0.z32kMYkkaUTM5BfV80_oSB3k-0qVTgdg9DjQ5l8HVX0'
    }
  },
  (err, resp) => {
    if (err) {
      winston.error(err)
    }
    if (resp.statusCode === 200) {
      winston.info('Hourly Only Update')
    }
  }
)
