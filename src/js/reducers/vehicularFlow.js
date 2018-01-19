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
    timestamp: new Date(),
    vehicle: 'Compacto',
    zone: 'Sur',
    site: 'SANPTR1004',
    authorized: 'Andrés López',
    access: 'Residente'
  },
  {
    timestamp: new Date(),
    vehicle: 'Camioneta',
    zone: 'Sur',
    site: 'SANPTR1004',
    authorized: 'Erick Tovar',
    access: 'Seguridad'
  },
  {
    timestamp: new Date(),
    vehicle: 'Motocicleta',
    zone: 'Sur',
    site: 'LOMCHP1356',
    authorized: 'Mariana Reynaud',
    access: 'Residente'
  },
  {
    timestamp: new Date(),
    vehicle: 'Motocicleta',
    zone: 'Sur',
    site: 'LOMCHP1356',
    authorized: 'Alma Soriano',
    access: 'Residente'
  },
  {
    timestamp: new Date(),
    vehicle: 'Camión',
    zone: 'Sur',
    site: 'CONSUR1126',
    authorized: 'Pedro Camarena',
    access: 'Proveedor'
  },
  {
    timestamp: new Date(),
    vehicle: 'Camioneta',
    zone: 'Sur',
    site: 'CONSUR1126',
    authorized: 'César Ramírez',
    access: 'Cliente'
  }
]
