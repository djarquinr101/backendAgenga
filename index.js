require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Note = require('./models/mongo')
const { default: mongoose } = require('mongoose')

const app = express()

app.use(express.static('dist'))
app.use(express.json())


morgan.token('body', (request) => JSON.stringify(request.body))

app.use(morgan(':method :url :status :response-time ms - :body'))

app.use(cors())

//DATA
let agenda = [
    {
        name: "Arto Hellas",
        phone: "754-458-5258",
        id: "2ca4cf00-f644-40bf-865a-b1a27bd75089"
      },
      {
        name: "Ada Lovelace",
        phone: "754-394-5335",
        id: "62826484-478b-4c2a-9b8a-732696db4335"
      },
      {
        name: "Dan Abramov",
        phone: "754-852-1595",
        id: "7ed5bbaf-1fa5-4fe3-bf5a-24faf88addfb"
      },
      {
        name: "Mary Poppendieck",
        phone: "951-753-8525",
        id: "f5a600f1-8ff0-4e72-8279-eb130b42bc8d"
      },
]

//Fetch all the info
app.get('/api/persons', (request, response) => {
    Note.find({})
    .then(contact => {
      response.json(contact)
    })
})

//Fecth only one person
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  if (id.length != 24) return response.status(404).send({error: "the ID lenght is wrong"})

    Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    }).catch(error =>{
      console.log(error)
      response.status(404).end()
    })
})

//delete only one person
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    if (id.length != 24) return response.status(404).send({error: "the ID lenght is wrong"})
    Note.findByIdAndRemove(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
      response.status(500).send({error: 'the request could not be processed'})
    })
})

//adding one person
app.post('/api/persons', (request, response) => {
    const body = request.body

    //checks that the body is not empty
    if (!body){
     return response.status(400).send({error: "content missing"})
    }

    //checks that the body has a name or number
    if (!body.name || !body.phone) {
      return response.status(400).send({error: "Name or phone number is missing"})
    }

    //checks that the body has a name or number
    if (body.name == "" || body.phone == "") {
      return response.status(400).send({error: "Name or phone number is empty"})
    }

    //checks that the phone number or name is not already stored
    /*
    if(agenda.some((contact) => contact.name === body.name || contact.phone === body.phone)){
      return response.status(400).send({error: "the contact or phone number is already in used please update the existing contact"})
    }
    */
    const contact = new Note(
      {
          name: body.name,
          phone: body.phone,
      }
    ) 

    contact.save()
    .then(result =>{
      console.log('New Contact has been saved')
      response.json(result)
    })

})


//display the info page
app.get('/info', (request, response) => {
    let currentDate = new Date()
    response.send(
        `<p>Phonebook has info for ${agenda.length} people<p>
          <br>          
          <p>${currentDate}<p>
        `
    )
})


//Run the app
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
