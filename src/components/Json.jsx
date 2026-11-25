// Renders a value as syntax-highlighted, pretty-printed JSON.
// `limit` lets callers stream the output character by character.

function tokens(value, indent = 0) {
  const pad = '  '.repeat(indent);
  const padIn = '  '.repeat(indent + 1);
  const out = [];
  const push = (text, cls) => out.push({ text, cls });

  if (Array.isArray(value)) {
    if (!value.length) return [{ text: '[]', cls: 'j-punc' }];
    const inline = value.every((v) => typeof v !== 'object' || v === null);
    if (inline && JSON.stringify(value).length < 72) {
      push('[', 'j-punc');
      value.forEach((v, i) => {
        out.push(...tokens(v, 0));
        if (i < value.length - 1) push(', ', 'j-punc');
      });
      push(']', 'j-punc');
      return out;
    }
    push('[\n', 'j-punc');
    value.forEach((v, i) => {
      push(padIn);
      out.push(...tokens(v, indent + 1));
      push(i < value.length - 1 ? ',\n' : '\n', 'j-punc');
    });
    push(`${pad}]`, 'j-punc');
    return out;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    const flat = entries.every(([, v]) => typeof v !== 'object' || v === null);
    if (flat && indent > 0 && JSON.stringify(value).length < 64) {
      push('{ ', 'j-punc');
      entries.forEach(([k, v], i) => {
        push(`"${k}"`, 'j-key');
        push(': ', 'j-punc');
        out.push(...tokens(v, 0));
        if (i < entries.length - 1) push(', ', 'j-punc');
      });
      push(' }', 'j-punc');
      return out;
    }
    push('{\n', 'j-punc');
    entries.forEach(([k, v], i) => {
      push(padIn);
      push(`"${k}"`, 'j-key');
      push(': ', 'j-punc');
      out.push(...tokens(v, indent + 1));
      push(i < entries.length - 1 ? ',\n' : '\n', 'j-punc');
    });
    push(`${pad}}`, 'j-punc');
    return out;
  }
  if (typeof value === 'string') return [{ text: `"${value}"`, cls: 'j-str' }];
  if (typeof value === 'number') return [{ text: String(value), cls: 'j-num' }];
  if (typeof value === 'boolean' || value === null) return [{ text: String(value), cls: 'j-bool' }];
  return [];
}

export function jsonLength(value) {
  return tokens(value).reduce((n, t) => n + t.text.length, 0);
}

export default function Json({ value, limit = Infinity }) {
  let remaining = limit;
  const parts = [];
  for (const [i, t] of tokens(value).entries()) {
    if (remaining <= 0) break;
    const text = t.text.length > remaining ? t.text.slice(0, remaining) : t.text;
    remaining -= text.length;
    parts.push(
      t.cls ? (
        <span key={i} className={t.cls}>
          {text}
        </span>
      ) : (
        text
      ),
    );
  }
  return <>{parts}</>;
}
