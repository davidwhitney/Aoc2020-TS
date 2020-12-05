import fs from "fs";

describe("Day 4", () => {

    it("FromLine_PassportWithSingleField_CorrectNumberOfFieldsDetected", () => {
        const singleLineWithOneEntry = "ecl:gry";
        const passport = Passport.FromLine(singleLineWithOneEntry);
        expect(passport.Fields.size).toBe(1);
    });


    it("FromLine_PassportWithSingleField_Parses", () => {
        const singleLineWithOneEntry = "ecl:gry";
        const passport = Passport.FromLine(singleLineWithOneEntry);
        expect(passport.Fields.get("ecl")).toBe("gry");
    });


    it("FromLine_PassportWithMultipleFields_Parses", () => {
        const multipleValues = "ecl:gry pid:860033327";
        const passport = Passport.FromLine(multipleValues);
        expect(passport.Fields.size).toBe(2);
    });


    it("FromLine_PassportWithMultipleFieldsWithNewLineSplitter_Parses", () => {
        const multipleValues = "ecl:gry\npid:860033327";
        const passport = Passport.FromLine(multipleValues);
        expect(passport.Fields.size).toBe(2);
    });


    it("FromFile_GivenOneEntry_Parses", () => {
        const singleLineWithOneEntry = "ecl:gry";
        const passport = Passport.FromFile(singleLineWithOneEntry);

        expect(passport.length).toBe(1);
    });


    it("FromFile_GivenMultipleEntry_Parses", () => {
        const fileWithTwoEntries = "ecl:gry pid:860033327 eyr:2020 hcl:#fffffd\r\n" +
            "byr:1937 iyr:2017 cid:147 hgt:183cm\r\n\r\n" +
            "iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884\r\n" +
            "hcl:#cfa07d byr:1929";

        const passport = Passport.FromFile(fileWithTwoEntries);

        expect(passport.length).toBe(2);
    });

    it("Example1_ContainsAllFields", () => {
        const input = "ecl:gry pid:860033327 eyr:2020 hcl:#fffffd\r\nbyr:1937 iyr:2017 cid:147 hgt:183cm\r\n";
        const passport = Passport.FromFile(input)[0];

        expect(passport.IsValid).toBe(true);
    });


    it("Example2_MissingHgt", () => {
        const input = "iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884\r\nhcl:#cfa07d byr:1929";
        const passport = Passport.FromFile(input)[0];

        expect(passport.IsValid).toBe(false);
    });


    it("Example2_OnlyMissingCID", () => {
        const input = "hcl:#ae17e1 iyr:2013\r\neyr:2024\r\necl:brn pid:760753108 byr:1931\r\nhgt:179cm";
        const passport = Passport.FromFile(input)[0];

        expect(passport.IsValid).toBe(true);
    });


    it("Part1", () => {
        const input = fs.readFileSync("./tests/Day4.txt", "utf-8");
        const passports = Passport.FromFile(input);

        const validCount = passports.filter(p => p.IsValid).length;

        expect(validCount).toBe(200);
    });


    it("Part2_Examples", () => {
        const rule = Passport.ContentValidators.filter(x => x.FieldName === "byr")[0];
        expect(rule.Validate("2002")).toBe(true);
        expect(rule.Validate("2003")).toBe(false);

        const rule2 = Passport.ContentValidators.filter(x => x.FieldName === "iyr")[0];
        expect(rule2.Validate("2015")).toBe(true);
        expect(rule2.Validate("2025")).toBe(false);

        const rule3 = Passport.ContentValidators.filter(x => x.FieldName === "eyr")[0];
        expect(rule3.Validate("2025")).toBe(true);
        expect(rule3.Validate("2035")).toBe(false);

        const rule4 = Passport.ContentValidators.filter(x => x.FieldName === "hgt")[0];
        expect(rule4.Validate("60in")).toBe(true);
        expect(rule4.Validate("190cm")).toBe(true);
        expect(rule4.Validate("190in")).toBe(false);
        expect(rule4.Validate("190")).toBe(false);

        const rule5 = Passport.ContentValidators.filter(x => x.FieldName === "hcl")[0];
        expect(rule5.Validate("#123abc")).toBe(true);
        expect(rule5.Validate("#123abz")).toBe(false);
        expect(rule5.Validate("123abc")).toBe(false);

        const rule6 = Passport.ContentValidators.filter(x => x.FieldName === "ecl")[0];
        expect(rule6.Validate("blah")).toBe(false);
        expect(rule6.Validate("amb")).toBe(true);

        const rule7 = Passport.ContentValidators.filter(x => x.FieldName === "pid")[0];
        expect(rule7.Validate("000000001")).toBe(true);
        expect(rule7.Validate("0123456789")).toBe(false);
    });

    it("Part2", () => {
        const input = fs.readFileSync("./tests/Day4.txt", "utf-8");
        const passports = Passport.FromFile(input, Passport.ContentValidators);

        const validCount = passports.filter(p => p.IsValid).length;

        expect(validCount).toBe(116);
    });
});

