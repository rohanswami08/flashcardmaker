var card = document.getElementById('card')
var cardTerm = document.getElementById('card-term')
var cardDef = document.getElementById('card-def')
var prevCard = document.getElementById('prev-card')
var nextCard = document.getElementById('next-card')
var currentCardDisplay = document.getElementById('current-card-display')
var startWithDef = document.getElementById('start-with-def')
var randomizeOrder = document.getElementById('randomize-order')
var resetOrder = document.getElementById('reset-order')
var randomizeLabel = document.getElementById('randomize-label')
var hideEditor = document.getElementById('hide-editor')
var editorDiv = document.getElementById('editor')
var deleteCard = document.getElementById('delete-card')
var deleteInput = document.getElementById('delete-input')
var swapButton = document.getElementById('swap-button')
var editorTable = document.getElementById('editor-table')
var editorRows = document.getElementsByClassName('editor-row')
var numCells = document.getElementsByClassName('num-cell')
var termInputs = document.getElementsByClassName('term-input')
var defInputs = document.getElementsByClassName('def-input')
var addCard = document.getElementById('add-card')
var deleteAll = document.getElementById('delete-all')

var startingWithDef = false
var displayingTerm = true
var currentCard = 0
var editorShown = true

// Create localStorage lists if nonexistent, else create rows
if (localStorage.getItem('term-list') == undefined ||
    localStorage.getItem('def-list') == undefined ||
    (localStorage.getItem('term-list') == [] && localStorage.getItem('def-list') == [])) {
        localStorage.setItem('def-list', [])
        localStorage.setItem('term-list', [])
} else {
    createRows()
}
updateCard()

// Function create rows from localStorage
function createRows() {
    for (let i = 0; i < JSON.parse(localStorage.getItem('term-list')).length; i ++) {
        const newRow = document.createElement('tr')
        newRow.classList.add('editor-row')
        editorTable.appendChild(newRow)

        const numCell = document.createElement('td')
        numCell.classList.add('num-cell')
        numCell.innerText = editorRows.length
        newRow.appendChild(numCell)

        const termCell = document.createElement('td')
        newRow.appendChild(termCell)
        const defCell = document.createElement('td')
        newRow.appendChild(defCell)

        const termInput = document.createElement('input')
        termInput.classList.add('term-input')
        termInput.value = JSON.parse(localStorage.getItem('term-list'))[i]
        termCell.appendChild(termInput)

        const defInput = document.createElement('input')
        defInput.classList.add('def-input')
        defInput.value = JSON.parse(localStorage.getItem('def-list'))[i]
        defCell.appendChild(defInput)

        addInputListeners(editorRows.length - 1)
    }
}

// Card click listener
card.addEventListener('click', function() {
    if (displayingTerm) {
        cardTerm.style.display = 'none'
        cardDef.style.display = 'block'
    } else {
        cardTerm.style.display = 'block'
        cardDef.style.display = 'none'
    }
    displayingTerm = !displayingTerm
})

// "Prev", "Next" buttons click listeners
prevCard.addEventListener('click', function() {
    if (currentCard > 0) {
        currentCard -= 1
        updateCard()
    }
})
nextCard.addEventListener('click', function() {
    console.log('hi')
    if (currentCard < editorRows.length - 1) {
        currentCard += 1
        updateCard()
    }
})

// "Start with definition" checkbox listener
startWithDef.addEventListener('click', function() {
    if (startingWithDef) {
        startWithDef.innerText = 'start with definition'
    } else {
        startWithDef.innerText = 'start with term'
    }
    startingWithDef = !startingWithDef
    updateCard()
})

// Randomize order button click listener
randomizeOrder.addEventListener('click', function() {
    randomizeLabel.style.display = 'inline'
    addCard.disabled = true
    deleteCard.disabled = true
    deleteInput.disabled = true
    deleteInput.value = ''
    deleteAll.disabled = true

    let termCopyList = JSON.parse(localStorage.getItem('term-list'))
    let defCopyList = JSON.parse(localStorage.getItem('def-list'))
    for (let i = 0; i < editorRows.length; i ++) {
        let index = randomInt(0, termCopyList.length - 1)
        termInputs[i].value = termCopyList[index]
        defInputs[i].value = defCopyList[index]
        termCopyList.splice(index, 1)
        defCopyList.splice(index, 1)

        termInputs[i].disabled = true
        defInputs[i].disabled = true
    }

    currentCard = 0
    updateCard()
})

