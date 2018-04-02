export default function vehicularReports(state = [], action) {
  switch (action.type) {
    case 'SET_VEHICULAR_REPORT':
      return [...state, {
        timestamp: action.report.timestamp,
        vehicle: action.report.vehicle && action.report.vehicle.charAt(0).toUpperCase() + action.report.vehicle.slice(1, action.report.vehicle.indexOf('-')),
        zone: action.report.zone,
        site: action.report.site,
        front: action.report.front,
        back: action.report.back,
        video: action.report.video,
        brand: action.report.brand && action.report.brand.charAt(0).toUpperCase() + action.report.brand.slice(1),
        model: action.report.model && action.report.model.slice(action.report.model.indexOf('_')).charAt(1).toUpperCase() + action.report.model.slice(action.report.model.indexOf('_') + 2) ,
        color: action.report.color,
        plate: action.report.plate,
        risk: action.report.risk,
        region: action.report.region
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
    plate: '7KZW227',
    risk: 1
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
    plate: '41557A2',
    risk: 2
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
    plate: '7HNT893',
    risk: 3
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
    plate: '6MFH334',
    risk: 0
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
    plate: '68484H1',
    risk: 0

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
    plate: '7HJG357',
    risk: 0

  }
]
