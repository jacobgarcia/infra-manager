export default function inventoryReports(state = {}, action) {
  switch (action.type) {
    case 'SET_INVENTORY_REPORT':
      return [...state, {
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
      }]
    default:
      return state
  }
}

const dumbInventoryLogs = [
  {
    "photo": "/static/img/dummy/ac-01.jpg",
    "zone": {
       "name": "Centro"
     },
    "site": "CNHQ8184",
    "name": "aire acondicionado fujitsu AC549871",
    "brand": "fujitsu",
    "model": "AC549871",
    "type": "Split Cassette",
    "status": "activo",
    "_id": "fujAC5001",
    "version": 1.2,
    "idBrand": "fuj01",
    "detailedStatus": {
      "temperature": 19,
      "active": true
    }
  },
  {
    "zone": {
       "name": "Centro"
     },
    "site": "CNHQ9094",
    "photo": "/static/img/dummy/ac-02.jpg",
    "name": "aire acondicionado ophouse AWR9S75",
    "brand": "ophouse",
    "model": "AWR9S75",
    "type": "Split Ventana",
    "status": "activo",
    "_id": "ophAWR001",
    "version": 1.0,
    "idBrand": "oph01",
    "detailedStatus": {
      "temperature": 15,
      "active": true
    }
  },
  {
    "zone": {
       "name": "Centro"
     },
    "site": "CNHQ9094",
    "photo": "/static/img/dummy/ac-03.jpg",
    "name": "aire acondicionado hitachi RQR9E25",
    "brand": "hitachi",
    "model": "RQR9E25",
    "type": "portAtil",
    "status": "activo",
    "_id": "hitRQR001",
    "version": 1.0,
    "idBrand": "hit01",
    "detailedStatus": {
      "temperature": 21,
      "active": true
    }
  },
  {
    "zone": {
       "name": "Centro"
     },
    "site": "CNHQ9094",
    "photo": "/static/img/dummy/fg-01.jpg",
    "name": "refrigerador lG LDCS2422",
    "brand": "LG",
    "model": "LDCS2422",
    "type": "stainless",
    "status": "activo",
    "_id": "LGRQR001",
    "version": 2.4,
    "idBrand": "lg001",
    "detailedStatus": {
      "temperature": 5,
      "active": true
    }
  },
  {
    "zone": {
       "name": "Centro"
     },
    "site": "CNHQ9094",
    "photo": "/static/img/dummy/ft-01.jpg",
    "name": "multifuncional brother mfcl6700",
    "brand": "brother",
    "model": "mfcl6700",
    "type": "laser",
    "status": "activo",
    "_id": "3W42W5001",
    "version": 1.0,
    "idBrand": "bro01",
    "detailedStatus": {
      "temperature": 35,
      "active": true

    }
  },
  {
    "zone": {
       "name": "Centro"
     },
    "site": "CNHQ9094",
    "photo": "/static/img/dummy/rt-01.jpg",
    "name": "Router Cisco RV130WWB",
    "brand": "cisco",
    "model": "RV130WWB",
    "type": "wan",
    "estatus": "activo",
    "_id": "1W82AY001",
    "version": 1.5,
    "idBrand": "sis01",
    "detailedStatus": {
      "temperature": 25,
      "active": true

    }
  }
]
