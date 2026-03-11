document.addEventListener('DOMContentLoaded', function () {
    const grid = document.querySelector('.grid')
    const flagsLeft = document.querySelector('#flags-left')
    const result = document.querySelector('#result')
    const resetButton = document.querySelector('#reset')
    const width = 10
    let bombAmount = 20
    let squares = []
    let isGameOver = false
    let flags = 0
    //laget av Ai
    let firstClick = true


    //Create Board (no bombs yet - placed on first click)
    function createBoard() {
        flagsLeft.innerHTML = bombAmount
        firstClick = true

        //create squares (all valid for now)
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.id = i
            square.classList.add('valid')
            grid.appendChild(square)
            squares.push(square)

            //normal click
            square.addEventListener('click', function () {
                click(square)
            })

            //ctrl and left click
            square.addEventListener('contextmenu', function (e) {
                e.preventDefault()
                addFlag(square)
            })
        }
    }

    //Place bombs after first click, avoiding the clicked square and its neighbours
    function placeBombs(safeSquare) {
        const safeId = parseInt(safeSquare.id)
        const isLeftEdge = (safeId % width === 0)
        const isRightEdge = (safeId % width === width - 1)

        //collect safe IDs: the clicked square + all its neighbours
        const safeIds = new Set([
            safeId,
            !isLeftEdge ? safeId - 1 : null,           // venstre
            !isRightEdge ? safeId + 1 : null,          // høyre
            safeId - width,                             // over
            safeId + width,                             // under
            !isLeftEdge ? safeId - width - 1 : null,   // øvre venstre
            !isRightEdge ? safeId - width + 1 : null,  // øvre høyre
            !isLeftEdge ? safeId + width - 1 : null,   // nedre venstre
            !isRightEdge ? safeId + width + 1 : null,  // nedre høyre
        ].filter(id => id !== null && id >= 0 && id < width * width))

        const available = squares.filter(s => !safeIds.has(parseInt(s.id)))
        const shuffled = available.sort(() => Math.random() - 0.5)

        for (let i = 0; i < bombAmount; i++) {
            shuffled[i].classList.remove('valid')
            shuffled[i].classList.add('bomb')
        }

        //add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width - 1)

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++
                if (i > 10 && squares[i - width].classList.contains('bomb')) total++
                if (i > 11 && !isLeftEdge && squares[i - width - 1].classList.contains('bomb')) total++
                if (i < 99 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++
                if (i < 89 && squares[i + width].classList.contains('bomb')) total++
                squares[i].setAttribute('data', total)
            }
        }
    }
    createBoard()

    //add flags
    function addFlag(square) {
        if (isGameOver) return
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                flags++
                square.innerHTML = '🚩'
                flagsLeft.innerHTML = bombAmount - flags
                checkForWin()
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags--
                flagsLeft.innerHTML = bombAmount - flags
            }
        }
    }

    function click(square) {
        console.log(square)
        if (isGameOver || square.classList.contains('checked') || square.classList.contains('flag')) return

        //place bombs on first click, guaranteeing this square is safe
        if (firstClick) {
            placeBombs(square)
            firstClick = false
        }

        if (square.classList.contains('bomb')) {
            gameOver()
        } else {
            let total = square.getAttribute('data')
            if (total != 0) {
                square.classList.add('checked')
                if (total == 1) square.classList.add('one')
                if (total == 2) square.classList.add('two')
                if (total == 3) square.classList.add('three')
                if (total == 4) square.classList.add('four')
                square.innerHTML = total
                return
            }
            checkSquare(square)
        }
        square.classList.add('checked')

        //check neighbouring squares once square is clicked
        function checkSquare(square) {
            const currentId = square.id
            const isLeftEdge = (square.id % width === 0)
            const isRightEdge = (square.id % width === width - 1)

            setTimeout(function () {
                if (currentId > 0 && !isLeftEdge) {
                    const newId = parseInt(currentId) - 1
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId > 9 && !isRightEdge) {
                    const newId = parseInt(currentId) + 1 - width
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId > 10) {
                    const newId = parseInt(currentId) - width
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId > 11 && !isLeftEdge) {
                    const newId = parseInt(currentId) - 1 - width
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId < 98 && !isRightEdge) {
                    const newId = parseInt(currentId) + 1
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId < 90 && !isLeftEdge) {
                    const newId = parseInt(currentId) - 1 + width
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId < 88 && !isRightEdge) {
                    const newId = parseInt(currentId) + 1 + width
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId < 89) {
                    const newId = parseInt(currentId) + width
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
            }, 15)
        }
    }

    function checkForWin() {
        let matches = 0
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++
            }
        }
        if (matches === bombAmount) {
            result.innerHTML = 'You win!'
            isGameOver = true
            document.querySelector('#reset').style.display = 'block'
        }
    }

    function gameOver() {
        result.innerHTML = 'BOOM! Game Over!'
        isGameOver = true
        document.querySelector('#reset').style.display = 'block'

        //show all the bombs
        squares.forEach(function (square) {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣'
                square.classList.remove('bomb')
                square.classList.add('checked')
            }
        })
    }

    //try again
    function resetBoard() {
        document.querySelector('#reset').style.display = 'none'
        grid.innerHTML = ''
        squares = []
        flags = 0
        isGameOver = false
        firstClick = true
        result.innerHTML = ''
        createBoard()
    }

    resetButton.addEventListener('click', resetBoard)
})
