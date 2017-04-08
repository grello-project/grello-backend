'use strict'

const express = require('express')
let app = express()
const LE = require('greenlock')
let debugToggle = false
let le

let leStore = require('le-store-certbot').create({
  configDir: '~/letsencrypt/etc',
  debug: debugToggle
})

let leChallenge = require('le-challenge-fs').create({
  webrootPath: '~/letsencrypt/var',
  debug: debugToggle
})

// function leAgree(opts, agreeCb) {
//   //opts
//   agreeCb(null, opts.tosUrl)
// }

le = LE.create({
  server: LE.stagingServerUrl,
  store: leStore,
  challenges: { 'http-01': leChallenge },
  challengeType: 'http-01',
  agreeToTerms: true,
  //, sni: require('le-sni-auto').create({})
  debug: debugToggle
  // log: function (debug) {console.log.apply(console, args)} // handles debug outputs
})

app.use('/', le.middleware())

// Check in-memory cache of certificates for the named domain
le.check({ domains: [ 'be.wattle.io' ] }).then(function (results) {
  if (results) {
    // we already have certificates
    return
  }


  // Register Certificate manually
  le.register({

    domains: ['be.wattle.io'],                               // CHANGE TO YOUR DOMAIN (list for SANS)
    email: 'admin@wattle.io',                                // CHANGE TO YOUR EMAIL
    agreeTos: true,                                          // set to tosUrl string (or true) to pre-approve (and skip agreeToTerms)
    rsaKeySize: 2048,                                         // 2048 or higher
    challengeType: 'http-01',                                 // http-01, tls-sni-01, or dns-01

  }).then(function (results) {

    console.log('success', results)

  }, function (err) {

    // Note: you must either use le.middleware() with express,
    // manually use le.challenges['http-01'].get(opts, domain, key, val, done)
    // or have a webserver running and responding
    // to /.well-known/acme-challenge at `webrootPath`
    console.error('[Error]: node-greenlock/examples/standalone')
    console.error(err.stack)

  })

})

app.use('/', function (req, res) {
  res.end('Hello!')
})

app.listen(80, 443).then(() => {
  console.log('listening on both 80 and 443')
})
