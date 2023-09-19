
type Position = {
    x: number,
    y: number
}

class Cell {
    private state: boolean
    private position: Position
    private element: HTMLDivElement

    constructor(state: boolean, position: Position, element: HTMLDivElement) {
        this.state = state
        this.position = position
        this.element = element

        this.element.onclick = this.onCellClicked
        this.updateCellElementState()
    }

    getPosition = () => {
        return this.position
    }

    getElement = () => {
        return this.element
    }

    getState = () => {
        return this.state
    }

    private updateCellElementState = () => {
        this.element.setAttribute('class',`cell-${this.state ? "alive" : "dead"}`)
    }

    private onCellClicked = () => {
        this.state = !this.state
        this.updateCellElementState()
    }
}

class Game {
    private gameIntervalLoop: NodeJS.Timeout | undefined
    private board: Cell[][]

    constructor(width: number, height: number) {
        this.board = this.initBoard(width, height)
    }

    private createCellElement = () => {
        const cellElement = document.createElement("div")
        cellElement.classList.add('cell-dead')
        return cellElement
    }

    private createColElement = () => {
        const colElement = document.createElement("div")
        colElement.classList.add('col') 
        return colElement
    }

    private calculateCellState = (x: number, y: number) => {
        const cell = this.board[x][y]
        let liveCells = 0
        for (let i = Math.max(0, x - 1); i <= Math.min(this.board.length - 1, x + 1); i++) {
            for (let j = Math.max(0, y - 1); j <= Math.min(this.board[i].length - 1, y + 1); j++) {
                if (i === x && j === y) continue
                // Overpopulation Case
                if (liveCells > 3) {
                    return false
                }

                const neighbour = getValidValueFromArray(this.board, i, j)
                if (neighbour && neighbour.getState()) liveCells++
            }
        }

        // Apply game rules
        if (liveCells < 2) { // Underpopulation
            return false
        } else if (cell.getState() === true && liveCells < 4) { // Generation
            return true
        } else if (cell.getState() === false && liveCells === 3) { // Reproduction
            return true
        }
        // Failed
        return false
    }

    private initBoard = (width: number, height: number): Cell[][] => {
        const board: Cell[][] = []
        const boardElement = document.getElementById("board")
        if (!boardElement) throw ("Board not found!")

        for (let i = 0; i < width; i++) {
            board[i] = []
            const column = this.createColElement()
            boardElement.append(column)
            for (let j = 0; j < height; j++) {
                const cell = new Cell(false, {
                    x: i,
                    y: j
                }, this.createCellElement())
                board[i][j] = cell
                column.append(cell.getElement())
            }
        }
        return board
    }

    private gameLoop = async (intervalTime: number) => {
        this.gameIntervalLoop = setInterval(() => {
            const updatedBoard: Cell[][] = [];
            for (let i = 0; i < this.board.length - 1; i++) {
                updatedBoard[i] = [];
                for (let j = 0; j < this.board[i].length - 1; j++) {
                    const cell = this.board[i][j]
                    const updatedCell = new Cell(this.calculateCellState(i, j), cell.getPosition(), cell.getElement());
                    updatedBoard[i][j] = updatedCell;
                }
            }
            this.board = updatedBoard
        }, intervalTime * 1000)
    }

    startGame = (intervalTime: number) => {
        if (!this.gameIntervalLoop) {
            this.gameLoop(intervalTime)
        } else {
            clearInterval(this.gameIntervalLoop)
            this.gameIntervalLoop = undefined
        }
    }
}

const getValidValueFromArray = (m: Cell[][], x: number, y: number): Cell | undefined => {
    if (m[x] && m[x][y] !== undefined) {
        return m[x][y];
    }
    return undefined;
};

// Main Game Instance
let game: Game

const createGame = (width: number, height: number) => {
    game = new Game(width, height)
}
