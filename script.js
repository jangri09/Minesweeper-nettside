document.addEventListener('DOMContentLoaded', function () {
    const grid = document.querySelector('.grid')
    const flagsLeft = document.querySelector('#flags-left')
    const width = 10
    let bombAmount = 20
    let squares = []


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
    }
    createBoard()

    function click(square) {
        console.log(square)
    }
})