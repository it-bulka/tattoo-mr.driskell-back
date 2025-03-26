/**
 * @file Contains shared JSDoc typedefs for the project.
 */

const mongoose = require('mongoose')

/**
 * @typedef {import('mongoose').Types.ObjectId} ObjectId
 */

/**
 * @typedef {'uk' | 'en'} Language
 */

/**
 * @typedef {Object} TattooMachine
 * @property {ObjectId} id - The ID of the tattoo machine.
 * @property {string[]} images - List of image URLs.
 * @property {Language} lang - Language of the translation.
 * @property {number} price - Price in Ukrainian currency.
 * @property {string[]} tags - List of tags.
 */


module.exports = {}
