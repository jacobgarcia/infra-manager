const dumbCctvLogs = [
  {
    timestamp: new Date(),
    event: 'Movimiento detectado',
    zone: 'Centro',
    site: 'MEXCOB0992',
    risk: 2,
    status: 'Análisis de video en proceso'
  },
  {
    timestamp: new Date(),
    event: 'Reporte de analíticos',
    zone: 'Centro',
    site: 'DIFXCH1293',
    risk: 0,
    status: 'Detección inofensiva. Personal de trabajo foráneo'
  },
  {
    timestamp: new Date(),
    event: 'Movimiento detectado en periodo no autorizado',
    zone: {name: 'Centro'},
    site: {name: 'DIFXCH1293'},
    risk: 3,
    status: 'Análisis de video en proceso'
  }
]

export default function cctvLogs(state = dumbCctvLogs, action) {
  switch (action.type) {
    case 'SET_CAMERA_REPORT':
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
