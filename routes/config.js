const express = require('express')
const router = express.Router()

const currentExamPercentages = {
  academicExam: 30,
  daiExam: 30,
  englishExam: 40
}

router.get('/get-exam-percentages', (req, res) => {
  console.log(req.query)
  res.json(currentExamPercentages)
})

// Ruta para recibir datos
router.post('/save-exam-percentages', (req, res) => {
  const data = req.body
  console.log(data)
  if (data === undefined) {
    res.status(400).json({ error: 'No se recibieron datos' })
    return
  }

  if (data.academicExam === currentExamPercentages.academicExam && data.daiExam === currentExamPercentages.daiExam && data.englishExam === currentExamPercentages.englishExam) {
    res.status(400).json({ error: 'Los valores son iguales a los actuales' })
    return
  }

  // validar que sean diferentes a los valores
  // actuales y que sumen 100
  const total = Object.values(data).reduce((acc, value) => acc + Number(value), 0)
  if (total !== 100) {
    res.status(400).json({ error: 'La suma de los porcentajes debe ser 100' })
    return
  }
  currentExamPercentages.academicExam = data.academicExam
  currentExamPercentages.daiExam = data.daiExam
  currentExamPercentages.englishExam = data.englishExam
  res.json({ received: data })
})

router.post('/save-exam-schedule', (req, res) => {
  const data = req.body
  console.log(data)
  res.json({ received: data })
})

module.exports = router
