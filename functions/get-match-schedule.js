/* eslint-disable camelcase */
/* code from functions/todos-read-all.js */
// import faunadb from 'faunadb'
// eslint-disable-all

const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})
var output = []

exports.handler = (event, context, callback) => {
  console.log('Function `get match schedule` invoked')
  return client.query(q.Map(
    q.Paginate(q.Documents(q.Collection('ipl-games'))),
    q.Lambda(x => q.Get(x))
  ))
    .then((response) => {
      const games = response.data
      const date = getTodaysDate()

      games.forEach(game => {
        if (game.data.Date === date) {
          output.push(game.data)
        }
      })

      if (!output || output.length < 1) {
        output.push({ 'Match Center': 'No Games today' })
      }

      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(output)
      })
    // then query the refs
    }).catch((error) => {
      console.log('error', error)
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error)
      })
    })
}

function getTodaysDate () {
  const months = new Map()
  months.set('4', 'Apr')
  months.set('5', 'May')
  months.set('3', 'Mar')
  var today = new Date()
  var dd = String(today.getDate())
  const formattedMonth = months.get(String(today.getMonth() + 1))
  const date1 = dd + '-' + formattedMonth + '-' + '2021'
  console.log(date1)
  return date1
}
