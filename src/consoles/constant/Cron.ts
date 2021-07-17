export enum CronTime {
  EveryHour = '0 0 * * * *',
  EveryDay = '0 0 16 * * *',
  EveryWednesday = '0 0 16 * * 3',
  EverySecond = '* * * * * *',
  EveryMin = '* * * * *',
}

export enum CronSignature {
  EveryHour = 'everyHourJobs',
  EveryDay = 'everyDayJobs',
  EveryWednesday = 'everyWednesdayJobs',
  EverySecond = 'everySecondJobs',
  EveryMin = 'everyMinuteJobs',
}
