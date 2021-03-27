/* eslint-disable no-unused-vars */
/* code from functions/todos-create.js */
// import faunadb from 'faunadb' /* Import faunaDB sdk */

// Fix for faunadb sdk import
const matchesJson = require('./matches.json')

const faunadb = require('faunadb')

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
exports.handler = async (event, context, callback) => {
  matchesJson.forEach(match => {
    console.log(match)
    const gamesObj = { data: match }
    client.query(q.Create(q.Ref('classes/ipl-games'), gamesObj)).then((resp) => {
      console.log('resp: ', resp)
    })

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify(matchesJson)
    }
  })
}
