const dumbAccessesLogs = [
  {
    timestamp: new Date(),
    event: 'Desconocido previamente detectado',
    zone: 'Norte',
    site: {key: 'CONHQ8189'},
    risk: 3,
    status: 'Acceso denegado. Cámaras de monitoreo encendido'
  },
  {
    timestamp: new Date(),
    event: 'Desconocido a la puerta',
    zone: 'Norte',
    site: 'CONRES9094',
    risk: 2,
    status: 'Acceso denegado'
  },
  {
    timestamp: new Date(),
    event: 'Invitado a la puerta',
    zone: 'Norte',
    site: {key: 'CONHQ8189'},
    risk: 0,
    status: 'Acceso autorizado. Invitado previamente registrado'
  },
  {
    timestamp: new Date(),
    event: 'Miembro de la casa a la puerta',
    zone: 'Norte',
    site: {key: 'CONRES9094'},
    risk: 0,
    status: 'Acceso otorgado internamente'
  },
  {
    timestamp: new Date(),
    event: 'Personal de paqueteria a la puerta',
    zone: 'Norte',
    site: 'CONHQ8189',
    risk: 0,
    status: 'Acceso otorgado remotamente por miembro de la casa'
  },
  {
    timestamp: new Date(),
    event: 'Invitado a la puerta',
    zone: 'Norte',
    site: 'CONRES9094',
    risk: 0,
    status: 'Acceso autorizado. Invitado previamente registrado'
  },
  {
    timestamp: new Date(),
    event: 'Registro de invitado exitoso',
    zone: 'Norte',
    site: 'CONRES9094',
    risk: 0,
    status: 'Registro satisfactorio'
  }
]

export default function accessReports(state = dumbAccessesLogs, action) {
  switch (action.type) {
    case 'SET_ACCESS_REPORT':
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
