/* eslint max-statements: ["error", 15] */

import { yellow, red, blue } from '../lib/colors'

export function getColor(name) {
  switch (name) {
    case 'working':
      return blue
    case 'alerts':
      return yellow
    case 'damaged':
      return red
    default:
      return blue
  }
}

export function hashCode(str = '') {
  // java String#hashCode
  var hash = 0
  for (let index = 0; index < str.length; index++) {
    hash = str.charCodeAt(index) + ((hash << 5) - hash)
  }
  return hash
}

export function intToRGB(int) {
  var color = (int & 0x00ffffff).toString(16).toUpperCase()

  return '00000'.substring(0, 6 - color.length) + color
}

/**
 * Recieves filtered reports of an element
 * @param  {Array} reports Filtered reports
 * @return {Object}        Joined reports
 */
export function substractReportValues(reports = []) {
  const alarms = []
  const sensors = []
  reports.map(report => {
    alarms.push(...report.alarms[0].values)
    sensors.push(...report.sensors[0].values)
  })

  return {
    alarms,
    sensors
  }
}

function getZoneData(zone) {
  return zone.sites
    ? zone.sites.reduce(
        (array, { alarms = [], sensors = [] }) => ({
          alarms: [...array.alarms, ...alarms],
          sensors: [...array.sensors, ...sensors]
        }),
        { alarms: [], sensors: [] }
      )
    : { alarms: [], sensors: [] }
}

function getZoneData(zone) {
  const { alarms = [], sensors = [] } = getZoneData(zone) || {
    alarms: [],
    sensors: []
  }
  return { alarms: [...alarms], sensors: [...sensors] }
}

// Filter reports that belong to zone, subzone or site
/**
 * Returns the reports that belong to an element (zone, subzone or site)
 * @param  {Array} reports Reports to be filtered
 * @param  {Object} element Object to be matched with
 * @return {Array}         Filtered reports
 */
export function getFilteredReports(reports, element) {
  switch (element.type) {
    case 'ZONE':
      return reports.filter(({ zone }) => element._id === zone._id)
    case 'SITE':
      return reports.filter(({ site }) => element._id === site._id)
    default:
      return []
  }
}

export function getData(zone) {
  if (Array.isArray(zone)) {
    // All zones
    return zone.reduce(
      (array, zone) => {
        const zoneData = getZoneData(zone)
        return {
          alarms: [...array.alarms, ...zoneData.alarms],
          sensors: [...array.sensors, ...zoneData.sensors]
        }
      },
      { alarms: [], sensors: [] }
    )
  } else if (zone.subzones) {
    // Complete zone
    return getZoneData(zone)
  } else if (zone.sites) {
    // Subzone
    return getSubzoneData(zone)
  } else if (zone.sensors) {
    // Site
    return { alarms: zone.alarms || [], sensors: zone.sensors || [] }
  }
  return null
}

export function getSensorChart(type) {
  switch (type) {
    case 'TEMPERATURE':
      return [
        {
          name: 'alerts',
          value: 15
        },
        {
          name: 'warnings',
          value: 10
        },
        {
          name: 'normal',
          value: 80
        },
        {
          name: 'warnings',
          value: 5
        },
        {
          name: 'alerts',
          value: 10
        }
      ]
    default:
      return null
  }
}
export function itemAverage(item,thisArray){
  let sum = 0
  let count = 0
  thisArray.map(sensor => {
    if(sensor.key.search(item) != -1 ) {
      sum += sensor.value
      count++
    }
  })
  return sum/count
}

export function itemStatus(item,thisArray,option,max,min){
  let ok = 0
  let warn = 0
  let bad = 0
  let final = []

switch(option){
  case "upscale":
    thisArray.map(sensor => {
      if(sensor.key.search(item) != -1){
        if(sensor.value >= max){
          ok++
        }else if (sensor.value <= min) {
          bad++
        }else{
          warn++
        }
      }
    })
    break;
  case "between":
    thisArray.map(sensor => {
      if(sensor.key.search(item) != -1){
        if(sensor.value <= max && sensor.value >= min){
          ok++
        }else{
          bad++
        }
      }
    })
    break;
}

  ok = (ok%2===0 ? ok/2: (ok-1)/2)
  warn = (warn%2===0 ? warn/2: (warn+1)/2)
  bad = (bad%2===0 ? bad/2: (bad+1)/2)



  return final = [
    { name: 'workings', value: ok },
    { name: 'alerts', value: warn },
    { name: 'damaged', value: bad }
  ]

}

export function getStatus(data) {
  let sum = 0
  let counter = 0
  data.sensors.map(current => {
    if (
      current.key === 'cs1' ||
      current.key === 'cs2' ||
      current.key === 'vs1' ||
      current.key === 'vs2'
    ) {
      sum += current.value
      counter += 1
    }
  })

  if (data) {
    return {
      status: [
        {
          name: 'normal',
          value: data.sensors.length - (data.alarms ? data.alarms.length : 0)
        },
        { name: 'alerts', value: data.alarms ? data.alarms.length : 0 }
      ],
      // percentage: Math.round((1 - ((data.alarms ? data.alarms.length : 0) / (data.sensors ? data.sensors.length : 1))) * 1000) / 10
      percentage: Math.round(sum / counter)
    }
  }
  return { status: [], percentage: 0 }
}

export function getAreaCenter(cordinatesArray = [[], []]) {
  // For rect and poly areas we need to loop through the coordinates
  if (!cordinatesArray) return []
  const xCords = cordinatesArray.reduce((sum, pos) => [...sum, pos[0]], [])
  const yCords = cordinatesArray.reduce((sum, pos) => [...sum, pos[1]], [])
  const minX = Math.min(...xCords)
  const maxX = Math.max(...xCords)
  const minY = Math.min(...yCords)
  const maxY = Math.max(...yCords)

  return [(minX + maxX) / 2, (minY + maxY) / 2]
}
