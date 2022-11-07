const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')
const speedElement = document.getElementById('speed')
const pauseElement = document.getElementById('pause')

var cnt = 0, sum = 0, tmp = 0, startTime = 0, stopTime = 0, dur = 0, lock = 0
quoteInputElement.addEventListener('input', startTimer)
quoteInputElement.addEventListener('input', () => {
  if (lock == 1) pause()
  const arrayQuote = quoteDisplayElement.querySelectorAll('span')
  const arrayValue = quoteInputElement.value.split('')

  let correct = true
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index]
    if (character == null) {
      characterSpan.classList.remove('correct')
      characterSpan.classList.remove('incorrect')
      correct = false
    } else if (character === characterSpan.innerText) {
      cnt = tmp+index+1;
      characterSpan.classList.add('correct')
      characterSpan.classList.remove('incorrect')
    } else {
      characterSpan.classList.remove('correct')
      characterSpan.classList.add('incorrect')
      correct = false
    }

  })

  if (correct) {
    renderNewQuote()
    tmp = sum
  }
})

async function getRandomQuote() {
  const response = await fetch(RANDOM_QUOTE_API_URL)
  const data = await response.json()
  return data.content
}

async function renderNewQuote() {
  const quote = await getRandomQuote()
  sum += quote.length
  quoteDisplayElement.innerHTML = ''
  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span')
    characterSpan.innerText = character
    quoteDisplayElement.appendChild(characterSpan)
  })
  quoteInputElement.value = null
}

function startTimer() {
  startTime = new Date()
  quoteInputElement.removeEventListener('input', startTimer)
  pauseElement.addEventListener('mouseup', pause)
  timerElement.innerText = "0s"
  speed.innerText = "0\twpm"
  setInterval(() => {
    stopTime = new Date()
    if (lock == 0) {
      timer.innerText = Math.floor((stopTime - startTime + dur) / 1000) + "s"
      speed.innerText = Math.floor((cnt / 5) / ((stopTime - startTime + dur) / 60000)) + "\twpm"
    }
  }, 1000)
}

function pause() {
  lock = (lock+1)%2
  if (lock == 1) dur += (new Date() - startTime)
  if (lock == 0) startTime = new Date()
}

renderNewQuote()
