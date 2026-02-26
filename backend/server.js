require('dotenv').config()
const fastify = require('fastify')({ logger: true })
const PORT = process.env.PORT || 3000

// 🔹 Dummy database (sementara di memory)
let users = [
  { id: 1, name: 'Andi', age: 20 },
  { id: 2, name: 'Budi', age: 22 },
  { id: 3, name: 'Citra', age: 19 },
  { id: 4, name: 'Dewi', age: 21 }
]


fastify.register(require('@fastify/cors'), {
  origin: true
})

fastify.addHook('onRequest', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')
  reply.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (request.method === 'OPTIONS') {
    return reply.code(204).send()
  }
})



fastify.get('/', async (request, reply) => {
  return { message: 'Selamat datang di API Fastify!' }
})
/**
 * GET semua users
 */
fastify.get('/users', async (request, reply) => {
  return users
})

/**
 * GET user berdasarkan ID
 */
fastify.get('/users/:id', async (request, reply) => {
  const id = Number(request.params.id)

  const user = users.find(u => u.id === id)

  if (!user) {
    return reply.code(404).send({ message: 'User tidak ditemukan' })
  }

  return user
})

/**
 * POST tambah user baru
 */
fastify.post('/users', async (request, reply) => {
  const { name, age } = request.body

  const newUser = {
    id: users.length + 1,
    name,
    age
  }

  users.push(newUser)

  return reply.code(201).send(newUser)
})

const start = async () => {
  try {
    return fastify.listen({ port: PORT })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