type Validator = (textValue: string) => boolean;

class Rule {
    public FieldName: string;
    private _validator: Validator;
    private _optional: boolean;

    public constructor(fieldName: string, validator: Validator, optional: boolean = false) {
        this.FieldName = fieldName;
        this._validator = validator;
        this._optional = optional;
    }

    public Validate(value: string): boolean {
        return this._validator(value);
    }

    public ValidateFields(allFields: Map<string, string>): boolean {
        if (this._optional && !allFields.has(this.FieldName)) {
            return true;
        }

        if (!allFields.has(this.FieldName)) {
            return false;
        }

        const value = allFields.get(this.FieldName);
        return this.Validate(value);
    }
}

class Passport {
    public Fields: Map<string, string>;
    private _validators: Rule[];

    public constructor(pairs: Map<string, string>, withValidators = null) {
        this.Fields = pairs;
        this._validators = (withValidators ?? Passport.PresenceValidators);
    }

    public get IsValid(): boolean {
        return this._validators.every(v => v.ValidateFields(this.Fields));
    }

    public static FromFile(passportFile: string, withValidators: Rule[] = null): Passport[] {
        passportFile = passportFile.replace(/\r\n\r\n/g, "\n\n");
        const passportsLines = passportFile.split("\n\n");
        return passportsLines.map(l => Passport.FromLine(l.trim(), withValidators));
    }

    public static FromLine(passportFields: string, withValidators: Rule[] = null): Passport {
        passportFields = passportFields.trim().replace(/ /g, "\r\n").replace(/\r\n/g, "\n");
        const fieldsAndValues = passportFields.split("\n");

        const dic = new Map<string, string>();
        fieldsAndValues.map(pair => pair.trim().split(':')).forEach(parts => {
            dic.set(parts[0], parts[1]);
        });

        return new Passport(dic, withValidators);
    }

    public static get ContentValidators(): Rule[] {
        const validators = [];

        validators.push(new Rule("byr", t => {
            const value = parseInt(t);
            return value >= 1920 && value <= 2002;
        }));

        validators.push(new Rule("iyr", t => {
            const value = parseInt(t);
            return value >= 2010 && value <= 2020;
        }));

        validators.push(new Rule("eyr", t => {
            const value = parseInt(t);
            return value >= 2020 && value <= 2030;
        }));

        validators.push(new Rule("hgt", t => {
            const regex = new RegExp("^([0-9]+)(cm|in)$");
            const matches = regex.exec(t);

            if (matches == null || matches.length === 0) {
                return false;
            }

            const numeric = parseInt(matches[1]);
            const unit = matches[2].toLowerCase();

            if (unit === "cm") {
                return numeric >= 150 && numeric <= 193;
            } else if (unit === "in") {
                return numeric >= 59 && numeric <= 76;
            }

            return false;
        }));

        validators.push(new Rule("hcl", t => (new RegExp("^#[0-9a-fA-F]{6,6}$").exec(t) ?? []).length > 0));
        validators.push(new Rule("ecl", t => ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(t)));
        validators.push(new Rule("pid", t => (new RegExp("^[0-9]{9,9}$").exec(t) ?? []).length > 0));
        validators.push(new Rule("cid", t => true, true));
        return validators;
    };

    public static get PresenceValidators(): Rule[] {
        const map = [];
        map.push(new Rule("byr", t => true));
        map.push(new Rule("iyr", t => true));
        map.push(new Rule("eyr", t => true));
        map.push(new Rule("hgt", t => true));
        map.push(new Rule("hcl", t => true));
        map.push(new Rule("ecl", t => true));
        map.push(new Rule("pid", t => true));
        map.push(new Rule("cid", t => true, true));
        return map;
    }
}
