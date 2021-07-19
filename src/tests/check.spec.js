const opening = {
  timeZone: 'Europe/Paris',
  weekDay: {
    // Open from 10:00 to 11:59
    // and 14:00 to 17:59
    default: '* 10-12,14-18 * * 1-5',
    // Open from 16:00 to 17:59
    1: '* 16-18 * * *'
  },
  holidays: {
    isOpen: true,
    country: 'FR',
    region: null,
    checkHolidaysTypes: ['public']

  }
}

const dayjs = require('dayjs')
const isOpen = require('../index')

const arrayOfDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

for (let day = 0; day < 7; day++) {
  switch (day) {
    case 0:
    case 6:
      test(`Test is Close on ${arrayOfDays[day]}`, () => {
        for (let hour = 0; hour < 24; hour++) {
          const date = dayjs(new Date()).hour(hour).day(day).tz('Europe/Paris')
          expect(isOpen(opening, date)).not.toBe(true)
        }
      })
      break
    case 1:
      test(`Test is ${arrayOfDays[day]}`, () => {
        for (let hour = 0; hour < 24; hour++) {
          const date = dayjs(new Date()).hour(hour).day(day).tz('Europe/Paris')
          if ([16, 17].includes(hour)) {
            expect(isOpen(opening, date)).toBe(true)
          } else {
            expect(isOpen(opening, date)).not.toBe(true)
          }
        }
      })
      break

    default:
      test(`Test is ${arrayOfDays[day]}`, () => {
        for (let hour = 0; hour < 24; hour++) {
          const date = dayjs(new Date()).hour(hour).day(day).tz('Europe/Paris')
          if ([10, 11, 14, 15, 16, 17].includes(hour)) {
            expect(isOpen(opening, date)).toBe(true)
          } else {
            // console.log(`${hour}=>${isOpen(opening, date)}`)
            expect(isOpen(opening, date)).not.toBe(true)
          }
        }
      })
  }
}

test('Test is Mother\'s day 2021 is Open', () => {
  opening.holidays.isOpen = false
  opening.holidays.checkHolidaysTypes = ['public']
  opening.weekDay[7] = '* 16-18 * * *'
  // initialize holidayss for US, Lousiana, New Orleans
  opening.holidays.country = 'US'
  opening.holidays.state = 'la'
  opening.holidays.region = 'no'

  const date = dayjs('20210509').hour(17).tz('Europe/Paris').format()
  expect(isOpen(opening, date)).toBe(true)
})

test('Test is Mother\'s day 2021 is Close', () => {
  opening.holidays.isOpen = false
  opening.holidays.checkHolidaysTypes = ['public', 'observance']
  opening.weekDay[7] = '* 16-18 * * *'
  opening.holidays.country = 'US'
  opening.holidays.state = 'la'
  opening.holidays.region = 'no'
  const date = dayjs('20210509').hour(17).tz('Europe/Paris').format()
  expect(isOpen(opening, date)).toBe(false)
})
