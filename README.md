![](https://img.shields.io/npm/v/check-if-is-open-cron) ![](https://img.shields.io/npm/dm/check-if-is-open-cron) [![install size](https://packagephobia.com/badge?p=check-if-is-open-cron)](https://packagephobia.com/result?p=check-if-is-open-cron) ![](https://img.shields.io/github/issues/Xipotera/check-if-is-open-cron) ![](https://img.shields.io/github/issues-closed/Xipotera/check-if-is-open-cron?label=closed%20issues) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
![](https://img.shields.io/github/stars/Xipotera/check-if-is-open-cron?style=social)


# Check If Is Open Cron


### General information

Small script to know if a business/service is open or closed from a date.

### Get started

```npm i check-if-is-open-cron```

Define an object with opening hours like this:

```
const opening = {
  timeZone: "Europe/Paris",
  weekDay: {
    default: "* 10-12,14-18 * * 1-5"
  },
  holidays: {
    isOpen: false,
    country: "FR",
    region: null,
    state: null,
    checkHolidaysTypes: ['public']
  }
};
```

Here is open from Monday to Friday from 1O to 11:59 & 14 to 17:59

To override Monday open hours to 16:00 to 17:59 add this `1: "* 16-18 * * *"`


```
const checkIsOpenCron = require("check-if-is-open-cron");

const opening = {
  timeZone: "Europe/Paris",
  weekDay: {
    default: "* 10-12,14-18 * * 1-5",
    3: "* 16-18 * * *"
  },
  holidays: {
    isOpen: false,
    country: "FR",
    region: null,
    state: null,
    checkHolidaysTypes: ["public"]
  }
};

if (!checkIsOpenCron(opening)) {
  console.log("🛑 Closed 🛑");
} else {
  console.log("🟢 Open 🟢");
}

```


| Parameter | Sub-Parameter | Type | Description | Sample |
| :---: | :--- | :--- | :--- | :--- |
| `timeZone` | | string |  TimeZone definition | `Europe/Paris`
| `weekDay` | |object | Cron open/close [definition][3]
| | `default` | string | Cron to apply by default  | `* 10-12,14-18 * * 1-5` |
| | `0` - `6` | string | Specific Cron for Sunday to Saturday | `* 16-18 * * *` |
| `holidays` | | objet | Based on [date-holidays][4] plugin
| | `isOpen` | boolean | true if holidays does not influence open / close
| | `country`| string | Supported Countries list are on [date-holidays][4] plugin
| | `region`| string | Supported Regions list are on [date-holidays][4] plugin
| | `state`| string | Supported State list are on [date-holidays][4] plugin
| | `checkHolidaysTypes`| string | Supported Types list are on [date-holidays][4] plugin


#### Types of checkHolidaysTypes 
Currently the following type with their meaning are supported. Based on [date-holidays][4] plugin

| Type | Meaning |
| :---: | :--- | 
| public|	public holiday|
| bank|	bank holiday, banks and offices are closed|
| school|	school holiday, schools are closed|
| optional|	majority of people take a day off|
| observance|	optional festivity, no paid day off|


### Cron notation

[Crontab](https://crontab.guru/#*_9-13,14-18_*_*_1-5)

### Dependencies:

[dayjs][1] /
[lodash][2] /
[cron-parser][3] /
[date-holidays][4]

### Run test

```
npm run test
```


## License

[MIT](LICENSE)

[1]:https://www.npmjs.com/package/dayjs
[2]:https://www.npmjs.com/package/lodash
[3]:https://www.npmjs.com/package/cron-parser
[4]:https://www.npmjs.com/package/date-holidays
