![](https://img.shields.io/npm/v/check-is-open-cron) ![](https://img.shields.io/npm/dm/check-is-open-cron) [![install size](https://packagephobia.com/badge?p=check-is-open-cron)](https://packagephobia.com/result?p=check-is-open-cron) ![](https://img.shields.io/github/issues/Xipotera/check-is-open-cron) ![](https://img.shields.io/github/issues-closed/Xipotera/check-is-open-cron?label=closed%20issues) ![](https://img.shields.io/github/stars/Xipotera/check-is-open-cron?style=social)


# check-is-open-cron


### General information

Small script to know if a business/service is open or closed from a date.

### Get started

```npm i check-is-open-cron```

Define an object with opening hours like this:

```
const opening = {
  timeZone: "Europe/Paris",
  weekDay: {
    default: "* 10-12,14-18 * * 1-5"
  },
  publicHoliday: {
    isOpen: false,
    country: "FR",
    region: null
  }
};
```

Here is open from Monday to Friday from 1O to 11:59 & 14 to 17:59

To override Monday open hours to 16:00 to 17:59 add this `1: "* 16-18 * * *"`


```
const {checkIsOpenCron} = require('check-is-open-cron')

const opening = {
  timeZone: "Europe/Paris",
  weekDay: {
    default: "* 10-12,14-18 * * 1-5",
    1: "* 16-18 * * *"
  },
  publicHoliday: {
    isOpen: false,
    country: "FR",
    region: null
  }
};

if (!checkIsOpenCron(opening)) {
    console.log("🛑 Closed 🛑")
} else {
    console.log("🟢 Open 🟢")
}
```


| Parameter | Sub-Parameter | Type | Description | Sample |
| :---: | :--- | :--- | :--- | :--- |
| `timeZone` | | string |  TimeZone definition | `Europe/Paris`
| `weekDay` | |object | Cron open/close [definition](https://crontab.guru/#*_9-13,14-18_*_*_1-5)
| | `default` | string | Cron to apply by default  | `* 10-12,14-18 * * 1-5` |
| | `0` - `6` | string | Specific Cron for Sunday to Saturday | `* 16-18 * * *` |
| `publicHoliday` | | objet | Based on [date-holidays](https://www.npmjs.com/package/date-holidays) plugin
| | `isOpen` | boolean | true if holidays does not influence open / close
| | `country`| string | Supported Countries list are on [date-holidays](https://www.npmjs.com/package/date-holidays) plugin
| | `region`| string | Supported Regions list are on [date-holidays](https://www.npmjs.com/package/date-holidays) plugin

[CodeSandBox Sample](https://codesandbox.io/s/checkisopencron-sample-v8vw2)

### Cron notation

[Crontab](https://crontab.guru/#*_9-13,14-18_*_*_1-5)

### Dependencies:

[dayjs](https://www.npmjs.com/package/dayjs) /
[lodash](https://www.npmjs.com/package/lodash) /
[cron-parser](https://www.npmjs.com/package/cron-parser) /
[date-holidays](https://www.npmjs.com/package/date-holidays)

### Run test

```
npm run test
```


## License

[MIT](LICENSE)
