/* eslint-disable linebreak-style */
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Note = require('./models/mongo')
const errorHandler = require('./errorHandler')
// eslint-disable-next-line no-unused-vars
const { default: mongoose } = require('mongoose')

const app = express()

app.use(express.static('dist'))
app.use(express.json())


morgan.token('body', (request) => JSON.stringify(request.body))

app.use(morgan(':method :url :status :response-time ms - :body'))

app.use(cors())


/////////////////////////GET REQUESTS//////////////////////
app.get('/api/persons', (request, response) => {
  Note.find({})
    .then(contact => {
      response.json(contact)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  if (id.length !== 24) return response.status(404).send({ error: 'the ID lenght is wrong' })

  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    }).catch(error => next(error))
})

//////////////////////DELETE////////////////////////////////
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  if (id.length !== 24) return response.status(404).send({ error: 'the ID lenght is wrong' })
  Note.findByIdAndRemove(id)
    // eslint-disable-next-line no-unused-vars
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

///////////////////POST//////////////////////////////////
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  //checks that the body is not empty
  if (!body)return response.status(400).send({ error: 'content missing' })
  //checks that the body has a name or number
  if (!body.name || !body.phone) return response.status(400).send({ error: 'Name or phone number is missing' })
  //checks that the body has a name or number
  if (body.name === '' || body.phone === '') return response.status(400).send({ error: 'Name or phone number is empty' })


  const contact = new Note(
    {
      name: body.name,
      phone: body.phone,
    }
  )

  contact.save()
    .then(result => {
      console.log('New Contact has been saved')
      response.json(result)
    })
    .catch(error => next(error))
})

//////////////PUT/////////////////////////
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const contact = {
    name: body.name,
    phone: body.phone,
  }

  Note.findByIdAndUpdate(request.params.id, contact, { new:true, runValidators: true })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

///////////////OTHER//////////////////////
app.get('/info', (request, response) => {
  let currentDate = new Date()
  response.send(
    `<p>Phonebook has info for many people<p>
          <br>          
          <p>${currentDate}<p>
        `
  )
})

app.use(errorHandler)

//Run the app
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
