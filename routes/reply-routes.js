'use strict'

const request = require('superagent')

const Task = require('../model/task')
const Category = require('../model/category')
const Document = require('../model/document')
const bearerAuth = require('../lib/bearer-auth-middleware')
const refreshToken = require('../lib/refresh-token-middleware')

const Router = require('express').Router
const router = module.exports = new Router()
