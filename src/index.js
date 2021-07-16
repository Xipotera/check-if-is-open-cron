const {
  isNil, find, isEmpty
} = require('lodash')
const parser = require('cron-parser')

const Holidays = require('date-holidays')

const dayjs = require('dayjs')
const isoWeek = require('dayjs/plugin/isoWeek')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const dayOfYear = require('dayjs/plugin/dayOfYear')

dayjs.extend(isoWeek)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(dayOfYear)

function formatRangeHours (weekdayConfig) {
  const splitWeekday = weekdayConfig.split(' ')
  const splitHours = splitWeekday[1]
  const splitRangeHour = splitHours.split(',')
  const test = splitRangeHour.map((rangeHour) => {
    const rangeHourSplit = rangeHour.split('-')
    if (!isNaN(rangeHourSplit[1])) {
      const endhour = Number(rangeHourSplit[1]) - 1
      rangeHourSplit[1] = endhour.toString()
    }
    return rangeHourSplit.join('-')
  })
  splitWeekday[1] = test.join(',')
  return splitWeekday.join(' ')
}

module.exports = (openingConfig, date = undefined) => {
  const { timeZone } = openingConfig
  // eslint-disable-next-line no-param-reassign
  if (isEmpty(date)) date = dayjs().tz(timeZone).format()
  // Check public hollydays
  if (!openingConfig.holiday.isOpen) {
    const hd = new Holidays()
    hd.init({ country: openingConfig.holiday.country, region: openingConfig.holiday.region, state: openingConfig.holiday.state })
    const isHD = hd.isHoliday(dayjs(date))
    if (
      Array.isArray(isHD) &&
      isHD.length > 0
    ) {
      const BreakException = false
      try {
        openingConfig.holiday.checkHolidaysTypes.forEach((holidaysTypes) => {
          if (find(isHD, { type: holidaysTypes })) throw BreakException
        })
      } catch (e) {
        if (e === BreakException) return false
      }
    }
  }
  if (openingConfig.weekDay) {
    const weekday = dayjs(date).isoWeekday()
    // if there are specific config on days use this
    const weekdayConfig = !isNil(openingConfig.weekDay[weekday])
      ? openingConfig.weekDay[weekday]
      : openingConfig.weekDay.default

    const interval = parser.parseExpression(formatRangeHours(weekdayConfig))
    const fields = JSON.parse(JSON.stringify(interval.fields)) // Fields is immutable

    if (!isNil(openingConfig.weekDay[weekday])) fields.dayOfWeek = [weekday]
    // back day number

    if (!fields.dayOfWeek.includes(weekday)) return false

    const hour = dayjs(date).tz(timeZone).hour() // back hour
    // use initial to gets all hours excluding the last element
    if (!fields.hour.includes(hour)) return false

    const minute = dayjs(date).tz(timeZone).minute() // back minute
    if (!fields.minute.includes(minute)) return false
  } else return false
  return true
}
