const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Title must be a string',
    required_error: 'Title is required'
  }),
  year: z
    .number({
      invalid_type_error: 'Year must be a number',
      required_error: 'Year is required'
    })
    .int()
    .min(1888)
    .max(2077),
  director: z.string({
    invalid_type_error: 'Director must be a string',
    required_error: 'Director is required'
  }),
  duration: z
    .number({
      invalid_type_error: 'Duration must be a number',
      required_error: 'Duration is required'
    })
    .int()
    .positive(),
  rate: z
    .number({
      invalid_type_error: 'Rate must be a number'
    })
    .int()
    .min(0)
    .max(10),
  poster: z.string({}).url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum([
      'Action',
      'Adventure',
      'Comedy',
      'Drama',
      'Horror',
      'Mystery',
      'Thriller',
      'Western',
      'Sci-Fi'
    ])
  )
})

function validateMovie (object) {
  return movieSchema.safeParse(object)
}

function validatePartialMovie (object) {
  return movieSchema.partial().safeParse(object)
}

module.exports = { validateMovie, validatePartialMovie }
