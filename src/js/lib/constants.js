export default {
  hostUrl: window.location.origin,
  colors: value => {
    if (value > 75) {
      return '#00adee'
    } else if (value < 40) {
      return '#ed2a20'
    }
    return '#FFC511'
  },
  frmUrl: 'https://att.connus.mx'
}

export const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
]

export function getFriendlyDateRange(from, to) {
  if (!from && !to) {
    return 'Seleccionar'
  }

  if (!from || !to) {
    if (from) {
      return `${from.toLocaleDateString()} -`
    }
    return `- ${to.toLocaleDateString()}`
  }

  const isFromToday =
    from.toLocaleDateString() === new Date().toLocaleDateString()
  const isToToday = to.toLocaleDateString() === new Date().toLocaleDateString()

  if (isFromToday && isToToday) return `Hoy`

  if (from.getMonth() === to.getMonth()) {
    return `${from.getDate()} - ${to.getDate()} ${months[to.getMonth()]}`
  } else if (from.getFullYear() === to.getFullYear()) {
    return `${from.getDate()} ${months[from.getMonth()]} - ${to.getDate()} ${
      months[to.getMonth()]
    }`
  }
  return `${from.getDate()} ${
    months[from.getMonth()]
  } ${from.getFullYear()} - ${to.getDate()} ${
    months[to.getMonth()]
  } ${to.getFullYear()}`
}
