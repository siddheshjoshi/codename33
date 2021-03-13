/* eslint-disable camelcase */
/* code from functions/todos-read-all.js */
// import faunadb from 'faunadb'
// eslint-disable-all

const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})

exports.handler = (event, context, callback) => {
  console.log('Function `get match schedule` invoked')
  // const data = JSON.parse(event.body)
  // const user_id = data.user_name
  // console.log(user_id)
  // console.log('data: ', data)
  /*
  Map(
  Paginate(
    Match(Index("all_depts"))
  ),
  Lambda("X", Get(Var("X")))
  )
  */
  return client.query(q.Map(q.Paginate(q.Match(q.Index('games'))), q.Lambda(x => q.Get(x))))
    .then((response) => {
      console.log(response)
      // create new query out of todo refs. http://bit.ly/2LG3MLg
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response.data[0].data.games)
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
