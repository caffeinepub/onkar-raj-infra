/**
 * Build information for production verification and diagnostic logging
 * This file provides a single source of truth for the current build version
 */

export const BUILD_INFO = {
  version: 'Version 30',
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

/**
 * Get a lightweight environment label for diagnostic logs
 */
export function getEnvironmentLabel(): string {
  const mode = BUILD_INFO.environment;
  
  // Map common modes to readable labels
  if (mode === 'development') return 'DEV';
  if (mode === 'production') return 'PROD';
  
  return mode.toUpperCase();
}
