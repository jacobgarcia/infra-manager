export default function vehicularReports(state = [], action) {
  switch (action.type) {
    case 'SET_VEHICULAR_REPORT':
      return [
        ...state,
        {
          timestamp: action.report.timestamp,
          vehicle:
            action.report.vehicle &&
            action.report.vehicle.charAt(0).toUpperCase() +
              action.report.vehicle.slice(
                1,
                action.report.vehicle.indexOf('-')
              ),
          zone: action.report.zone,
          site: action.report.site,
          front: action.report.front,
          back: action.report.back,
          video: action.report.video,
          brand:
            action.report.brand &&
            action.report.brand.charAt(0).toUpperCase() +
              action.report.brand.slice(1),
          model:
            action.report.model &&
            action.report.model
              .slice(action.report.model.indexOf('_'))
              .charAt(1)
              .toUpperCase() +
              action.report.model.slice(action.report.model.indexOf('_') + 2),
          color: action.report.color,
          plate: action.report.plate,
          risk: action.report.risk,
          region: action.report.region,
          event: action.report.event
        }
      ]
    default:
      return state
  }
}
