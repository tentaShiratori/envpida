import fs from "fs-extra";
import { parse } from "./parse";
import { Options, options } from "./options";

function readFile(options: Options) {
  const { path, encoding } = options;
  return fs.readFileSync(path, { encoding });
}

export async function main(argv: string[]) {
  const opts = options(argv);
  const file = readFile(opts);
  const env = parse(file);
  console.log(env);
}
