export default function facialReports(state = dumbFacialLogs, action) {
  switch (action.type) {
    case 'SET_FACIAL_REPORT':
      return [
        ...state,
        {
          timestamp: action.timestamp,
          success: action.success,
          zone: action.zone,
          site: action.site,
          access: action.access,
          pin: action.pin,
          photo: action.photo
        }
      ]
    default:
      return state
  }
}

const dumbFacialLogs = [
  {
    timestamp: new Date('2018-01-15T10:16:00'),
    event: 'Intento de inicio de sesión',
    zone: {
      name: 'Centro'
    },
    site: 'MEXJIL1152',
    risk: 2,
    status: 'Acceso denegado. Almacenando y analizando rostro desconocido',
    id: '5a4e717750fdf1191fc0fe2c',
    access: 'Inicio de sesión',
    match: 'No',
    authorized: '4MEB8C2C15',
    photo: '/static/img/dummy/frm-00.jpg'
  },
  {
    timestamp: new Date('2018-01-11T15:00:00'),
    event: 'Registro de salida exitosa',
    zone: {
      name: 'Centro'
    },
    site: 'DIFXCH1293',
    risk: 0,
    status: 'Acceso autorizado. Sensorización reactivada',
    id: '5a4e5ac250fdf1191fc0fbf6',
    access: 'Cierre de sesión',
    match: 'Si',
    authorized: 'eWRhpRV',
    photo: '/static/img/dummy/frm-01.jpg'
  },
  {
    timestamp: new Date('2018-01-11T14:37:00'),
    event: 'Inicio de sesión exitoso',
    zone: {
      name: 'Centro'
    },
    site: 'DIFXCH1293',
    risk: 0,
    status: 'Acceso autorizado. Sensorización desactivada',
    id: '5a4e6de850fdf1191fc0fde4',
    access: 'Inicio de sesión',
    match: 'Si',
    authorized: 'eWRhpRV',
    photo: '/static/img/dummy/frm-02.jpg'
  },
  {
    timestamp: new Date('2018-01-10T20:25:00'),
    event: 'Intento de registro de personal',
    zone: {
      name: 'Centro'
    },
    site: 'MEXTLB1260',
    risk: 1,
    status: 'Regsitro denegado. Fallo en la detección de rostro',
    id: '5a4e717750fdf1191fc0fe2c',
    access: 'Registro',
    match: 'No',
    authorized: '46Juzcyx',
    photo: '/static/img/dummy/frm-04.jpg'
  },
  {
    timestamp: new Date('2018-01-10T11:34:00'),
    event: 'Registro de personal exitoso',
    zone: {
      name: 'Centro'
    },
    site: 'MEXATZ0973',
    risk: 0,
    status: 'Registro satisfactorio',
    id: '5a4ea71050fdf1191fc100f7',
    access: 'Registro',
    match: 'Si',
    authorized: '23TplPdS',
    photo: '/static/img/dummy/frm-03.jpg'
  },
  {
    timestamp: new Date('2018-01-09T10:14:00'),
    event: 'Registro de personal exitoso',
    zone: {
      name: 'Centro'
    },
    site: 'MEXTLB1260',
    risk: 0,
    status: 'Registro satisfactorio',
    id: '5a4eac1e50fdf1191fc10119',
    access: 'Registro',
    match: 'Si',
    authorized: 'eWRhpRV',
    photo: '/static/img/dummy/frm-05.jpg'
  }
]
