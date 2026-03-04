document.addEventListener('DOMContentLoaded', function () {
    const grid = document.querySelector('.grid')
    const flagsLeft = document.querySelector('#flags-left')
    const result = document.querySelector('#result')
    const width = 10
    let bombAmount = 20
    let squares = []
    let isGameOver = false


    //Create Board
    function createBoard() {
        flagsLeft.innerHTML = bombAmount
        //get random bombs
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width * width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombsArray)
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

        //create squares
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.id = i
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            //normal click
            square.addEventListener('click', function () {
                click(square)
            })

            //ctrl and left click
            square.addEventListener('click', function () {
                //addFlag(square)
            })
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

    function click(square) {
        console.log(square)
        if (isGameOver || square.classList.contains('checked') || square.classList.contains('flag')) return

        if (square.classList.contains('bomb')) {
            gameOver()
        }

        function gameOver() {
            result.innerHTML = 'BOOM! Game Over!'
            isGameOver = true

            //show all the bombs
            squares.forEach(function (square) {
                if (square.classList.contains('bomb')) {
                    square.innerHTML = '💣'
                    square.classList.remove('bomb')
                    square.classList.add('checked')
                }
            })
        }
    }
})