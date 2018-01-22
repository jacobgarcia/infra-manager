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
    timestamp: new Date('2018-01-15T11:37:00'),
    event: 'Personal de seguridad detectado',
    zone: 'Bajío',
    site: 'SANCAR7621',
    risk: 0,
    status: 'Detección inofensiva'
  },
  {
    timestamp: new Date('2018-01-14T08:46:00'),
    event: 'Perro detectado',
    zone: 'Bajío',
    site: 'MONRAZ3322',
    risk: 0,
    status: 'Detección de movimiento inofensiva'
  },
  {
    timestamp: new Date('2018-01-08T15:24:00'),
    event: 'Peatón cruzando acceso',
    zone: 'Bajío',
    site: 'SANCAR7621',
    risk: 0,
    status: 'Detección inofensiva'
  },
  {
    timestamp: new Date('2018-01-04T05:28:00'),
    event: 'Personal de limpieza detectado',
    zone: 'Bajío',
    site: 'MONRAZ3322',
    risk: 0,
    status: 'Detección inofensiva'
  }
]
