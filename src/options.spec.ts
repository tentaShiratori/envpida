import { options } from "./options";
import {describe,it,expect} from "vitest"

describe("options", () => {
  it("should parse", () => {
    const input = ["", "", "--path", "path", "--encoding", "utf8"];
    const expected = {
      path: "path",
      encoding: "utf8",
    };
    const actual = options(input);
    expect(actual).toEqual(expected);
  });
  it("should parse with default", () => {
    const input = ["", ""];
    const expected = {
      path: ".env",
      encoding: "utf8",
    };
    const actual = options(input);
    expect(actual).toEqual(expected);
  });
  it("should throw error with invalid encoding", () => {
    const input = ["", "", "--path", "path", "--encoding", "test"];
    expect(() => options(input)).toThrowError(
      "Invalid options\nencoding: Invalid encoding\n"
    );
  });
});
