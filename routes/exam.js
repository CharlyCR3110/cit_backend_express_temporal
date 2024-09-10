const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const questionsDummyData = require('./questionsDummyData')

// Configurar multer para almacenar los archivos en una carpeta llamada 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

// Endpoint para manejar la creación de preguntas
router.post('/create-question', upload.array('images'), (req, res) => {
  try {
    const { examType, question, options, correctOption } = req.body
    const imageFiles = req.files // `req.files` contiene los archivos subidos

    // Validar que se recibieron los campos obligatorios
    if (!examType || !question) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' })
    }

    // Procesar la pregunta y los archivos (aquí puedes guardar en la base de datos)
    console.log('Exam Type:', examType)
    console.log('Question:', question)
    console.log('Options:', options)
    console.log('Correct Option:', correctOption)
    console.log('Uploaded Files:', imageFiles)

    // Responder al cliente con éxito
    res.status(200).json({ message: 'Pregunta creada exitosamente' })
  } catch (error) {
    console.error('Error al crear la pregunta:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/get-all', (req, res) => {
  console.log('GET /get-all - Enviando todas las preguntas')
  res.json(questionsDummyData)
})

module.exports = router
