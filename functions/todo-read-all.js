/* code from functions/todos-read-all.js */
// import faunadb from 'faunadb'
const faunadb = require('faunadb');
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})

exports.handler = (event, context, callback) => {
  console.log("Function `todo-read-all` invoked")
  const data = JSON.parse(event.body)
  const user_id = data.user_name
  console.log(user_id)
  console.log('data: ', data)
  return client.query(q.Map(q.Paginate(q.Match(q.Index("user_name"),user_id)),q.Lambda(x=>q.Get(x))))
  .then((response) => {
    const todoRefs = response.data
    console.log(response)
    console.log("Todo refs", todoRefs)
    console.log(`${todoRefs.length} todos found`)
    // create new query out of todo refs. http://bit.ly/2LG3MLg
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(todoRefs)
    })
    // then query the refs
  }).catch((error) => {
    console.log("error", error)
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify(error)
    })
  })
}