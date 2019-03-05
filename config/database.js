/*
 * Authentication Database Information
 * ===================================
 *
 * Essentially the simplest file in this project.
 * This points to the local auth database and
 * provides it a secret. The secret was determined
 * using a random number generation technique and
 * an ascii wordlist, otherwise known as "diceware".
 *
 * Authors: Jose Luis, Jorge B. Nunez
 */

module.exports = {
  database: 'mongodb://localhost:27017/remindit',
  secret: 'lllknotscanmainbreadsat'
}
