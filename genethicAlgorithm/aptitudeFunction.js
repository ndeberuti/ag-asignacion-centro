const REPEATED_EMPLOYEES_WEIGHT = -1000;
const FREE_DAYS_PER_EMPLOYEE_WEIGHT = -200;
const MANDATORY_DAY_WEIGHT = 5000;
const PREFERRED_DAY_WEIGHT = 2000;
const CONTINUOUS_EXTRA_DAY_WEIGHT = -30;

function calculateAptitude(calendar, employees) {
  return repeatedEmployeesPerDayScore(calendar)
        + employees.map((employee) => freeDaysAmountPerEmployeeScore(calendar, employee)
            + mandatoryDaysPerEmployeeScore(calendar, employee)
            + preferredDaysPerEmployeeScore(calendar, employee)
            + continuousWorkingDaysScore(calendar, employee)).reduce((a, b) => a + b, 0);
}

function repeatedEmployeesPerDayScore(calendar) {
  const dayWeight = REPEATED_EMPLOYEES_WEIGHT / calendar.days.length;
  return calendar.days.map((day) => {
    const employeesPerDay = [...new Set(day.employees)].length;
    return (employeesPerDay === 4) ? 0 : dayWeight;
  }).reduce((a, b) => a + b, 0);
}

function freeDaysAmountPerEmployeeScore(calendar, employee) {
  const freeDays = getFreeDays(calendar, employee).length;
  return (freeDays === 6) ? 0 : FREE_DAYS_PER_EMPLOYEE_WEIGHT;
}

function mandatoryDaysPerEmployeeScore(calendar, employee) {
  const freeDays = getFreeDays(calendar, employee);
  return employee.mandatoryDays.map((mandatoryDay) => (freeDays.includes(mandatoryDay) ? MANDATORY_DAY_WEIGHT : 0))
    .reduce((a, b) => a + b, 0);
}

function preferredDaysPerEmployeeScore(calendar, employee) {
  const freeDays = getFreeDays(calendar, employee);
  return employee.preferredDays.map((preferredDay) => (freeDays.includes(preferredDay) ? PREFERRED_DAY_WEIGHT : 0)).reduce((a, b) => a + b, 0);
}

function continuousWorkingDaysScore(calendar, employee) {
  const continuousWorkingDays = getContinuousWorkingDays(calendar, employee);
  return continuousWorkingDays
    .map((cantDays) => cantDays - 4)
    .filter((cantDays) => cantDays > 0)
    .reduce((a, b) => a + b, 0) * CONTINUOUS_EXTRA_DAY_WEIGHT;
}

function getContinuousWorkingDays(calendar, employee) {
  const freeDays = getFreeDays(calendar, employee);
  return calendar.days.reduce((accum, day) => {
    if (!freeDays.includes(day)) accum[accum.length - 1]++;
    else accum.push(0);
    return accum;
  }, [0]);
}

function getFreeDays(calendar, employee) {
  return calendar.days.filter((day) => !day.employees.includes(employee)).map((freeDay) => freeDay.number);
}

module.exports = calculateAptitude;
