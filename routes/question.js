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

    questionsDummyData.push({
      code: questionsDummyData[questionsDummyData.length - 1].code + 1,
      examType,
      question,
      options,
      correctOption,
      images: imageFiles.map((file) => file.filename)
    })

    // Responder al cliente con éxito
    res.status(200).json({ message: 'Pregunta creada exitosamente' })
  } catch (error) {
    console.error('Error al crear la pregunta:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/get-all', (req, res) => {
  const responseData = questionsDummyData.map((question) => {
    return {
      code: question.code,
      examType: question.examType,
      question: question.question
    }
  })

  res.json(responseData)
})

/* endpoint to retrieve the images */
router.get('/get-all-images', async (req, res) => {
  try {
    const imagesPath = questionsDummyData.map((question) => question.images).flat()

    const images = await Promise.all(imagesPath.map(async (imagePath) => {
      const fullImagePath = path.join(__dirname, '../uploads', imagePath)

      // Verificar si el archivo existe
      if (fs.existsSync(fullImagePath)) {
        const image = await fs.promises.readFile(fullImagePath)
        return { name: imagePath, image: image.toString('base64') }
      } else {
        return { name: imagePath, error: 'Image not found' }
      }
    }))

    res.json(images)
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving images', details: error.message })
  }
})

// /delete/${code}
router.delete('/delete/:code', (req, res) => {
  const code = req.params.code
  console.log('DELETE /delete - Código recibido:', code)

  if (code === undefined) {
    res.status(400).json({ error: 'No se recibió el código' })
    console.error('No se recibió el código')
    return
  }

  const index = questionsDummyData.findIndex((question) => question.code === code)
  if (index === -1) {
    res.status(400).json({ error: 'No se encontró la pregunta' })
    console.error('No se encontró la pregunta con el código:', code)
    return
  }

  questionsDummyData.splice(index, 1)
  res.json({ deleted: code })
})

router.get('/search-by-title', (req, res) => {
  const query = req.query.query
  const examType = req.query.examType
  console.log('GET /search-by-title - Query:', query, 'Exam Type:', examType)

  if (query === undefined || examType === undefined) {
    res.status(400).json({ error: 'No se recibió la consulta' })
    console.error('No se recibió la consulta')
    return
  }

  const isExamTypeRequired = examType !== 'both'
  const filteredQuestions = questionsDummyData.filter((question) => {
    const isMatchingQuery = question.question.toLowerCase().includes(query.toLowerCase())
    const isMatchingExamType = !isExamTypeRequired || question.examType === examType
    return isMatchingQuery && isMatchingExamType
  })

  res.json(filteredQuestions)
})

router.get('/search-by-code', (req, res) => {
  const code = req.query.code
  const examType = req.query.examType
  console.log('GET /search-by-code - Code:', code, 'Exam Type:', examType)

  if (code === undefined || examType === undefined) {
    res.status(400).json({ error: 'No se recibió el código' })
    console.error('No se recibió el código')
    return
  }

  if (code === '') {
    res.json(questionsDummyData)
    return
  }

  const isExamTypeRequired = examType !== 'both'
  const foundQuestion = questionsDummyData.filter((question) => {
    const isMatchingCode = question.code === code
    const isMatchingExamType = !isExamTypeRequired || question.examType === examType
    return isMatchingCode && isMatchingExamType
  })

  if (foundQuestion === undefined) {
    res.status(404).json({ error: 'No se encontró la pregunta' })
    console.error('No se encontró la pregunta con el código:', code)
  }

  res.json(foundQuestion)
})

module.exports = router
