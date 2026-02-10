/**
 * Build information for production verification
 * This file provides a single source of truth for the current build version
 */

export const BUILD_INFO = {
  version: 'Version 24',
  buildDate: new Date().toISOString(),
  environment: import.meta.env.MODE || 'production',
} as const;

export function logBuildInfo() {
  console.log(
    `%c🚀 ${BUILD_INFO.version}`,
    'color: #3b82f6; font-weight: bold; font-size: 14px;'
  );
  console.log(`Build Date: ${BUILD_INFO.buildDate}`);
  console.log(`Environment: ${BUILD_INFO.environment}`);
}
