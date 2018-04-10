const dumbAccessesLogs = [
  {
    timestamp: new Date('2018-01-16T09:48:00'),
    event: 'Desconocido previamente detectado',
    zone: { name: 'Norte' },
    site: 'CONRES9094',
    risk: 3,
    status: 'Acceso denegado. Alerta emitida desde timbre',
    photo: '/static/img/dummy/access-05.png',
    id: '5a65dbb63562b0a357277d4b',
    access: 'Intruso',
    authorized: '-'
  },
  {
    timestamp: new Date('2018-01-12T09:52:00'),
    event: 'Desconocido a la puerta',
    zone: { name: 'Norte' },
    site: 'CONRES9094',
    risk: 2,
    status: 'Captura de desconocido. Analizando rostro',
    photo: '/static/img/dummy/access-04.png',
    id: '5a65dc1fe657951eb7cc6b6e',
    access: 'Intruso',
    authorized: '-'
  },
  {
    timestamp: new Date('2018-01-08T11:48:00'),
    event: 'Invitado a la puerta',
    zone: { name: 'Norte' },
    site: 'CONRES9094',
    risk: 0,
    status: 'Acceso autorizado. Invitado previamente registrado',
    photo: '/static/img/dummy/access-01.png',
    id: '5a65dc2821176533e85c5c16',
    access: 'Invitado',
    authorized: 'Alberto Arboleda'
  },
  {
    timestamp: new Date('2018-01-08T12:19:00'),
    event: 'Miembro de la casa a la puerta',
    zone: { name: 'Norte' },
    site: 'CONRES9094',
    risk: 0,
    status: 'Acceso otorgado remotamente por miembro de la casa',
    photo: '/static/img/dummy/access-06.png',
    id: '5a65dc3317900a1eafcb0f3c',
    access: 'Miembro',
    authorized: 'Emanuel Arboleda'
  },
  {
    timestamp: new Date('2018-01-05T20:39:00'),
    event: 'Personal de entrega a la puerta',
    zone: { name: 'Norte' },
    site: 'CONRES9094',
    risk: 0,
    status: 'Acceso otorgado internamente',
    photo: '/static/img/dummy/access-00.png',
    id: '5a65dc401d7bb400ee6fa3fb',
    access: 'Personal de entrega',
    authorized: 'Alberto Arboleda'
  },
  {
    timestamp: new Date('2018-01-05T19:30:00'),
    event: 'Invitado a la puerta',
    zone: { name: 'Norte' },
    site: 'CONRES9094',
    risk: 0,
    status: 'Acceso autorizado. Invitado previamente registrado',
    photo: '/static/img/dummy/access-03.png',
    id: '5a65dc49a08dafd269afe73f',
    access: 'Invitado',
    authorized: 'Sara Pousa'
  },
  {
    timestamp: new Date('2017-12-29T09:29:00'),
    event: 'Registro de invitado exitoso',
    zone: { name: 'Norte' },
    site: 'CONRES9094',
    risk: 0,
    status: 'Registro satisfactorio',
    photo: '/static/img/dummy/access-02.png',
    id: '5a65dc529a3214078c51c244',
    access: 'Invitado',
    authorized: 'Alberto Arboleda'
  }
]

export default function accessReports(state = dumbAccessesLogs, action) {
  switch (action.type) {
    case 'SET_ACCESS_REPORT':
      return [
        ...state,
        {
          timestamp: action.timestamp,
          event: action.positions,
          site: action.site,
          risk: action.risk,
          status: action.status
        }
      ]
    default:
      return state
  }
}
