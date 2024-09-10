// server.js o app.js
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const questionRoutes = require('./routes/question')
const configRoutes = require('./routes/config')
const port = 3000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// rutas separadas por funcionalidad
app.use('/api/question', questionRoutes)
app.use('/api/config', configRoutes)

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada')
})

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Error interno del servidor')
})

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})
