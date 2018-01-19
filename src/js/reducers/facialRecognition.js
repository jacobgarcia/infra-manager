export default function facialReports(state = dumbFacialLogs, action) {
  switch (action.type) {
    case 'SET_FACIAL_REPORT':
      return [...state, {
        timestamp: action.timestamp,
        event: action.positions,
        site: action.site,
        risk: action.risk,
        status: action.status,
      }]
    default:
      return state
  }
}

const dumbFacialLogs = [
  {
    timestamp: new Date(),
    event: 'Intento de inicio de sesión',
    zone: 'Centro',
    site: 'MEXJIL1152',
    risk: 2,
    status: 'Acceso autorizado. Sensorización desactivada'
  },
  {
    timestamp: new Date(),
    event: 'Registro de salida exitosa',
    zone: 'Centro',
    site: 'DIFXCH1293',
    risk: 0,
    status: 'Acceso autorizado. Sensorización reactivada'
  },
  {
    timestamp: new Date(),
    event: 'Inicio de sesión exitoso',
    zone: 'Centro',
    site: 'DIFXCH1293',
    risk: 3,
    status: 'Acceso autorizado. Sensorización desactivada'
  },
  {
    timestamp: new Date(),
    event: 'Registro de personal exitoso',
    zone: 'Centro',
    site: 'MEXATZ0973',
    risk: 0,
    status: 'Registro satisfactorio'
  },
  {
    timestamp: new Date(),
    event: 'Intento de registro de personal',
    zone: 'Centro',
    site: 'MEXTLB1260',
    risk: 1,
    status: 'Regsitro denegado. Fallo en la detección de rostro'
  },
  {
    timestamp: new Date(),
    event: 'Registro de personal exitoso',
    zone: 'Centro',
    site: 'MEXTLB1260',
    risk: 0,
    status: 'Registro satisfactorio'
  }
]
