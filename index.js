require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('data', (request, response) => {
  if (Object.values(request.body).length > 0) {
    return JSON.stringify(request.body)
  }
  return ' '
})

app.use(express.json())
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :data'
))
app.use(cors())
app.use(express.static('build'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]

app.get('/', (request, response) => {
  response.send(
    '<p>This is a simple JSON server for a phonebook. See list of persons '
    + 'in the phonebook <a href="/api/persons">here</a>.</p>'
  )
})

app.get('/info', (request, response) => {
  const numOfPersons = persons.length
  const date = new Date()
  response.send(
    `<p>Phonebook contains information about ${numOfPersons} persons</p>\n`
    + `<p>${date}</p>`
  )
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({error: 'name missing'})
  }
  if (!body.number) {
    return response.status(400).json({error: 'number missing'})
  }

  const found = persons.find(person => person.name === body.name)
  if (found) {
    return response.status(400).json({error: 'name must be unique'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.round(Math.random()*(10**12))
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
