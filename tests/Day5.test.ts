import fs from "fs";

const inputLines = fs.readFileSync("./tests/Day5Input.txt", "utf-8").split("\r\n").map(l => l.trim());

describe("Day 5 tests", () => {

    it("Example1()", () => {
        const result = solve("FBFBBFFRLR");
        expect(result.Row).toBe(44);
        expect(result.Col).toBe(5);
        expect(result.SeatId).toBe(357);

        const result2 = solve("BFFFBBFRRR");
        expect(result2.Row).toBe(70);
        expect(result2.Col).toBe(7);
        expect(result2.SeatId).toBe(567);

        const result3 = solve("FFFBBBFRRR");
        expect(result3.Row).toBe(14);
        expect(result3.Col).toBe(7);
        expect(result3.SeatId).toBe(119);

        const result4 = solve("BBFFBBFRLL");
        expect(result4.Row).toBe(102);
        expect(result4.Col).toBe(4);
        expect(result4.SeatId).toBe(820);
    });


    it("Part1()", () => {
        const seatWithHighestId = inputLines.map(x => solve(x)).sort((a, b) => a.SeatId - b.SeatId)[inputLines.length - 1];

        expect(seatWithHighestId.SeatId).toBe(970);
    });


    it("Part2()", () => {
        const boardingPasses = inputLines.map(x => solve(x));

        const mySeat = findMissingSeatId(boardingPasses);

        expect(mySeat).toBe(587);
    });
});


function findMissingSeatId(boardingPasses: Seat[]): number {
    boardingPasses = boardingPasses.sort((a, b) => a.SeatId - b.SeatId)

    let previous = 0;

    for (const pass of boardingPasses) {
        const expected = previous + 1;
        if (pass.SeatId != expected && previous != 0) {
            return pass.SeatId - 1;
        }

        previous = pass.SeatId;
    }

    return -1;
}

function solve(boardPassCode: string): Seat {
    let rowCodes = boardPassCode.substring(0, boardPassCode.length - 3);
    let colCodes = boardPassCode.substring(boardPassCode.length - 3);

    let validRows = range(0, 128);
    let validCols = range(0, 8);

    for (let character of rowCodes) {
        const halfRows = Math.floor(validRows.length / 2);

        switch (character) {
            case 'F': validRows = validRows.slice(0, halfRows); break;
            case 'B': validRows = validRows.slice(halfRows); break;
        }
    }

    for (let character of colCodes) {
        const halfCols = Math.floor(validCols.length / 2);

        switch (character) {
            case 'L': validCols = validCols.slice(0, halfCols); break;
            case 'R': validCols = validCols.slice(halfCols); break;
        }
    }

    const row = validRows[0];
    const col = validCols[0];
    return new Seat(row, col);
}

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

const range = (from: number, to: number, step: number = 1) =>
    [...Array(Math.floor((to - 1 - from) / step) + 1)].map((_, i) => from + i * step);