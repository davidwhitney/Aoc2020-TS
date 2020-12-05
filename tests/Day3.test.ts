import fs from "fs";

describe("Day3", () => {
    it("Example", () => {
        var terrain = [
            "..##.......",
            "#...#...#..",
            ".#....#..#.",
            "..#.#...#.#",
            ".#...##..#.",
            "..#.##.....",
            ".#.#.#....#",
            ".#........#",
            "#.##...#...",
            "#...##....#",
            ".#..#...#.#",
        ];

        var result = CountTrees(terrain, 3, 1);

        expect(result).toBe(7);
    });


    it("Part1", () => {
        var terrain = fs.readFileSync("C:/dev/AOC2020-ts/tests/Day3Input.txt", "utf-8").split("\r\n").map(l => l.trim());

        var result = CountTrees(terrain, 3, 1);

        expect(result).toBe(262);
    });


    it("Part2", () => {
        var terrain = fs.readFileSync("C:/dev/AOC2020-ts/tests/Day3Input.txt", "utf-8").split("\r\n").map(l => l.trim());

        var slopes = [
            [1, 1],
            [3, 1],
            [5, 1],
            [7, 1],
            [1, 2],
        ];

        var counts = slopes.map(slope => CountTrees(terrain, slope[0], slope[1]));

        var total = counts.reduce((previousValue, currentValue, currentIndex) => {
            return previousValue * currentValue;
        });

        expect(total).toBe(2698900776);
    });

});



function CountTrees(terrain: string[], slopeX: number, slopeY: number): number {
    var currentY = 0;
    var currentX = 0;

    var trees = 0;

    while (currentY < terrain.length) {
        var currentLocValue = terrain[currentY][currentX];
        if (currentLocValue == '#') {
            trees++;
        }

        currentX += slopeX;
        currentY += slopeY;

        currentX = currentX >= terrain[0].length
            ? currentX - terrain[0].length
            : currentX;
    }

    return trees;
}
