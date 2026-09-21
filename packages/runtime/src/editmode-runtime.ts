const RUNTIME_TOKENS = 'window.__codesign_tweaks__.tokens';

export function bindEditmodeTokensToRuntime(source: string): string {
  const parts: string[] = [];
  let cursor = 0;
  let copiedUntil = 0;
  let begin: number | null = null;
  // An unmatched BEGIN must not restart a search across the entire suffix for
  // every subsequent BEGIN. Each comment is visited once, including bad input.
  while (cursor < source.length) {
    const open = source.indexOf('/*', cursor);
    if (open < 0) break;
    const close = source.indexOf('*/', open + 2);
    if (close < 0) break;
    const marker = source.slice(open + 2, close).trim();
    if (marker === 'EDITMODE-BEGIN' && begin === null) begin = open;
    if (marker === 'EDITMODE-END' && begin !== null) {
      parts.push(source.slice(copiedUntil, begin), RUNTIME_TOKENS);
      copiedUntil = close + 2;
      begin = null;
    }
    cursor = close + 2;
  }
  parts.push(source.slice(copiedUntil));
  return parts.join('');
}
