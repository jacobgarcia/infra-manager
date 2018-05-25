export default function perimeterReports(state = dumbPerimeterLogs, action) {
  switch (action.type) {
    case 'SET_PERIMETER_REPORT':
      return [...state, {
        timestamp: action.timestamp,
        zone: action.zone,
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
    timestamp: new Date('2018-04-03T11:37:00'),
    event: 'Sensor de apertura activado',
    zone: 'Centro',
    site: 'MEXATZ0973',
    risk: 2,
    status: 'Alerta generada'
  },
  {
    timestamp: new Date('2018-04-03T10:55:00'),
    event: 'Sensor de vibración activado',
    zone: 'Centro',
    site: 'MEXATZ0973',
    risk: 1,
    status: 'Alerta generada'
  },
  {
    timestamp: new Date('2018-04-02T18:29:00'),
    event: 'Sensor de apertura activado',
    zone: 'Centro',
    site: 'MEXOTU1208',
    risk: 2,
    status: 'Alerta generada'
  },
  {
    timestamp: new Date('2018-04-01T14:49:00'),
    event: 'Sensor de vibración activado',
    zone: 'Centro',
    site: 'MEXOTU1208',
    risk: 1,
    status: 'Alerta generada'
  },
  {
    timestamp: new Date('2018-03-30T12:49:00'),
    event: 'Sensor de vibración activado',
    zone: 'Centro',
    site: 'MEXECA1058',
    risk: 3,
    status: 'Alerta generada'
  },
  {
    timestamp: new Date('2018-03-29T11:34:00'),
    event: 'Sensor de vibración activado',
    zone: 'Centro',
    site: 'MEXECA1058',
    risk: 3,
    status: 'Alerta generada'
  },
  {
    timestamp: new Date('2018-03-29T08:11:00'),
    event: 'Sensor de vibración activado',
    zone: 'Centro',
    site: 'MEXECA1058',
    risk: 3,
    status: 'Alerta generada'
  },
  {
    timestamp: new Date('2018-03-28T17:32:00'),
    event: 'Sensor de vibración activado',
    zone: 'Centro',
    site: 'MEXECA1058',
    risk: 3,
    status: 'Alerta generada'
  }
]
