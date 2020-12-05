import fs from "fs";


describe("Day 2 Tests", () => {

    it("PasswordPolicyCtor_UnpacksCorrectly", () => {
        var policy = PasswordPolicy.FromEntry("1-3 a: abcde");

        expect(policy[0].Value).toBe('a');
        expect(policy[0].MinOccurs).toBe(1);
        expect(policy[0].MaxOccurs).toBe(3);
    });


    it("PasswordPolicy_IsValid_TrueWhenValid", () => {
        var policy = PasswordPolicy.FromEntry("1-3 a: abcde");

        var result = policy[0].IsValid("abcde");

        expect(result).toBe(true);
    });

    it("Day2Part1", () => {
        var inputText = fs.readFileSync("C:/dev/AOC2020-ts/tests/Day2Input1.txt", "utf-8").split("\r\n");

        var passwordsAndPolicies = inputText.map(x => {
            var password = x.split(':')[1].trim();
            var policy = PasswordPolicy.FromEntry(x)[0];
            return { password, policy };
        });

        var valid = passwordsAndPolicies.filter(item => item.policy.IsValid(item.password)).length;

        expect(valid).toBe(422);
    });


    it("Day2Part2Example", () => {
        var policy = new Part2PasswordPolicy('a', 1, 3);

        var result = policy.IsValid("abcde");

        expect(result).toBe(true);
    });


    it("Day2Part2", () => {
        var inputText = fs.readFileSync("C:/dev/AOC2020-ts/tests/Day2Input1.txt", "utf-8").split("\r\n");

        var passwordsAndPolicies = inputText.map(x => {
            var password = x.split(':')[1].trim();
            var policy = Part2PasswordPolicy.FromEntry(x)[0];
            return { password, policy };
        });

        var valid = passwordsAndPolicies.filter(item => item.policy.IsValid(item.password)).length;

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

    public IsValid(value: string): boolean {
        var position1 = this.Position1 - 1;
        var position2 = this.Position2 - 1;

        var match = 0;
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

    public static FromEntry(passwordFileString: string): Part2PasswordPolicy[] {
        var items = [];

        var regex = new RegExp("([0-9]+)-([0-9]+)\\s([a-zA-Z]):.+");
        var results = regex.exec(passwordFileString);
        var min = parseInt(results[1]);
        var max = parseInt(results[2]);
        var value = results[3];

        var policy = new Part2PasswordPolicy(value, min, max);
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

    public IsValid(value: string): boolean {
        const countOfValue = [...value].filter(x => x == this.Value).length;

        return countOfValue >= this.MinOccurs && countOfValue <= this.MaxOccurs;
    }

    public static FromEntry(passwordFileString: string): PasswordPolicy[] {
        var items = [];

        var regex = new RegExp("([0-9]+)-([0-9]+)\\s([a-zA-Z]):.+");
        var results = regex.exec(passwordFileString);
        var min = parseInt(results[1]);
        var max = parseInt(results[2]);
        var value = results[3];

        var policy = new PasswordPolicy(value, min, max);
        items.push(policy);

        return items;
    }
}