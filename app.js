const express = require('express')
const movies = require('./movies.json')
const cors = require('cors')
const crypto = require('crypto')
const { validateMovie, validatePartialMovie } = require('./MovieSchema')
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'DELETE', 'PATCH']
}

// Utiliza puerto que le viene por variable de entorno o el 3000 si no viene nada
const PORT = process.env.PORT ?? 3000

const app = express()

app.use(express.json())

app.disable('x-powered-by')

app.use(cors(corsOptions));

app.listen(PORT, () => {
  console.log('Server listening on http://localhost:' + PORT)
})

// métodos normales: GET/HEAD/POST
// métodos con preflight: PUT/DELETE/PATCH

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' })
})

app.get('/movies', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter((movies) =>
      movies.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    )
    res.json(filteredMovies)
  } else {
    res.json(movies)
  }
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find((movie) => movie.id === id)
  if (movie) {
    res.json(movie)
  } else {
    res.status(404).json({ message: 'Movie not found' })
  }
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  // Lanzamos error de unprocessable entity si el resultado de la validación es un error
  if (result.error) {
    return res.status(422).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  movies.push(newMovie)
  res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (result.error) {
    return res.status(422).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})
