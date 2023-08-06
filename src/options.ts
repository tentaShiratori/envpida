import { program } from "commander";
import { version } from "../package.json";
import * as z from "zod";

const BufferEncoding = z.union(
  [
    z.literal("ascii"),
    z.literal("utf8"),
    z.literal("utf-8"),
    z.literal("utf16le"),
    z.literal("ucs2"),
    z.literal("ucs-2"),
    z.literal("base64"),
    z.literal("base64url"),
    z.literal("latin1"),
    z.literal("binary"),
    z.literal("hex"),
  ],
  {
    errorMap: (error, ctx) => {
      if (error.code === z.ZodIssueCode.invalid_union) {
        return { message: "Invalid encoding" };
      }
      return { message: ctx.defaultError };
    },
  }
);
const schema = z.object({
  path: z.string(),
  encoding: BufferEncoding,
});

export type Options = z.infer<typeof schema>;
export function options(argv: string[]) {
  const argParser = program
    .name("envpida")
    .description("TypeScript friendly typed environment variables")
    .version(version)
    .option("-p, --path <path>", "Path to .env file", ".env")
    .option("--encoding <encode>", "Encode of .env file", "utf8");
  const command = argParser.parse(argv);
  try {
    return schema.parse(command.opts());
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      let msg = "Invalid options\n";
      error.issues.forEach((issue) => {
        msg += `${issue.path[0]}: ${issue.message}\n`;
      });
      throw new Error(msg);
    }
    throw error;
  }
}
export function logZodError(e: z.ZodError) {
  e.issues.forEach((issue) => {
    console.error("error:", issue.path[0], issue.message);
  });
}
