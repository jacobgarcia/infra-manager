export function getAccessTitle(code) {
  switch (code) {
    case 4:
    case 3:
    return 'Administrador'
    default:
    return 'Usuario'
  }
}
