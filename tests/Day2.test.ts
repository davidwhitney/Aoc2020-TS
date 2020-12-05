import fs from "fs";

describe("Day 2 Tests", () => {

    it("PasswordPolicyCtor_UnpacksCorrectly", () => {
        const policy = PasswordPolicy.fromEntry("1-3 a: abcde");

        expect(policy[0].Value).toBe('a');
        expect(policy[0].MinOccurs).toBe(1);
        expect(policy[0].MaxOccurs).toBe(3);
    });

    it("PasswordPolicy_IsValid_TrueWhenValid", () => {
        const policy = PasswordPolicy.fromEntry("1-3 a: abcde");

        const result = policy[0].isValid("abcde");

        expect(result).toBe(true);
    });

    it("Day2Part1", () => {
        const inputText = fs.readFileSync("./tests/Day2Input1.txt", "utf-8").split("\r\n");

        const passwordsAndPolicies = inputText.map(x => {
            const password = x.split(':')[1].trim();
            const policy = PasswordPolicy.fromEntry(x)[0];
            return { password, policy };
        });

        const valid = passwordsAndPolicies.filter(item => item.policy.isValid(item.password)).length;

        expect(valid).toBe(422);
    });


    it("Day2Part2Example", () => {
        const policy = new Part2PasswordPolicy('a', 1, 3);

        const result = policy.isValid("abcde");

        expect(result).toBe(true);
    });


    it("Day2Part2", () => {
        const inputText = fs.readFileSync("./tests/Day2Input1.txt", "utf-8").split("\r\n");

        const passwordsAndPolicies = inputText.map(x => {
            const password = x.split(':')[1].trim();
            const policy = Part2PasswordPolicy.fromEntry(x)[0];
            return { password, policy };
        });

        const valid = passwordsAndPolicies.filter(item => item.policy.isValid(item.password)).length;

        expect(valid).toBe(451);
    });

});

class Part2PasswordPolicy {
    public Value: string;
    public Position1: number;
    public Position2: number;

    public constructor(value: string, position1: number, position2: number) {
        this.Value = value;
        this.Position1 = position1;
        this.Position2 = position2;
    }

    public isValid(value: string): boolean {
        const position1 = this.Position1 - 1;
        const position2 = this.Position2 - 1;

        let match = 0;
        if (value.length >= position1) {
            if (value[position1] == this.Value) {
                match++;
            }
        }

        if (value.length >= position2) {
            if (value[position2] == this.Value) {
                match++;
            }
        }

        return match == 1;
    }

    public static fromEntry(passwordFileString: string): Part2PasswordPolicy[] {
        const items = [];

        const regex = new RegExp("([0-9]+)-([0-9]+)\\s([a-zA-Z]):.+");
        const results = regex.exec(passwordFileString);
        const min = parseInt(results[1]);
        const max = parseInt(results[2]);
        const value = results[3];

        const policy = new Part2PasswordPolicy(value, min, max);
        items.push(policy);

        return items;
    }
}

class PasswordPolicy {

    public Value: string;
    public MinOccurs: number;
    public MaxOccurs: number;

    private constructor(value: string, minOccurs: number, maxOccurs: number) {
        this.Value = value;
        this.MinOccurs = minOccurs;
        this.MaxOccurs = maxOccurs;
    }

    public isValid(value: string): boolean {
        const countOfValue = [...value].filter(x => x == this.Value).length;
        return countOfValue >= this.MinOccurs && countOfValue <= this.MaxOccurs;
    }

    public static fromEntry(passwordFileString: string): PasswordPolicy[] {
        const items = [];

        const regex = new RegExp("([0-9]+)-([0-9]+)\\s([a-zA-Z]):.+");
        const results = regex.exec(passwordFileString);
        const min = parseInt(results[1]);
        const max = parseInt(results[2]);
        const value = results[3];

        const policy = new PasswordPolicy(value, min, max);
        items.push(policy);

        return items;
    }
}