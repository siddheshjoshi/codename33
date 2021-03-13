/* eslint-disable no-unused-vars */
/* code from functions/todos-create.js */
// import faunadb from 'faunadb' /* Import faunaDB sdk */

// Fix for faunadb sdk import
const faunadb = require('faunadb')
const { v4: uuidv4 } = require('uuid')

/* configure faunaDB Client with our secret */
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
}

/* export our lambda function as named "handler" export */
exports.handler = (event, context, callback) => {
  /* parse the string body into a useable JS object */
  const eventData = JSON.parse(event.body)
  console.log('Function `save-prediction` invoked', eventData)

  console.log('checking if user already predicted for this match')

  let isPrectionAlreadyCreated = false
  let idToBeUpdated = 0

  client.query(q.Map(q.Paginate(q.Match(q.Index('userPredictionForGame'), [eventData.user, eventData.matchSno])), q.Lambda(x => q.Get(x))))
    .then(response => {
      if (response.data && response.data.length > 0) {
        idToBeUpdated = response.data[0].ref.id
        isPrectionAlreadyCreated = true
      } else {
        isPrectionAlreadyCreated = false
      }
    }).catch((error) => {
      console.log('error is: ', error)
    }).finally(() => {
      if (!isPrectionAlreadyCreated) {
        const prediction = { data: eventData }
        prediction.data.id = uuidv4()

        /* construct the fauna query */
        return client.query(q.Create(q.Ref('classes/player-predictions'), prediction))
          .then((response) => {
            console.log('success in CREATED!!!', response)
            /* Success! return the response with statusCode 200 */
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify(response)
            }
          }).catch((error) => {
            console.log('error in CREATED!!!', error)
            /* Error! return the error with statusCode 400 */
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify(error)
            }
          })
      } else {
        return client.query(q.Update(q.Ref(q.Collection('player-predictions'), idToBeUpdated), { data: eventData }))
          .then((response) => {
            return callback(null, {
              statusCode: 200,
              body: JSON.stringify(response)
            })
          }).catch((error) => {
            return callback(null, {
              statusCode: 400,
              body: JSON.stringify(error)
            })
          })
      }
    })
}
