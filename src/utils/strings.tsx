 /**
 * Convert from snake to pascal.
 */
  export function toPascalName(str: string) {
  let iphen = str.indexOf('-');
  let normalizedStr = str.substring(0);
  let safetyCount = 0;

  while (iphen > -1 && safetyCount < 100) {
    let letter = normalizedStr.substr(iphen + 1, 1).toUpperCase();

    normalizedStr = normalizedStr.replace(/-\w{1}/i, letter);
    iphen = normalizedStr.indexOf('-');

    safetyCount++;
  }

  return normalizedStr;
}
