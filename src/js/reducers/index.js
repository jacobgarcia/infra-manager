import { combineReducers } from 'redux'

const dumbVehicularAlerts = [
  {
    day: '16 de Enero',
    hour: '10:41',
    vehicle: 'Compacto. Placas registradas no coinciden con vehículo',
    zone: 'Sur',
    site: 'SANPTR1004',
    risk: 2,
    status: 'Acceso denegado'
  },
  {
    day: '15 de Enero',
    hour: '11:14',
    vehicle: 'Camioneta. Nuevo registro de vehículo',
    zone: 'Sur',
    site: 'SANPTR1004',
    risk: 0,
    status: 'Registro en proceso'
  },
  {
    day: '11 de Enero',
    hour: '11:51',
    vehicle: 'Motocicleta. Carga no registrada',
    zone: 'Sur',
    site: 'LOMCHP1356',
    risk: 0,
    status: 'Acceso denegado'
  },
  {
    day: '10 de Enero',
    hour: '17:45',
    vehicle: 'Motocicleta. Conductor de vehículo no coincide',
    zone: 'Sur',
    site: 'LOMCHP1356',
    risk: 0,
    status: 'Acceso denegado'
  },
  {
    day: '10 de Enero',
    hour: '13:09',
    vehicle: 'Camión. Vehículo de carga pesada',
    zone: 'Sur',
    site: 'CONSUR1126',
    risk: 2,
    status: 'Acceso denegado'
  },
  {
    day: '9 de Enero',
    hour: '10:21',
    vehicle: 'Camioneta. Vehículo no registrado',
    zone: 'Sur',
    site: 'CONSUR1126',
    risk: 0,
    status: 'Acceso denegado'
  },
  {
    day: '9 de Enero',
    hour: '09:46',
    vehicle: 'Motocicleta. Vehículo de invitados',
    zone: 'Sur',
    site: 'LOMCHP1356',
    risk: 0,
    status: 'Acceso autorizado por residente'
  },
  {
    day: '8 de Enero',
    hour: '12:12',
    vehicle: 'Sedán. Vehículo con pasajeros no identificados',
    zone: 'Sur',
    site: 'SANPTR1004',
    risk: 0,
    status: 'Acceso autorizado. Central de seguridad notificada'
  },
  {
    day: '7 de Enero',
    hour: '17:20',
    vehicle: 'Compacto. Vehículo conducido por persona registrada diferente al conductor registrado',
    zone: 'Sur',
    site: 'SANPTR1004',
    risk: 2,
    status: 'Acceso autorizado. Residente notificado'
  },
  {
    day: '7 de Enero',
    hour: '15:29',
    vehicle: 'Camioneta. Vehículo no registrado',
    zone: 'Sur',
    site: 'CONSUR1126',
    risk: 0,
    status: 'Acceso denegado'
  },
  {
    day: '7 de Enero',
    hour: '14:37',
    vehicle: 'Camioneta. Placas registradas no coinciden con vehículo',
    zone: 'Sur',
    site: 'CONSUR1126',
    risk: 0,
    status: 'Acceso denegado'
  },
  {
    day: '6 de Enero',
    hour: '11:26',
    vehicle: 'Compacto. Nuevo registro de vehículo',
    zone: 'Sur',
    site: 'LOMCHP1356',
    risk: 0,
    status: 'Registro satisfactorio'
  }
]
const dumbPerimeterReports = [
  {
    day: '15 de Enero',
    hour: '05:37',
    event: 'Personal de seguridad detectado',
    zone: 'Bajio',
    site: 'SANCAR7621',
    risk: 0,
    status: 'Detección inofensiva'
  },
  {
    day: '14 de Enero',
    hour: '08:46',
    event: 'Perro detectado',
    zone: 'Bajio',
    site: 'MONRAZ3322',
    risk: 0,
    status: 'Detección de movimiento inofensiva'
  },
  {
    day: '8 de Enero',
    hour: '15:24',
    event: 'Peatón cruzando acceso',
    zone: 'Bajio',
    site: 'SANCAR7621',
    risk: 0,
    status: 'Detección inofensiva'
  },
  {
    day: '4 de Enero',
    hour: '17:28',
    event: 'Personal de limpieza detectado',
    zone: 'Bajio',
    site: 'MONRAZ3322',
    risk: 0,
    status: 'Detección inofensiva'
  }
]
const dumbPerimeterAlerts = []
const dumbCameraReports = [
  {
    day: '14 de Enero',
    hour: '00:45',
    event: 'Movimiento inusual detectado',
    zone: 'Centro',
    site: 'MEXCOB0992',
    risk: 2,
    status: 'Análisis de video en proceso'
  },
  {
    day: '11 de Enero',
    hour: '02:12',
    event: 'Detección de movimiento',
    zone: 'Norte',
    site: 'CONHQ9094',
    risk: 0,
    status: 'Detección inofensiva. Personal de paqueteria'
  },
  {
    day: '10 de Enero',
    hour: '22:50',
    event: 'Ingreso de personal detectado en horario fuera de trabajo',
    zone: 'Norte',
    site: 'CONHQ8189',
    risk: 1,
    status: 'Grabación de video'
  }
]
const dumbCameraAlerts = []

