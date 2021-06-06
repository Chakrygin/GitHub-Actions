import * as core from '@actions/core'
import * as glob from '@actions/glob'

import * as path from 'path'

import * as dotnet from './dotnet'

async function main() {
  const configuration = core.getInput('CONFIGURATION');

  const solution = await findSolution();

  await core.group(`Restoring "${solution}"...`, async () => {
    await dotnet.restore(solution, {
      packages: 'packages'
    });
  });

  console.log();

  await core.group(`Building "${solution}"...`, async () => {
    await dotnet.build(solution, {
      configuration: configuration,
    });
  });

  console.log();
}

async function findSolution() {
  const patterns = core.getInput('SOLUTION');
  const solutions = await find(patterns);

  if (solutions.length == 0) {
    throw new Error('No solution to restoring and building found.');
  }

  const s = solutions.length > 1 ? "s" : "";
  core.info(`Solution${s} to restoring and building:`);

  for (const solution of solutions) {
    core.info(`    ${solution}`)
  }

  console.log();

  if (solutions.length > 0) {
    throw new Error('Multiple solutions to restoring and building found.');
  }

  return solutions[0];
}

async function find(patterns: string) {
  const globber = await glob.create(patterns);
  const files = await globber.glob();

  return files.map(file => {
    return path.relative(process.cwd(), file);
  });
}

main();
