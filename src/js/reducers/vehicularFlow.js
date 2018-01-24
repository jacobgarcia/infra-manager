export default function vehicularReports(state = dumbVehicularReports, action) {
  switch (action.type) {
    case 'SET_VEHICULAR_REPORT':
      return [...state, {
        timestamp: action.timestamp,
        vehicle: action.vehicle,
        site: action.site,
        authorized: action.authorized,
        access: action.access,
      }]
    default:
      return state
  }
}

const dumbVehicularReports = [
  {
    timestamp: new Date('2018-01-16T06:50:00'),
    vehicle: 'Auto',
    zone: 'Norte',
    site: 'PITTIJ9812',
    authorized: 'Andrés López',
    access: 'Residente',
    photo_front: '/static/img/dummy/lpr-00.jpg',
    photo_back: '/static/img/dummy/lpr-01.jpg',
    plate_front: '/static/img/dummy/plate0.png',
    plate_back: '/static/img/dummy/plate1.png',
    profile: '/static/img/dummy/profile2.jpg',
    brand: 'Kia',
    model: 'Rio',
    color: 'Plata',
    plate: '7KZW227'
  },
  {
    timestamp: new Date('2018-01-15T12:05:00'),
    vehicle: 'Camioneta',
    zone: 'Norte',
    site: 'PITTIJ9812',
    authorized: 'Erick Tovar',
    access: 'Cliente',
    photo_front: '/static/img/dummy/lpr-11.jpg',
    photo_back: '/static/img/dummy/lpr-10.jpg',
    plate_front: '/static/img/dummy/plate9.png',
    plate_back: '/static/img/dummy/plate10.png',
    profile: '/static/img/dummy/profile5.jpg',
    brand: 'Chevrolet',
    model: 'Silverado',
    color: 'Vino',
    plate: '41557A2'
  },
  {
    timestamp: new Date('2018-01-11T13:30:00'),
    vehicle: 'Auto',
    zone: 'Norte',
    site: 'PITTIJ9812',
    authorized: 'Mariana Reynaud',
    access: 'Residente',
    photo_front: '/static/img/dummy/lpr-03.jpg',
    photo_back: '/static/img/dummy/lpr-02.jpg',
    plate_front: '/static/img/dummy/plate2.png',
    plate_back: '/static/img/dummy/plate3.png',
    profile: '/static/img/dummy/profile0.jpg',
    brand: 'Honda',
    model: 'Accord',
    color: 'Gris',
    plate: '7HNT893'
  },
  {
    timestamp: new Date('2018-01-10T16:45:00'),
    vehicle: 'Auto',
    zone: 'Norte',
    site: 'CONNOR1126',
    authorized: 'Alma Soriano',
    access: 'Residente',
    photo_front: '/static/img/dummy/lpr-07.jpg',
    photo_back: '/static/img/dummy/lpr-06.jpg',
    plate_front: '/static/img/dummy/plate6.png',
    plate_back: '/static/img/dummy/plate11.png',
    profile: '/static/img/dummy/profile1.jpg',
    brand: 'Nissan',
    model: 'Sentra',
    color: 'Plata',
    plate: '6MFH334'
  },
  {
    timestamp: new Date('2018-01-10T14:15:00'),
    vehicle: 'Camioneta',
    zone: 'Norte',
    site: 'PITTIJ9812',
    authorized: 'Pedro Camarena',
    access: 'Proveedor',
    photo_front: '/static/img/dummy/lpr-05.jpg',
    photo_back: '/static/img/dummy/lpr-04.jpg',
    plate_front: '/static/img/dummy/plate4.png',
    plate_back: '/static/img/dummy/plate5.png',
    profile: '/static/img/dummy/profile3.jpg',
    brand: 'Nissan',
    model: 'Frontier',
    color: 'Blanco',
    plate: '68484H1'

  },
  {
    timestamp: new Date('2018-01-09T06:20:00'),
    vehicle: 'Auto',
    zone: 'Norte',
    site: 'CONNOR1126',
    authorized: 'César Ramírez',
    access: 'Seguridad',
    photo_front: '/static/img/dummy/lpr-09.jpg',
    photo_back: '/static/img/dummy/lpr-08.jpg',
    plate_front: '/static/img/dummy/plate7.png',
    plate_back: '/static/img/dummy/plate8.png',
    profile: '/static/img/dummy/profile4.jpg',
    brand: 'Toyota',
    model: 'Camry',
    color: 'Negro',
    plate: '7HJG357'

  }
]