// Reset order button click listener
resetOrder.addEventListener('click', function() {
    randomizeLabel.style.display = 'none'
    
    for (let i = 0; i < editorRows.length; i ++) {
        termInputs[i].value = JSON.parse(localStorage.getItem('term-list'))[i]
        defInputs[i].value = JSON.parse(localStorage.getItem('def-list'))[i]

        termInputs[i].disabled = false
        defInputs[i].disabled = false
    }
    
    addCard.disabled = false
    deleteCard.disabled = false
    deleteInput.disabled = false
    deleteAll.disabled = false
    currentCard = 0
    updateCard()
})

// Hide/show editor button click listener
hideEditor.addEventListener('click', function () {
    if (editorShown) {
        editorDiv.style.display = 'none'
        hideEditor.innerText = 'Show editor'
    } else {
        editorDiv.style.display = 'block'
        hideEditor.innerText = 'Hide editor'
    }
    editorShown = !editorShown
})

// Delete button click listener
deleteCard.addEventListener('click', function () {
    editorRows[deleteInput.value - 1].remove()
    setLocalStorage()
    updateNumCells()
    currentCard = 0
    updateCard()
})

// Swap term and def button click listener
swapButton.addEventListener('click', function() {
    for (let i = 0; i < editorRows.length; i ++) {
        let temp = termInputs[i].value
        termInputs[i].value = defInputs[i].value
        defInputs[i].value = temp
    }
    setLocalStorage()
    updateCard()
})

// Function add change listeners to inputs
function addInputListeners(num) {
    termInputs[num].addEventListener('change', function () {
        setLocalStorage()
        updateCard()
    })
    
    defInputs[num].addEventListener('change', function () {
        setLocalStorage()
        updateCard()
    })
}

// "Add card" button click listener
addCard.addEventListener('click', function () {
    const newRow = document.createElement('tr')
    newRow.classList.add('editor-row')
    editorTable.appendChild(newRow)

    const numCell = document.createElement('td')
    numCell.classList.add('num-cell')
    newRow.appendChild(numCell)

    const termCell = document.createElement('td')
    newRow.appendChild(termCell)
    const defCell = document.createElement('td')
    newRow.appendChild(defCell)

    const termInput = document.createElement('input')
    termInput.classList.add('term-input')
    termCell.appendChild(termInput)

    const defInput = document.createElement('input')
    defInput.classList.add('def-input')
    defCell.appendChild(defInput)

    addInputListeners(editorRows.length - 1)
    setLocalStorage()
    updateNumCells()
    updateCard()
})

// Delete all button click listener
deleteAll.addEventListener('click', function () {
    if (editorRows.length > 0) {
        if (confirm('Are you sure you want to delete all of your cards?')) {
            let len = editorRows.length
            for (let i = 0; i < len; i ++) {
                editorRows[0].remove()
            }
            setLocalStorage()
            updateNumCells()
            currentCard = 0
            updateCard()
        }
    }
})

// Function update localStorage lists
function setLocalStorage() {
    // Terms
    localStorage.setItem('term-list', [])
    let tempList = []
    for (let i = 0; i < termInputs.length; i ++) {
        tempList.push(termInputs[i].value)
    }
    localStorage.setItem('term-list', JSON.stringify(tempList))
    
    // Definitions
    localStorage.setItem('def-list', [])
    tempList = []
    for (let i = 0; i < defInputs.length; i ++) {
        tempList.push(defInputs[i].value)
    }
    localStorage.setItem('def-list', JSON.stringify(tempList))
}

// Function update num cells
function updateNumCells() {
    for (let i = 0; i < numCells.length; i ++) {
        numCells[i].innerText = i + 1
    }
}

// Function update card displayed
function updateCard() {
    if (termInputs[currentCard] != undefined) {
        cardTerm.innerText = termInputs[currentCard].value
    } else {
        cardTerm.innerText = ''
    }
    if (defInputs[currentCard] != undefined) {
        cardDef.innerText = defInputs[currentCard].value
    } else {
        cardDef.innerText = ''
    }

    if (startingWithDef) {
        cardTerm.style.display = 'none'
        cardDef.style.display = 'block'
        displayingTerm = false
    } else {
        cardTerm.style.display = 'block'
        cardDef.style.display = 'none'
        displayingTerm = true
    }

    if (editorRows.length == 0) {
        currentCardDisplay.innerText = '0/0'
    } else {
        currentCardDisplay.innerText = `${currentCard + 1}/${editorRows.length}`
    }
}

// Random number generator
function randomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}