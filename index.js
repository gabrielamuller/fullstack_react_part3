require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

morgan.token('person', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

// Get home page
app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>')
})

// Get persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// Info page
app.get('/info', (request, response) => {
	response.send(
		`<p>Phonebook has info for  ${persons.length}  people </p>
		<p> ${new Date().toString()} </p>`
	)
})

// Single person
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

// Delete persons
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Add persons
app.post('/api/persons', (request, response) => {
	const body = request.body

	if (body.name === undefined) {
		return response.status(400).json({ error: 'content missing' })
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	})

	person.save().then(savedPerson => {
		response.json(savedPerson)
	})
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

  const PORT = process.env.PORT
  app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
  })