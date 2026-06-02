import { adultgenConfig } from './runtimeConfig';

export function requestEarlyAccess() {
  window.location.href = adultgenConfig.earlyAccessUrl;
}

