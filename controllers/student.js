/**
*  Developer controller
*  Handles requests related to developer resources.
*
* 
* @author Suma Soma <S537239@nwmissouri.edu>
*
*/
const express = require('express')
const api = express.Router()
const StudentModal = require('../models/student.js')
const LOG = require('../utils/logger.js')
const notfoundstring = 'Could not find student with id='

// RESPOND WITH JSON DATA  --------------------------------------------

// GET all JSON
api.get('/findall', (req, res) => {
  LOG.info(`Handling /findall ${req}`)
  StudentModal.find({}, (err, data) => {
    if (err) { return res.end('Error finding all') }
    res.json(data)
  })
})

// GET one JSON by ID
api.get('/findone/:id', (req, res) => {
  LOG.info(`Handling /findone ${req}`)
  const id = parseInt(req.params.id)
  StudentModal.find({ _id: id }, (err, results) => {
    if (err) { return res.end(`notfoundstring ${id}`) }
    res.json(results[0])
  })
})

// RESPOND WITH VIEWS  --------------------------------------------

// GET to this controller base URI (the default)
api.get('/', (req, res) => {
  LOG.info(`Handling GET / ${req}`)
  StudentModal.find({}, (err, data) => {
    if (err) { return res.end('Error') }
    res.locals.students = data
    res.render('student/index.ejs')
  })
})

// GET create
api.get('/create', (req, res) => {
  LOG.info(`Handling GET /create ${req}`)
  StudentModal.find({}, (err, data) => {
    if (err) { return res.end('error on create') }
    res.locals.students = data
    res.locals.student = new StudentModal()

    res.render('student/create')
  })
})

// GET /delete/:id
api.get('/delete/:id', (req, res) => {
  LOG.info(`Handling GET /delete/:id ${req}`)
  const id = parseInt(req.params.id)
  StudentModal.find({ _id: id }, (err, results) => {
    if (err) { return res.end(notfoundstring) }
    LOG.info(`RETURNING VIEW FOR ${JSON.stringify(results)}`)
    res.locals.student = results[0]
    return res.render('student/delete')
  })
})

// GET /details/:id
api.get('/details/:id', (req, res) => {
  LOG.info(`Handling GET /details/:id ${req}`)
  const id = parseInt(req.params.id)
  StudentModal.find({ _id: id }, (err, results) => {
    if (err) { return res.end(notfoundstring) }
    LOG.info(`RETURNING VIEW FOR ${JSON.stringify(results)}`)
    res.locals.student = results[0]
    return res.render('student/details')
  })
})

// GET one
api.get('/edit/:id', (req, res) => {
  LOG.info(`Handling GET /edit/:id ${req}`)
  const id = parseInt(req.params.id)
  StudentModal.find({ _id: id }, (err, results) => {
    if (err) { return res.end(notfoundstring) }
    LOG.info(`RETURNING VIEW FOR${JSON.stringify(results)}`)
    res.locals.student = results[0]
    return res.render('student/edit')
  })
})

// RESPOND WITH DATA MODIFICATIONS  -------------------------------

// POST new
api.post('/save', (req, res) => {
  console.info(`Handling POST ${req}`)
  console.debug(JSON.stringify(req.body))
  const item = new StudentModal()
  
  console.info(`NEW ID ${req.body._id}`)
  item._id = parseInt(req.body._id)
  item.given = req.body.given
  item.family = req.body.family
  item.email = req.body.email
  item.GPA = req.body.GPA
  item.Website = req.body.Website
  item.Github = req.body.Github
  item.SectionID = req.body.SectionID
  // console.log(item);
  // res.send(`THIS FUNCTION WILL SAVE A NEW student ${JSON.stringify(item)}`)
  item.save((err) => {
    console.log(err);
    if (err) { return res.end('ERROR: item could not be saved') }
    LOG.info(`SAVING NEW item ${JSON.stringify(item)}`)
    return res.redirect('/student')
  })
})

// POST update with id
api.post('/save/:id', (req, res) => {
  LOG.info(`Handling SAVE request ${req}`)
  const id = parseInt(req.params.id)
  LOG.info(`Handling SAVING ID=${id}`)
  StudentModal.updateOne({ _id: id },
    { // use mongoose field update operator $set
      $set: {
        given: req.body.given,
        family: req.body.family,
        email: req.body.email,
        GPA: req.body.GPA,
        Website: req.body.Website,
        Github: req.body.Github,
        SectionID: req.body.SectionID
      }
    },
    (err, item) => {
      if (err) { return res.end(notfoundstring) }
      LOG.info(`ORIGINAL VALUES ${JSON.stringify(item)}`)
      LOG.info(`UPDATED VALUES: ${JSON.stringify(req.body)}`)
      LOG.info(`SAVING UPDATED item ${JSON.stringify(item)}`)
      return res.redirect('/student')
    })
})

// DELETE id (uses HTML5 form method POST)
api.post('/delete/:id', (req, res) => {
  LOG.info(`Handling DELETE request ${req}`)
  const id = parseInt(req.params.id)
  LOG.info(`Handling REMOVING ID=${id}`)
  StudentModal.remove({ _id: id }).setOptions({ single: true }).exec((err, deleted) => {
    if (err) { return res.end(notfoundstring) }
    console.log(`Permanently deleted item ${JSON.stringify(deleted)}`)
    return res.redirect('/student')
  })
})


module.exports = api