#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";
import { Command } from "commander";
import fg from "fast-glob";

const program = new Command();

program
  .name("rr-kit")
  .description("React Router Kit - Helper tools for React Router applications")
  .version("0.0.1");

program
  .command("check-types")
  .description("Enforce Route type imports in React Router route files")
  .option("-p, --path <path>", "Path to the app directory", "app")
  .option("-f, --fix", "Automatically add missing imports")
  .action(async (options) => {
    // Fallback logic for --fix detection due to environment specifics
    const shouldFix = options.fix || process.argv.includes("--fix") || process.argv.includes("-f");

    const appPath = path.resolve(process.cwd(), options.path);
    const rootPath = process.cwd();
    const virtualTypesDir = path.join(rootPath, ".react-router/types");

    console.log(chalk.blue(`🔍 Scanning for route type issues...`));

    let typeFiles: string[] = [];
    let isVirtual = false;

    try {
      await fs.access(virtualTypesDir);
      isVirtual = true;
      const files = await fg("**/*/+types/*.ts", {
        cwd: virtualTypesDir,
        absolute: true,
      });
      typeFiles = files;
    } catch {
      // Fallback
    }

    if (typeFiles.length === 0) {
      try {
        const files = await fg("**/+types/*.d.ts", {
          cwd: appPath,
          absolute: true,
        });
        if (files.length > 0) {
          typeFiles = files;
          isVirtual = false;
        }
      } catch {}
    }

    if (typeFiles.length === 0) {
      console.log(
        chalk.yellow("⚠️  No generated type files found. Did you run 'react-router typegen'?"),
      );
      process.exit(0);
    }

    let errorCount = 0;
    let fixedCount = 0;

    for (const typeFile of typeFiles) {
      let routeFile: string | null = null;
      const fileName = path.basename(typeFile, path.extname(typeFile));

      if (isVirtual) {
        const relPath = path.relative(virtualTypesDir, typeFile);
        const dir = path.dirname(relPath);
        const parentDir = path.dirname(dir);
        const candidateBase = path.join(rootPath, parentDir, fileName);

        const extensions = [".tsx", ".ts", ".jsx", ".js"];
        for (const ext of extensions) {
          const candidate = candidateBase + ext;
          try {
            await fs.access(candidate);
            routeFile = candidate;
            break;
          } catch {}
        }
      } else {
        const parentDir = path.dirname(path.dirname(typeFile));
        const extensions = [".tsx", ".ts", ".jsx", ".js"];
        for (const ext of extensions) {
          const candidate = path.join(parentDir, fileName + ext);
          try {
            await fs.access(candidate);
            routeFile = candidate;
            break;
          } catch {}
        }
      }

      if (!routeFile) {
        continue;
      }

      const content = await fs.readFile(routeFile, "utf-8");

      const routeImportRegex = /(import|export)\s+type\s+\{\s*Route\s*\}\s+from\s+['"](.+?)['"]/;
      const match = content.match(routeImportRegex);

      const hasCorrectSource = content.includes(`./+types/${fileName}`);

      if (match && hasCorrectSource) {
        // Good
      } else {
        if (shouldFix) {
          let newContent = content;
          const importStmt = `import type { Route } from "./+types/${fileName}";`; // No newline here, handle later

          if (match) {
            // We have an import but wrong source, replace it
            // match[1] is import or export
            const typeKeyword = match[1];
            const replacement = `${typeKeyword} type { Route } from "./+types/${fileName}"`;

            // We replace the specific instance we found
            newContent = content.replace(routeImportRegex, replacement);
          } else {
            // Missing entirely, add it
            const importLine = `${importStmt}\n`;
            const directiveMatch = content.match(/^(\s*['"]use (client|server)['"];?\s*)+/);

            if (directiveMatch) {
              const insertIdx = directiveMatch[0].length;
              newContent = `${content.slice(0, insertIdx)}\n${importLine}${content.slice(insertIdx)}`;
            } else {
              newContent = importLine + content;
            }
          }

          if (newContent !== content) {
            await fs.writeFile(routeFile, newContent, "utf-8");
            console.log(
              chalk.green(`✅ Fixed import in: ${path.relative(process.cwd(), routeFile)}`),
            );
            fixedCount++;
          }
        } else {
          // Display error log
          console.log(
            chalk.red(
              `❌ Missing or incorrect Route type import in: ${path.relative(process.cwd(), routeFile)}`,
            ),
          );
          console.log(chalk.dim(`   Expected: import type { Route } from "./+types/${fileName}"`));

          if (match) {
            console.log(chalk.dim(`   Found:    ${match[0]}`));
          }

          errorCount++;
        }
      }
    }

    if (errorCount > 0) {
      console.log(chalk.red(`\n🚫 Found ${errorCount} typeless routes.`));
      console.log(chalk.dim(`   Run with --fix to automatically add imports.`));
      process.exit(1);
    } else if (fixedCount > 0) {
      console.log(chalk.green(`\n✨ Fixed ${fixedCount} files!`));
    } else {
      console.log(chalk.green("\n✨ All routes have valid type imports!"));
    }
  });

program.parse();
