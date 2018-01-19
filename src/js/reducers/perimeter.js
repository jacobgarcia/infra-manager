export default function perimeterReports(state = dumbPerimeterLogs, action) {
  switch (action.type) {
    case 'SET_PERIMETER_REPORT':
      return [...state, {
        day: action.timestamp,
        event: action.positions,
        site: action.site,
        risk: action.risk,
        status: action.status
      }]
    default:
      return state
  }
}

const dumbPerimeterLogs = [
  {
    timestamp: new Date(),
    event: 'Personal de seguridad detectado',
    zone: 'Bajío',
    site: 'SANCAR7621',
    risk: 0,
    status: 'Detección inofensiva'
  },
  {
    timestamp: new Date(),
    event: 'Perro detectado',
    zone: 'Bajío',
    site: 'MONRAZ3322',
    risk: 0,
    status: 'Detección de movimiento inofensiva'
  },
  {
    timestamp: new Date(),
    event: 'Peatón cruzando acceso',
    zone: 'Bajío',
    site: 'SANCAR7621',
    risk: 0,
    status: 'Detección inofensiva'
  },
  {
    timestamp: new Date(),
    event: 'Personal de limpieza detectado',
    zone: 'Bajío',
    site: 'MONRAZ3322',
    risk: 0,
    status: 'Detección inofensiva'
  }
]
