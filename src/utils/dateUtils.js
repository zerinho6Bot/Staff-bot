/**
 * Date class with many functions to check day/month/year difference.
 * @param {number} date - The date timestamp in milliseconds.
 */
exports.date = class {
  constructor(date) {
    this.date = new Date(date)
    this.givenDate = {
      seconds: this.date.getSeconds(),
      minutes: this.date.getMinutes(),
      hours: this.date.getHours(),
      day: this.date.getDay(),
      month: this.date.getMonth(),
      year: this.date.getFullYear()
    }
    this.jsDate = new Date()
    this.js = {
      seconds: this.jsDate.getSeconds(),
      minutes: this.jsDate.getMinutes(),
      hours: this.jsDate.getHours(),
      day: this.jsDate.getDay(),
      month: this.jsDate.getMonth(),
      year: this.jsDate.getFullYear()
    }
  }

  /**
   * Gets if the year of the given date to the class is older than the actual year.
   * @returns {boolean}
   */
  get isOldYear() {
    return this.js.year > this.givenDate.year
  }

  /**
   * Gets if the month of the given date to the class is older than the actual month.
   * @returns {boolean}
   */
  get isOldMonth() {
    const DifferentYear = this.isOldYear
    const CurrentMonth = this.js.month
    const GivenMonth = this.givenDate.month

    if (DifferentYear || CurrentMonth > GivenMonth) {
      return true
    }

    return false
  }

  /**
   * Gets if the day of the given date to the class is older than the actual day.
   * @returns {boolean}
   */
  get isOldDay() {
    const DifferentMonth = this.isOldMonth
    const CurrentDay = this.js.day
    const GivenDay = this.givenDate.day

    if (DifferentMonth || CurrentDay > GivenDay) {
      return true
    }

    return false
  }

  /**
   * Gets the time difference from the given date timestamp to the actual date timestamp
   * @returns {number} - The difference in milliseconds
   */
  get timeDifference() {
    return this.js.getTime() - this.date.getTime()
  }

  /**
   * Gets a human readable string saying how much time it is since the given date.
   * @returns {string} - Format: "Amount Time", Amount being a number and Time being like "seconds", "minutes"..etc, example: "4 seconds"
   */
  get fromNow() {
    let time = "seconds"

    if ((this.js.minutes - this.givenDate.minutes) > 0) {
      time = "minutes"
    }

    if ((this.js.hours - this.givenDate.hours) > 0) {
      time = "hours"
    }

    if (this.isOldDay) {
      time = "day"
    }

    if (this.isOldMonth) {
      time = "month"
    }

    if (this.isOldYear) {
      time = "year"
    }

    return `${this.js[time] - this.givenDate[time]} ${time}`
  }
}
