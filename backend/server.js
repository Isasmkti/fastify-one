require('dotenv').config()
const fastify = require('fastify')({ logger: true })
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3000



// pastikan folder uploads ada
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

fastify.register(require('@fastify/cors'), {
  origin: true
})

fastify.register(require('@fastify/multipart'), {
  limits: {
    fileSize: 5 * 1024 * 1024 // max 5MB
  }
})


fastify.get('/', async (req, reply) => {
  try {
      return {
    message: 'Hello Backend I am Fastify',
    name: 'Fastify',
    version: '1.0.0'
  }
  } catch (error) {
    console.error('Error fetching root route:', error)
    reply.status(500).send({ message: 'Internal server error' })
  }

})

fastify.get('/products', async (req, reply) => {
  const products = [
    {name: 'Product 1', price: 100},
    {name: 'Product 2', price: 200},
    {name: 'Product 3', price: 300}
  ]

  try {
    if (products.length === 0) return { message: 'No products found', products: [] }


    /* if (products.length > 0) return { message: 'Product is available', products }*/

    console.log(products)
    return { products }
  } catch (err) {
    console.error('Error fetching products:', err)
    reply.status(500).send({ message: 'Internal server error' })
  }

})




const { pipeline } = require('stream/promises')

fastify.post('/upload', async (req, reply) => {
  const parts = req.parts()
  const uploadedFiles = []

  for await (const part of parts) {
    if (!part.file) continue

    if (uploadedFiles.length >= 5) break

    if (!part.mimetype.startsWith('image/')) continue

    const filename = Date.now() + '-' + part.filename
    const filepath = path.join(uploadDir, filename)

    await pipeline(part.file, fs.createWriteStream(filepath))

    uploadedFiles.push({
      filename,
      mimetype: part.mimetype
    })
  }

  return {
    message: 'Upload sukses',
    total: uploadedFiles.length,
    files: uploadedFiles
  }
})


// ✅ listen harus terakhir
const start = async () => {
  try {
    await fastify.listen({ port: PORT })
    console.log(`Server jalan di ${PORT}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()

