export function getAccessTitle(code) {
  switch (code) {
    case 4:
    case 3:
      return 'Administrador'
    default:
      return 'Usuario'
  }
}

export function getServiceName(code) {
  switch (code) {
    case '00':
      return { name: 'Sitios', _id: code }
    case '01':
      return { name: 'Accesos', _id: code }
    case '02':
      return { name: 'Flujo vehicular', _id: code }
    case '03':
      return { name: 'Perímetro', _id: code }
    case '04':
      return { name: 'Reconocimiento facial', _id: code }
    case '05':
      return { name: 'CCTV', _id: code }
    default:
      return { name: 'Indefinido' }
  }
}
