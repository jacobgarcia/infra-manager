const dumbCctvLogs = [
  {
    name: 'Almacén de Vinos Especiales',
    zone: { name: 'Centro' },
    site: { key: 'CONHQ9094'},
    id: 'CAMIP12378416',
    room: '/static/video/dummy/cctv-02.mp4',
  }
]

export default function cctvLogs(state = dumbCctvLogs, action) {
  switch (action.type) {
    case 'SET_CAMERA':
      return [...state, {
        name: action.name,
        zone: action.zone,
        site: action.site,
        id: action.id,
        room: action.room
      }]
    default:
      return state
  }
}
