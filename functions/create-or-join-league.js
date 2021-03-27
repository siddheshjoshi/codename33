const faunadb = require('faunadb')
const Generator = require('license-key-generator')
const { v4: uuidv4 } = require('uuid')

const options = {
  type: 'random', // default "random"
  length: 8, // default 16
  group: 4, // default 4
  split: '-', // default "-"
  splitStatus: true // default true
}

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

exports.handler = async (event, context, callback) => {
  const input = JSON.parse(event.body)
  var output = {}
  var leagueObj = {}
  if (input && input.code) {
    leagueObj = { data: { id: uuidv4(), user: input.user, code: input.code } }
  } else {
    output.code = await getNewCode()
    leagueObj = { data: { id: uuidv4(), user: input.user, code: output.code } }
    console.log('creating leagueObj: ', leagueObj)
  }
  let response = ''
  try {
    response = await client.query(q.Create(q.Ref('classes/user-leagues'), leagueObj))
    console.log('response: ', response)
    output.isLeagueSuccess = true
  } catch (err) {
    console.log('switching it to false')
    output.isLeagueSuccess = false
  }
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(output)
  }
}

function getNewCode () {
  return new Promise(function (resolve, reject) {
    const code = new Generator(options)
    code.get((error, code) => {
      if (error) reject(error)
      else { resolve(code) }
    })
  })
}