// Authentication, initial state from localStorage
function credentials(state = {}, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        user: {
          _id: action.user._id,
          email: action.user.email,
          name: action.user.name,
          access: action.user.access,
          photoUrl: action.user.photoUrl
        },
        token: action.user.token,
        company: action.user.company,
        authenticated: true
      }
    case 'LOG_OUT':
      return {}
    default:
      return state
  }
}

// Global alerts (errors)
function appAlert(state = {}, action) {
  switch (action.type) {
    case 'DISMISS_ALERT':
      return {}
    case 'SET_ALERT':
      return {
        title: action.title,
        body: action.body
      }
    default:
      return state
  }
}

function reports(state = [], action) {
  switch (action.type) {
    case 'SET_INITIAL_REPORTS':
      return [...action.reports]
    case 'SET_REPORT': {
      const foundIndex = state.findIndex(({ site }) => site.key === action.report.site.key)
      const newState = [...state] // BUG: It only creates a shallow copy
      // console.log({report: action.report, foundIndex})

      foundIndex > -1
      ? newState[foundIndex] = {
        site: newState[foundIndex].site,
        zone: action.report.zone,
        _id: action.report._id,
        alarms: [{
          timestamp: action.report.timestamp,
          values: [...(action.report.alarms || [])],
          attended: false,
        }, ...(newState[foundIndex].alarms || [])],
        sensors: [{
          timestamp: action.report.timestamp,
          values: [...(action.report.sensors || [])]
        }, ...(newState[foundIndex].sensors || [])]
      }
      : newState.push({
        site: action.report.site,
        zone: action.report.zone,
        _id: action.report._id,
        alarms: [{
          timestamp: action.report.timestamp,
          values: [...(action.report.alarms || [])],
          attended: false,
        }],
        sensors: [{
          timestamp: action.report.timestamp,
          values: [...(action.report.sensors || [])]
        }]
      })
      return [...newState]
    }
    case 'SET_ATTENDED': {
      return state.map(report =>
        report.site._id === action.alarm.site._id
        ? {
          ...report,
          alarms: report.alarms.map(siteAlarm =>
            siteAlarm.timestamp === action.alarm.timestamp
            ? {...siteAlarm, attended: true}
            : {...siteAlarm}
          )
        }
        : report
      )
    }
    default:
      return state
  }
}

function zones(state = [], action) {
  switch (action.type) {
    case 'SET_EXHAUSTIVE':
      return [...action.zones]
    case 'SET_ZONE':
      return [...state, {
        _id: action.id,
        name: action.name,
        positions: action.positions,
        subzones: [] // IMPORTANT
      }]
    case 'SET_SITE':
      return state.map(zone =>
        zone._id === action.zoneId
        ? {
          ...zone,
          sites: [
            ...zone.sites,
            {
              _id: action.siteId,
              key: action.key,
              name: action.name,
              position: action.position
            }
          ]
        }
        : {...zone}
      )
    default:
    return state
  }
}

function administrators(state = [], action) {
  switch (action.type) {
    default:
    return state
  }
}

function facialReports(state = [], action) {
  switch (action.type) {
    case 'SET_FACIAL_REPORT':
      return [...state, {
        timestamp: action.timestamp,
        event: action.event,
        success: action.success,
        risk: action.risk,
        zone: action.zone,
        status: action.status,
        site: action.site,
        access: action.access,
        pin: action.pin,
        photo: action.photo,
        id: action.id
      }]
    default:
      return state
  }
}

import facialRecognitionLogs from './facialRecognition'
import cctvLogs from './cctv'
import vehicularFlowLogs from './vehicularFlow'
import accessLogs from './access'
import perimeterLogs from './perimeter'
import inventoryLogs from './inventory'


export default combineReducers({
  credentials,
  zones,
  facialReports,
  accessReports: accessLogs,
  cameraReports: cctvLogs,
  perimeterReports: perimeterLogs,
  vehicularReports: vehicularFlowLogs,
  inventoryReports: inventoryLogs,
  administrators,
  appAlert,
  reports
})
