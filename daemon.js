// ===========================================================================
// ============================= DEFINING CONSTS =============================
// ===========================================================================
const _                 = require('lodash')                   // for common methods and functions
const yargs             = require('yargs')                    // for cli args (dev)
const fs                = require('fs')                       // for filesystem actions
const timestamp         = require('time-stamp')               // for simple timestamp usage
const every             = require('schedule').every           // for scheduling the daemon
const god               = require('./god.js')                 // contains the main daemon code / run()
const c                 = require('./config.json')            // contains credentials, worlds array etc.
var   schedule          = require('./schedule.json')          // Savefile for scheduling

// ===================================
// INITIAL LOGGING
// ===================================
console.log(`[${timestamp('DD.MM.YYYY-HH:mm:ss')}] GrepoGod Daemon started`)
console.log(`[${timestamp('DD.MM.YYYY-HH:mm:ss')}] Specified worlds: ${c.worlds}`)

// ===========================================================================
// ================================ DAEMON CODE ==============================
// ===========================================================================

switch(yargs.argv._[0]) {                                                                                       // switch statement for dev mode
  case 'dev':                                                                                                   // if dev is set do...
    god.run('de88')                                                                                             // run with de88
    god.run('de89')                                                                                             // and de89
    break                                                                                                       // break after test
  default:                                                                                                      // otherwise start daemon...
    every('120s').do(() => {                                                                                    // every 2 minutes check schedule timers
      _.forEach(c.worlds, function (world) {                                                                    // for each definied world do...
        var timestamp = schedule.timestamp[world]                                                               // save schedule.timestamp in variable
        var timeout = Date.now() - timestamp                                                                    // get last timeout duration
        switch(true) {                                                                                          // switch(true) for operator usage below
          case (3600000 > timeout):                                                                             // if timeout is less than 1 hour do...
            break                                                                                               // break case
          case (3600000 <= timeout && timeout < 10800000):                                                      // if timeout is more than 1 hour and less than 3 hours do...
            god.run(world)                                                                                      // execute main code
            break                                                                                               // break case
          case (10800000 <= timeout && timeout < 21600000):                                                     // if timeout is more than 3 and less than 6 hours do...
            console.log(`[WAR] Last loop for ${world} was more than 3 hours ago (${Number(((Date.now() - timestamp)/60/1000).toFixed(2))} mins).`) // Logging for cli
            god.run(world)                                                                                      // execute main code
            break                                                                                               // break case                                                                                               // break case
          case (21600000 <= timeout):                                                                           // if timeout is more than 6 hours do...
            console.log(`[WAR] Last loop for ${world} was more than 6 hours ago (${Number(((Date.now() - timestamp)/60/1000).toFixed(2))} mins). Think about dropping Database...`) // Logging for cli
            god.run(world)                                                                                      // execute main code
            break                                                                                               // break case
          default:                                                                                              // else do...
            console.log(`[ERR] Default Switch Statement triggered for ${world}.`)                               // Logging for cli
            god.run(world)                                                                                      // execute main code
            break                                                                                               // break case
        }
      })
    })
}
