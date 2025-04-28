/**
 * Escapes all special characters in a string so that it can be used in a regular expression.
 * This function ensures safe usage of user input in regular expressions, preventing alteration of their behavior.
 *
 * @param {string} string - The input string that needs to be processed.
 * @returns {string} Returns a new string where all special characters are escaped.
 *
 * @example
 * const escapedQuery = escapeRegex("a.b");
 * console.log(escapedQuery);  // "a\.b"
 */

function escapeRegex(string) {
  return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
}

module.exports = {
  escapeRegex
}
