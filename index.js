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
	const id = Number(request.params.id)
	const person = persons.find(person => person.id === id)

	if (person) {
		response.json(person)
		} else {
		response.status(404).end()
	}
})

// Delete persons
app.delete('/api/persons/:id', (request, response) => {
	Person.findById(request.params.id).then(person => {
		response.json(person)
	})
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

  const PORT = process.env.PORT
  app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
  })