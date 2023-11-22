/**
 * Validates a month string in the format YYYY-MM from 2000-01 to the current month
 */
export function validateMonth(month: string) {
  const [year, _month] = month.split('-');
  const error = new Error(
    'month must be in the format YYYY-MM from 2000-01 to the current month',
  );

  if (year.length !== 4 || _month.length !== 2) {
    throw error;
  }

  const yearNum = Number(year);
  const monthNum = Number(_month);

  if (isNaN(yearNum) || isNaN(monthNum)) {
    throw error;
  }

  const currentYear = new Date().getFullYear();
  if (yearNum < 2000 || yearNum > currentYear) {
    throw error;
  }

  if (monthNum < 1 || monthNum > 12) {
    throw error;
  }

  if (yearNum === currentYear && monthNum > new Date().getMonth() + 1) {
    throw error;
  }
}
