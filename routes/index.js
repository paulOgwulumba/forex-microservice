/* eslint-disable quotes */
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const express = require('express')
const router = express.Router()
const path = require('path')
const { validateCurrency, makeBaseCurrency, validateDate } = require('../utils/currencies')

// Configure environment variable access
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

// Get API key for third party Forex API Service
const APIKEY = process.env.API_KEY

//  set up database
const { Client } = require('../utils/utils')

// Create database object
let currencyDB

// Database connection status
let isDatabaseConnected = false

// connect to database
Client.connect(err => {
  if (err) {
    console.error('Could not connect to MongoDB database! Router will proceed with handling requests anyway.')
  } else {
    console.log('Connected to MongoDB database successfully')
    isDatabaseConnected = true

    // stores currency information gotten from third-party APIs
    currencyDB = Client.db().collection('student_base')
  }
})

/**
 * Get and return the current rates for currency whose currency code is specified in the request URL
 */
router.get('/forex/latest/currencies/:currencyCode', async (req, res, next) => {
  // get the currencyCode specified in request url as base currency
  const currencyCode = req.params.currencyCode.toUpperCase() || 'USD'

  // validate currencyCode to be sure it exists
  if (!validateCurrency(currencyCode)) {
    res.status(404).send({ message: `Base currency code:${currencyCode} does not exist in registry.` })
    return
  }

  // Make call to Third-party forex api
  fetch(`http://api.exchangeratesapi.io/v1/latest?access_key=${APIKEY}`)
    .then(response => response.json())
    .then(data => {
      const obj = {
        base: currencyCode,
        date: data.date,
        rates: makeBaseCurrency(currencyCode, data.base, data.rates)
      }
      res.status(200).send(obj)
    })
    .catch(err => {
      res.status(500).send({ status: err })
    })
})

/**
 * Get and return the rates for currency whose currency code is specified in the request URL
 * for the particular date specified in the request URL
 */
router.get('/forex/latest/currencies/:currencyCode/date/:date', (req, res, next) => {
  // get the date specified in request url
  const date = req.params.date
  // validate date
  if (!validateDate(date)) {
    res.status(400).send({ message: 'Invalid date requested. Please enter correct date format: YYYY:MM:DD and make sure the date is not in the future.' })
    return
  }

  // get the currencyCode specified in request url
  const currencyCode = req.params.currencyCode.toUpperCase() || 'USD'

  // validate currencyCode to be sure it exists
  if (!validateCurrency(currencyCode)) {
    res.status(404).send({ message: `Base currency code:${currencyCode} does not exist in registry.` })
    return
  }

  // Make call to Third-party forex api
  fetch(`http://api.exchangeratesapi.io/v1/${date}?access_key=${APIKEY}`)
    .then(response => response.json())
    .then(data => {
      const obj = {
        base: currencyCode,
        date: data.date,
        rates: makeBaseCurrency(currencyCode, data.base, data.rates)
      }
      res.status(200).send(obj)
    })
    .catch(err => {
      res.status(500).send({ status: err })
    })
})

/**
 * Get and return the current rates for different currencies whose currency codes are specified in the request URL
 */
router.get('/forex/latest/currencies', (req, res, next) => {
  const query = req.query

  // set the base currency to USD
  const currencyCode = 'USD'

  // check for queries

  // variable to hold array of cleaned up versions of currency codes specified in query if any
  let finalList = []
  let invalidList = []

  if (query.list) {
    // get array of currency codes listed in query
    const list = query.list.split(',').map(element => {
      element = element.trim()
      return element.toUpperCase()
    })

    // remove currency codes that don't belong to any known currencies and add the rest to final list
    finalList = list.filter(element => validateCurrency(element))

    // keep track of invalid currencies requested
    invalidList = list.filter(element => !validateCurrency(element))
  }

  // if a valid list of currency codes was specified in query but does not include the new base currency, add base currency to the list
  // so its price would be retrieved too.
  if (finalList.length > 0 && !finalList.includes(currencyCode)) {
    finalList.push(currencyCode)
  }

  // generate query string to be passed tp third-party API
  const newQuery = finalList.length > 0 ? `&symbols=${finalList.join(',')}` : ''

  // If only invlaid currency codes were provided in query string, send an error response
  if (newQuery === '' && invalidList.length > 0) {
    res.status(400).send({ message: `Invalid Currency Codes provided: ${invalidList.join(', ')}. Please enter valid currency codes` })
    return
  }

  // Make call to Third-party forex api
  fetch(`http://api.exchangeratesapi.io/v1/latest?access_key=${APIKEY}${newQuery}`)
    .then(response => response.json())
    .then(data => {
      const obj = {
        base: currencyCode,
        date: data.date,
        rates: makeBaseCurrency(currencyCode, data.base, data.rates)
      }

      // Attach invalid currency codes to an error message attached to them to notify the API user
      for (const invalid of invalidList) {
        obj.rates[invalid] = 'Error! This currency does not exist.'
      }

      res.status(200).send(obj)
    })
    .catch(err => {
      res.status(500).send({ status: err })
    })
})

module.exports = router
