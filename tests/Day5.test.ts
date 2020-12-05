import fs from "fs";

var inputLines = fs.readFileSync("C:/dev/AOC2020-ts/tests/Day5Input.txt", "utf-8").split("\r\n").map(l => l.trim());

describe("Day 5 tests", () => {

    it("Example1()", () => {
        var result = Solve("FBFBBFFRLR");
        expect(result.Row).toBe(44);
        expect(result.Col).toBe(5);
        expect(result.SeatId).toBe(357);

        var result2 = Solve("BFFFBBFRRR");
        expect(result2.Row).toBe(70);
        expect(result2.Col).toBe(7);
        expect(result2.SeatId).toBe(567);

        var result3 = Solve("FFFBBBFRRR");
        expect(result3.Row).toBe(14);
        expect(result3.Col).toBe(7);
        expect(result3.SeatId).toBe(119);

        var result4 = Solve("BBFFBBFRLL");
        expect(result4.Row).toBe(102);
        expect(result4.Col).toBe(4);
        expect(result4.SeatId).toBe(820);
    });


    it("Part1()", () => {
        var seatWithHighestId = inputLines.map(x => Solve(x)).sort((a, b) => a.SeatId - b.SeatId)[inputLines.length - 1];

        expect(seatWithHighestId.SeatId).toBe(970);
    });


    it("Part2()", () => {
        var boardingPasses = inputLines.map(x => Solve(x));

        var mySeat = FindMissingSeatId(boardingPasses);

        expect(mySeat).toBe(587);
    });
});

class Seat {
    public Row: number;
    public Col: number;
    public SeatId: number;

    public constructor(row: number, col: number) {
        this.Row = row;
        this.Col = col
        this.SeatId = row * 8 + col;
    }
}

function FindMissingSeatId(boardingPasses: Seat[]): number {
    boardingPasses = boardingPasses.sort((a, b) => a.SeatId - b.SeatId)

    var previous = 0;

    for (var pass of boardingPasses) {
        var expected = previous + 1;
        if (pass.SeatId != expected && previous != 0) {
            return pass.SeatId - 1;
        }

        previous = pass.SeatId;
    }

    return -1;
}

function Solve(boardPassCode: string): Seat {
    let rowCodes = boardPassCode.substring(0, boardPassCode.length - 3);
    let colCodes = boardPassCode.substring(boardPassCode.length - 3);

    let validRows: number[] = range(0, 127);
    let validCols: number[] = range(0, 7);

    for (let character of rowCodes) {
        const halfRows = Math.floor(validRows.length / 2);

        if (character === 'F') {
            validRows = validRows.slice(0, halfRows);
        } else if (character === 'B') {
            validRows = validRows.slice(halfRows);
        }
    }

    for (let character of colCodes) {
        var halfCols = Math.floor(validCols.length / 2);

        if (character === 'L') {
            validCols = validCols.slice(0, halfCols);
        } else if (character === 'R') {
            validCols = validCols.slice(halfCols);
        }
    }

    var row = validRows[0];
    var col = validCols[0];
    return new Seat(row, col);

}

const range = (from: number, to: number, step: number = 1) => [...Array(Math.floor((to - from) / step) + 1)].map((_, i) => from + i * step);