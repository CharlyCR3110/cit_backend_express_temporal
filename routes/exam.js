const questionsDummyData = require('./questionsDummyData')

const express = require('express')
const router = express.Router()

router.post('/create-question', (req, res) => {
  const data = req.body
  console.log('POST /create-question - Data recibida:', data)

  if (data === undefined) {
    res.status(400).json({ error: 'No se recibieron datos' })
    return
  }
  questionsDummyData.push(data)
  res.json({ received: data })
})

router.get('/get-all', (req, res) => {
  console.log('GET /get-all - Enviando todas las preguntas')
  res.json(questionsDummyData)
})

router.put('/update', (req, res) => {
  const data = req.body
  console.log('PUT /update - Data recibida:', data)

  if (data === undefined) {
    res.status(400).json({ error: 'No se recibieron datos' })
    return
  }

  const index = questionsDummyData.findIndex((question) => question.code === data.code)
  if (index === -1) {
    res.status(400).json({ error: 'No se encontró la pregunta' })
    return
  }

  questionsDummyData[index] = data
  res.json({ received: data })
})

router.delete('/delete', (req, res) => {
  const code = req.query.code
  console.log('DELETE /delete - Código recibido:', code)

  if (code === undefined) {
    res.status(400).json({ error: 'No se recibió el código' })
    return
  }

  const index = questionsDummyData.findIndex((question) => question.code === code)
  if (index === -1) {
    res.status(400).json({ error: 'No se encontró la pregunta' })
    return
  }

  questionsDummyData.splice(index, 1)
  res.json({ deleted: code })
})

module.exports = router
