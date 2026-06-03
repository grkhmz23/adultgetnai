export function requestEarlyAccess() {
  window.dispatchEvent(new CustomEvent('adultgen:open-early-access'));
}
