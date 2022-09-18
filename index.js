const express = require('express')
const app = express()

let persons = [
    {
		"id": 1,
		"name": "Arto Hellas",
		"number": "040-123456"
	  },
	  {
		"id": 2,
		"name": "Ada Lovelace",
		"number": "39-44-5323523"
	  },
	  {
		"id": 3,
		"name": "Dan Abramov",
		"number": "12-43-234345"
	  },
	  {
		"id": 4,
		"name": "Mary Poppendieck",
		"number": "39-23-6423122"
	  }
  ]

  app.use(express.json())

  // Get home page
  app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>')
  })

  // Get persons
  app.get('/api/persons', (request, response) => {
	response.json(persons)
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
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)

	response.status(204).end()
  })

  // Add persons
  const generateId = () => {
	return Math.floor(Math.random() * 10000)
  }

  app.post('/api/persons', (request, response) => {
	const body = request.body
	const names = persons.map(name => name.name.toLowerCase())

	if (!body.name || !body.number) {
	  return response.status(400).json({
		error: 'Name or phone number missing'
	  })
	} else if (names.includes(body.name.toLowerCase())) {
		return response.status(400).json({
			error: 'Name must be unique'
		})
	}

	const person = {
	  id: generateId(),
	  name: body.name,
	  number: body.number,
	}

	persons = persons.concat(person)

	response.json(person)
  })

  const PORT = 3001
  app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
  })