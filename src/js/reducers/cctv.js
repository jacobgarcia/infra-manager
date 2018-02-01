const dumbCctvLogs = [
  {
    timestamp: new Date(),
    event: 'Movimiento detectado',
    zone: {name: 'Centro', _id: null},
    site: 'MEXCOB0992',
    risk: 2,
    status: 'Análisis de video en proceso',
    video: '/static/video/dummy/cctv-00.mp4',
    videoJsOptions: {
      controls: true,
      autoplay: true,
      sources: [{
        src: 'rtmp://demo.connus.mx/live&stream',
        type: 'rtmp/mp4'
      }],
      width: 360,
      height: 240,
      controlBar: {
          volumePanel: false
      }
    }
  },
  {
    timestamp: new Date(),
    event: 'Reporte de analíticos',
    zone: {name: 'Centro', _id: null},
    site: 'DIFXCH1293',
    risk: 0,
    status: 'Detección inofensiva. Personal de trabajo foráneo',
    video: '/static/video/dummy/cctv-01.mp4',
    videoJsOptions: {
      controls: true,
      autoplay: true,
      sources: [{
        src: 'rtmp://demo.connus.mx/live&stream2',
        type: 'rtmp/mp4'
      }],
      width: 360,
      height: 240,
      controlBar: {
          volumePanel: false
      }
    }
  },
  {
    timestamp: new Date(),
    event: 'Movimiento detectado en periodo no autorizado',
    zone: {name: 'Centro', _id: null},
    site: 'DIFXCH1293',
    risk: 3,
    status: 'Análisis de video en proceso',
    video: '/static/video/dummy/cctv-02.mp4',
    videoJsOptions: {
      controls: true,
      autoplay: true,
      sources: [{
        src: 'rtmp://demo.connus.mx/live&stream3',
        type: 'rtmp/mp4'
      }],
      width: 360,
      height: 240,
      controlBar: {
          volumePanel: false
      }
    }
  }
]

export default function cctvLogs(state = dumbCctvLogs, action) {
  switch (action.type) {
    case 'SET_CAMERA_REPORT':
      return [...state, {
        timestamp: action.timestamp,
        event: action.positions,
        site: action.site,
        risk: action.risk,
        status: action.status,
      }]
    default:
      return state
  }
}
