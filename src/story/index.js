import YarnBound from 'yarn-bound'

class Timer {
    constructor() {
      this.startedAt = Date.now()
    }

    start(start) {
      if (start) {
          timer.startedAt = start
      } else {
          timer.startedAt = Date.now()
      }
    }

    delta(now){
      now - startedAt
    } 
}

function render(element, dialogue) {
  element.childNodes.forEach(child => {
    element.removeChild(child)
  })

  if (dialogue) {
    const text = document.createElement('p')
    text.innerText = dialogue
  
    element.appendChild(text)
  }
}
  
function observeRunner(runner, callback) {
    const advance = runner.advance.bind(runner)
    runner.advance = (count) => {
      callback('advance', [count], runner)
      return advance(count)
    }
}

export function makeRunner(renderElement, eventElement, data) {
    const runner = new YarnBound({
      dialogue: data,
      startAt: 'AnotherMonday',
      functions: {
        startTimer: new Timer().start
      }
    })
  
    render(renderElement, runner.currentResult.text)
  
    observeRunner(runner, (eventName, eventArgs, runnerInstance) => {
      if (eventName === 'advance') {
        render(renderElement, runnerInstance.currentResult.text)
      }
    })
  
    ;(eventElement ? eventElement : renderElement).addEventListener('click', () => {
      if (runner.currentResult) runner.advance()
    })
}
  