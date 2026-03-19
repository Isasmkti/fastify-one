require('dotenv').config()
const fastify = require('fastify')({ logger: true })
const fs = require('fs')
const path = require('path')




const PORT = process.env.PORT || 3000;

fastify.get('/', async (req, reply) => {
  return { message: 'Hello I am Fastify',
    name: 'Fastify',
    version: '1.0.0'
   }
})



fastify.listen(PORT, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Server jalan di ${PORT}`)
})
