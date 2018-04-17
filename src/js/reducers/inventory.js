export default function inventoryReports(state = {}, action) {
  switch (action.type) {
    case 'SET_INVENTORY_REPORT':
      return [
        ...state,
        {
          id: action.report._id,
          name: action.report.name,
          model: action.report.model,
          brand: action.report.brand,
          type: action.report.type,
          status: action.report.status,
          makerId: action.report.makerId,
          detailedStatus: action.report.detailedStatus,
          lastMantainanceFrom: action.report.lastMantainanceFrom,
          lastMantainanceTo: action.report.lastMantainanceTo,
          nextMantainanceFrom: action.report.nextMantainanceFrom,
          nextMantainanceTo: action.report.nextMantainanceTo,
          maintainer: action.report.maintainer,
          supervisor: action.report.supervisor,
          place: action.report.place,
          maintainanceType: action.report.maintainanceType,
          zone: action.report.zone,
          site: action.report.site,
          version: action.report.version,
          photo: action.report.photo
        }
      ]
    default:
      return state
  }
}
