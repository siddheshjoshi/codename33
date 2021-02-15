const chalk = require('chalk')
var util = require('util')
var exec = require('child_process').exec

/* eslint-disable no-unused-vars */
/* eslint-disable handle-callback-err */
/* eslint-disable node/no-deprecated-api */
function clear () {
  exec('clear', function (error, stdout, stderr) {
    util.puts(stdout)
  })
}
function checkForFaunaKey () {
  if (!process.env.FAUNADB_SECRET) {
    console.log(chalk.yellow('Required FAUNADB_SECRET enviroment variable not found.'))
    console.log(`
                =========================
                You can create fauna DB keys here: https://dashboard.fauna.com/db/keys
                In your terminal run the following command:
                export FAUNADB_SECRET=YourFaunaDBKeyHere
                =========================
            `)

    process.exit(1)
  }
}

checkForFaunaKey()
