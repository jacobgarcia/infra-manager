const request = require('request')
const winston = require('winston')


request.put('https://api.connus.mx/v1//reports/alarms/count/PANA-MA',{
  'auth': {
    'bearer': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjU2NDViYjdjMGM4YzhlNDUzNWRkOGEiLCJhY2MiOjQsImNtcCI6IjViNTYzMjM5ODM2OGU3ZTk1ZjA0YzE1NyIsImlhdCI6MTUzMjQ2MzIyNn0.t1Naqm2G6WM6v_33Crp14wp_gsUp4GiV6xWZPsGtCf8'
  }
},
(err, resp) => {
  if (err) {
    winston.error(err)
  }
  if (resp.statusCode === 200) {
    console.log("Hourly Only Update")
  }
})
