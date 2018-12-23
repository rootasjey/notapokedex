/**
 * Return a color according to the number passed.
 * @param percentage Number to get color from.
 */
export function getBgColor(percentage: number) {
  if (percentage > 99) {
    return '#44bd32';
  }

  if (percentage > 70) {
    return '#4cd137';
  }

  if (percentage > 50) {
    return '#e1b12c';
  }

  if (percentage > 30) {
    return '#fbc531';
  }

  if (percentage > 20) {
    return '#e84118';
  }

  if (percentage < 20) {
    return '#c23616';
  }

  return '#353b48';
}
