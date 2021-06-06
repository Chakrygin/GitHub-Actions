import { exec } from '@actions/exec'

export interface VsTestOptions {
  logger?: string;
  resultsDirectory?: string;
}

export async function vstest(project: string, options: VsTestOptions) {
  const args = ['vstest', project];

  if (options.logger) {
    args.push(`--logger:${options.logger}`);
  }

  if (options.resultsDirectory) {
    args.push(`--ResultsDirectory:${options.resultsDirectory}`);
  }

  await exec('dotnet', args);
}
