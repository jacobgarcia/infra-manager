/*

        L O A D I N G

 */
export function setLoading() {
  return {
    type: 'SET_LOADING'
  }
}

export function setComplete() {
  return {
    type: 'SET_COMPLETE'
  }
}

/*

        A L E R T S

 */
export function alert(title, body) {
  return {
    type: 'SET_ALERT',
    title,
    body
  }
}

export function dismissAlert() {
  return {
    type: 'DISMISS_ALERT'
  }
}

/*

        C R E D E N T I A L S

 */
export function logout() {
  return {
    type: 'LOG_OUT'
  }
}

export function setCredentials(user, token) {
  return {
    type: 'SET_USER',
    user,
    token
  }
}

export function setAlarmAttended(alarm) {
  return {
    type: 'SET_ATTENDED',
    alarm
  }
}

/*

        Z O N E S

 */
export function setZone(id, name, positions) {
  return {
    type: 'SET_ZONE',
    id,
    name,
    positions
  }
}

export function setExhaustive(zones) {
  return {
    type: 'SET_EXHAUSTIVE',
    zones
  }
}

export function setSubzone(zoneId, subzoneId, name, positions) {
  return {
    type: 'SET_SUBZONE',
    zoneId,
    subzoneId,
    name,
    positions
  }
}

export function setSite(zoneId, subzoneId, siteId, key, name, position) {
  return {
    type: 'SET_SITE',
    zoneId,
    subzoneId,
    siteId,
    key,
    name,
    position
  }
}

/*

        R E P O R T S

 */
export function setReport(report) {
  return {
    type: 'SET_REPORT',
    report
  }
}

export function dismissReport(reportId) {
  return {
    type: 'DISMISS_REPORT',
    report: reportId
  }
}

/*

        H I S T O R Y

 */
export function setHistory(history) {
  return {
    type: 'SET_HISTORY',
    history
  }
}

/*

        A L A R M S

 */
export function setAlarm(alarm) {
  return {
    type: 'SET_ALARM',
    alarm
  }
}

export function setAlarms(alarms) {
  return {
    type: 'SET_ALARMS',
    alarms
  }
}

export function deleteAlarms() {
  return {
    type: 'DELETE_ALARMS'
  }
}

export function setFacialReport(
  timestamp,
  event,
  success,
  risk,
  zone,
  status,
  site,
  access,
  pin,
  photo,
  id
) {
  return {
    type: 'SET_FACIAL_REPORT',
    timestamp,
    event,
    success,
    risk,
    zone,
    status,
    site,
    access,
    pin,
    photo,
    id
  }
}

export function setInventoryReport(report) {
  return {
    type: 'SET_INVENTORY_REPORT',
    report
  }
}

export function setVehicleReport(report) {
  return {
    type: 'SET_VEHICULAR_REPORT',
    report
  }
}

/*

          C A M E R A S

 */
export function setCamera(camera) {
  return {
    type: 'SET_CAMERA',
    camera
  }
}
