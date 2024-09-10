const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

// Importar rutas
const examRoutes = require('./routes/exam')
const configRoutes = require('./routes/config')

// Middleware para parsear JSON y configurar CORS
app.use(express.json())
app.use(cors())

// health check
app.get('/', (req, res) => {
  res.send('¡Hola Mundo!')
})

// rutas separadas por funcionalidad
app.use('/api/exam', examRoutes)
app.use('/api/config', configRoutes)

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})
