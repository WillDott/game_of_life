
type Position = {
    x: number,
    y: number
}

class Cell {
    private state: boolean
    private positon: Position
    private element: HTMLDivElement

    constructor(state: boolean, position: Position, element: HTMLDivElement) {
        this.state = state
        this.positon = position
        this.element = element

        this.element.onclick = this.onCellClicked
    }

    getPosition = () => {
        return this.positon
    }

    getElement = () => {
        return this.element
    }

    private onCellClicked = () => {
        this.state = !this.state
        this.element.setAttribute('class', `cell-${this.state ? "alive" : "dead"}`)
    }
}

const createCellElement = () => {
    const cellElement = document.createElement("div")
    cellElement.setAttribute('class', 'cell-dead')
    return cellElement
}

const createColElement = () => {
    const colElement = document.createElement("div")
    colElement.setAttribute('class', 'col')
    return colElement
}


const createBoard = (width: number, height: number): Cell[][] => {
    const board: Cell[][] = []
    const boardElement = document.getElementById("board")
    if(!boardElement) throw("Board not found!")

    for (let i = 0; i < width; i++) {
        board[i] = []
        const column = createColElement()
        boardElement.append(column)
        for (let j = 0; j < height; j++) {
            const cell = new Cell(false, {
                x: i,
                y: j
            }, createCellElement())
            board[i][j] = cell
            column.append(cell.getElement())
        }
    }

    console.log(board)

    return board
}