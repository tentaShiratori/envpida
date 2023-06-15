import { parse } from "./parse";
describe("parse", () => {
  it("should parse", () => {
    const input = `TEST=test`;
    const expected = [["TEST", "test", "string"]];
    const actual = parse(input);
    expect(actual).toEqual(expected);
  });
  it("should parse with type", () => {
    const input = `
TEST1=test # string
TEST2=1 # number
TEST3=10 # number
TEST4=true # boolean
TEST5=1 # 1|2|3
`;
    const expected = [
      ["TEST1", "test", "string"],
      ["TEST2", "1", "number"],
      ["TEST3", "10", "number"],
      ["TEST4", "true", "boolean"],
      ["TEST5", "1", { type: "union", values: ["1", "2", "3"] }],
    ];
    const actual = parse(input);
    expect(actual).toEqual(expected);
  });
  it("should parse with simple value and type and comment", () => {
    const input = `
# comment
TEST1=test
TEST2=1 # number
`;
    const expected = [
      ["TEST1", "test", "string"],
      ["TEST2", "1", "number"],
    ];
    const actual = parse(input);
    expect(actual).toEqual(expected);
  });
  it("should parse with multiline value", () => {
    const input = `
TEST1="test"
TEST2="test
test"
TEST3="test
test
test"
`;
    const expected = [
      ["TEST1", "test", "string"],
      ["TEST2", "test\ntest", "string"],
      ["TEST3", "test\ntest\ntest", "string"],
    ];
    const actual = parse(input);
    expect(actual).toEqual(expected);

    const input2 = `
TEST1='test'
TEST2='test
test'
TEST3='test
test
test'
`;
    const expected2 = [
      ["TEST1", "test", "string"],
      ["TEST2", "test\ntest", "string"],
      ["TEST3", "test\ntest\ntest", "string"],
    ];
    const actual2 = parse(input2);
    expect(actual2).toEqual(expected2);

    const input3 = `
TEST1=\`test\`
TEST2=\`test
test\`
TEST3=\`test
test
test\`
`;

    const expected3 = [
      ["TEST1", "test", "string"],
      ["TEST2", "test\ntest", "string"],
      ["TEST3", "test\ntest\ntest", "string"],
    ];
    const actual3 = parse(input3);
    expect(actual3).toEqual(expected3);
  });
  it("should parse with multiline value and comment", () => {
    const input = `
TEST1="test" # comment
TEST2="test
test" # comment
TEST3="test
test
test" # comment
`;

    const expected = [
      ["TEST1", "test", "string"],
      ["TEST2", "test\ntest", "string"],
      ["TEST3", "test\ntest\ntest", "string"],
    ];
    const actual = parse(input);
    expect(actual).toEqual(expected);

    const input2 = `
TEST1='test' # comment
TEST2='test
test' # comment
TEST3='test
test
test' # comment
`;

    const expected2 = [
      ["TEST1", "test", "string"],
      ["TEST2", "test\ntest", "string"],
      ["TEST3", "test\ntest\ntest", "string"],
    ];
    const actual2 = parse(input2);
    expect(actual2).toEqual(expected2);

    const input3 = `
TEST1=\`test\` # comment
TEST2=\`test
test\` # comment
TEST3=\`test
test
test\` # comment
`;

    const expected3 = [
      ["TEST1", "test", "string"],
      ["TEST2", "test\ntest", "string"],
      ["TEST3", "test\ntest\ntest", "string"],
    ];
    const actual3 = parse(input3);
    expect(actual3).toEqual(expected3);
  });
  it("should raise error with multiline value and type been difference with string", () => {
    const multilineValue = [
      `TEST="test
test"`,
      `TEST="test
test
test"`,
      `TEST='test
test'`,
      `TEST="test
test
test"`,
      `TEST=\`test
test\``,
      `TEST=\`test
test
test\``,
    ];
    const types = ["number", "boolean"];
    multilineValue.forEach((value) => {
      types.forEach((type) => {
        const input = `${value} # ${type}`;
        expect(() => parse(input)).toThrowError();
      });
    });
  });
});
