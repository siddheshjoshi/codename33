const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})
var output = {}

exports.handler = async (event, context, callback) => {
  console.log('Function get-players invoked')
  const input = JSON.parse(event.body)

  let response = []
  try {
    response = await client.query(q.Map(
      q.Paginate(q.Documents(q.Collection('players-in-teams'))),
      q.Lambda(x => q.Get(x))
    ))

    response.data.forEach(d => {
      if (d.data.TeamName === input.body.team) {
        console.log('d is: ', d)
        output = (d)
      }
    })
  } catch (exception) {
    output.error = 'Team does not exist!'
  }

  console.log('output is: ', output)

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify(output.data)
  })
}
