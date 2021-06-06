import { exec } from '@actions/exec'

export interface RestoreOptions {
  packages?: string;
}

export async function restore(project: string, options: RestoreOptions = {}) {
  const args = ['restore', project];

  if (options.packages) {
    args.push('--packages', options.packages);
  }

  await exec('dotnet', args);
}

export interface BuildOptions {
  configuration?: string;
}

export async function build(project: string, options: BuildOptions = {}) {
  const args = ['build', project];

  args.push('--nologo');
  args.push('--no-restore');

  if (options.configuration) {
    args.push('--configuration', options.configuration);
  }

  await exec('dotnet', args);
}
