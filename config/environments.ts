const DEFAULT_BASE_URL = 'https://www.scriptedqa.com/';

export interface EnvironmentConfig {
  baseURL: string;
  isCI: boolean;
}

function resolveBaseURL(value: string | undefined): string {
  const configuredValue = value?.trim() || DEFAULT_BASE_URL;
  let url: URL;

  try {
    url = new URL(configuredValue);
  } catch {
    throw new Error(
      `Invalid BASE_URL "${configuredValue}". Set BASE_URL to an absolute HTTP or HTTPS URL.`,
    );
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(
      `Invalid BASE_URL "${configuredValue}". Only HTTP and HTTPS URLs are supported.`,
    );
  }

  return url.toString();
}

export function getEnvironmentConfig(
  env: NodeJS.ProcessEnv = process.env,
): EnvironmentConfig {
  const ciValue = env.CI?.trim().toLowerCase();

  if (ciValue && !['true', 'false', '1', '0'].includes(ciValue)) {
    throw new Error(
      `Invalid CI value "${env.CI}". Set CI to true, false, 1, or 0.`,
    );
  }

  return {
    baseURL: resolveBaseURL(env.BASE_URL),
    isCI: ciValue === 'true' || ciValue === '1',
  };
}
