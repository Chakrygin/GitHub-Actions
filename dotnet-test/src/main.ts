import * as core from '@actions/core'
import * as glob from '@actions/glob'

import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

import * as dotnet from './dotnet'

async function main() {
  try {

    const patterns = core.getInput('PROJECTS_TO_TESTING');
    const projects = await find(patterns);

    console.log('projects: ');

    for (const project of projects) {
      console.log(project);
    }
    console.log();

    // const projects = await find('artifacts/tests/**');

    // console.log('Projects: ');

    // for (const project of projects) {
    //   console.log(project);
    // }

    // console.log();

    // const binaries = await findBinariesToIntegrationTesting();

    // for (const binariy of binaries) {
    //   await core.group(`Testing "${binariy}"...`, async () => {
    //     await dotnet.vstest(binariy, {
    //       logger: 'trx',
    //       resultsDirectory: 'TestResults'
    //     });
    //   });

    //   console.log();
    // }

  } catch (error) {
    core.setFailed(error.message)
  }
}

async function findBinariesToIntegrationTesting() {
  const patterns = core.getInput('PROJECTS_TO_TESTING');
  const projects = await find(patterns);

  const bins = projects.map(project => {
    return path.join(project, path.basename(project) + '.dll')
  })

  if (bins.length == 0) {
    throw new Error('No projects to packing found.');
  }

  const s = projects.length > 1 ? 's' : '';
  core.info(`Project${s} to packing:`);

  for (const project of projects) {
    core.info(`    ${project}`);
  }
  console.log();

  core.info(`Bin${s} to packing:`);

  for (const bin of bins) {
    core.info(`    ${bin}`);
  }

  console.log();

  return bins;
}

async function find(patterns: string) {
  const globber = await glob.create(patterns, {});
  const files = await globber.glob();

  return files.map(file => {
    return path.relative(process.cwd(), file);
  });
}

main();
