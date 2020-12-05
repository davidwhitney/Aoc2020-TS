import fs from "fs";

describe("Day3", () => {
    it("Example", () => {
        const terrain = [
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

        const result = countTrees(terrain, 3, 1);

        expect(result).toBe(7);
    });

    it("Part1", () => {
        const terrain = fs.readFileSync("./tests/Day3Input.txt", "utf-8").split("\r\n").map(l => l.trim());

        const result = countTrees(terrain, 3, 1);

        expect(result).toBe(262);
    });

    it("Part2", () => {
        const terrain = fs.readFileSync("./tests/Day3Input.txt", "utf-8").split("\r\n").map(l => l.trim());

        const slopes = [
            [1, 1],
            [3, 1],
            [5, 1],
            [7, 1],
            [1, 2],
        ];

        const counts = slopes.map(slope => countTrees(terrain, slope[0], slope[1]));

        const total = counts.reduce((previousValue, currentValue, currentIndex) => {
            return previousValue * currentValue;
        });

        expect(total).toBe(2698900776);
    });
});

function countTrees(terrain: string[], slopeX: number, slopeY: number): number {
    let currentY = 0;
    let currentX = 0;

    let trees = 0;

    while (currentY < terrain.length) {
        const currentLocValue = terrain[currentY][currentX];
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
