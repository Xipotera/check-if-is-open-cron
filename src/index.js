const {
  isNil, find, isEmpty, size, initial
} = require('lodash')
const parser = require('cron-parser')

const Holidays = require('date-holidays')

const hd = new Holidays()

const dayjs = require('dayjs')
const isoWeek = require('dayjs/plugin/isoWeek')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const dayOfYear = require('dayjs/plugin/dayOfYear')

dayjs.extend(isoWeek)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(dayOfYear)

module.exports = (openingConfig, date = undefined) => {
  const { timeZone } = openingConfig
  // eslint-disable-next-line no-param-reassign
  if (isEmpty(date)) date = dayjs().tz(timeZone).format()

  // Disable specific days
  if (
    Array.isArray(openingConfig.disabledDays) &&
    openingConfig.disabledDays.length > 0
  ) {
    const dateIsDisabled = !!find(
      openingConfig.disabledDays,
      (disabledDate) => {
        let d = dayjs(disabledDate)
        if (size(disabledDate) !== 8) {
          const day = Number(disabledDate.split('-')[0])
          const month = Number(disabledDate.split('-')[1])

          d = dayjs(new Date())
            .date(day)
            .month(month - 1)
            .tz(timeZone)
        }
        return (
          dayjs(date).dayOfYear() === d.dayOfYear() &&
          dayjs(date).year() === d.year()
        )
      }
    )
    if (dateIsDisabled) {
      return false
    }
  }

  // Check public hollydays
  if (!openingConfig.publicHoliday.isOpen) {
    hd.init(openingConfig.publicHoliday.country, openingConfig.publicHoliday.region)
    const isHD = hd.isHoliday(dayjs(date))
    if (
      Array.isArray(isHD) &&
      isHD.length > 0
    ) return false
  }
  if (openingConfig.weekDay) {
    const weekday = dayjs(date).isoWeekday()
    // if there are specific config on days use this
    const weekdayConfig = !isNil(openingConfig.weekDay[weekday])
      ? openingConfig.weekDay[weekday]
      : openingConfig.weekDay.default
    const interval = parser.parseExpression(weekdayConfig)
    const fields = JSON.parse(JSON.stringify(interval.fields)) // Fields is immutable

    if (!isNil(openingConfig.weekDay[weekday])) fields.dayOfWeek = [weekday]
    // back day number

    if (!fields.dayOfWeek.includes(weekday)) return false

    const hour = dayjs(date).tz(timeZone).hour() // back hour
    // use initial to gets all hours excluding the last element
    if (!initial(fields.hour).includes(hour)) return false

    const minute = dayjs(date).tz(timeZone).minute() // back minute
    if (!fields.minute.includes(minute)) return false
  } else return false
  return true
}
