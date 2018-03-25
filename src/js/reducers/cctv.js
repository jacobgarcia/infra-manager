const dumbCctvLogs = [
  {
    name: 'Almacén de Vinos Especiales',
    zone: { name: 'Centro' },
    site: { key: 'CONHQ9094'},
    id: 'CAMIP12378416',
    room: '/static/video/dummy/cctv-02.mp4',
    photo: 'https://www.cctvcamerapros.com/v/images/HD-Security-Cameras/BIPRO-S600VF12/outdoor-1080p-HD-CCTV-Camera.jpg'
  }
]

export default function cctvLogs(state = dumbCctvLogs, action) {
  switch (action.type) {
    case 'SET_CAMERA':
      return [...state, {
        name: action.camera.name || action.camera.id,
        zone: action.camera.site.zone || {name: 'N/A'} ,
        site: action.camera.site,
        id: action.camera.id,
        room: action.camera.room,
        photo: action.camera.photo
      }]
    default:
      return state
  }
}
