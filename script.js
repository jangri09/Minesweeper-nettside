document.addEventListener('DOMContentLoaded', function () {
    const grid = document.querySelector('.grid')
    const width = 10

    console.log(grid);

    //Create Board
    function createBoard() {



        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.id = i
            grid.appendChild(square)
        }
    }
    createBoard()
})