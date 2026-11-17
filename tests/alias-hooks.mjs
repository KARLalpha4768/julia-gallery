const candidates = (specifier) => {
  const rel = specifier.slice(2);
  return [rel, `${rel}.ts`, `${rel}.tsx`, `${rel}/index.ts`];
};

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/server' || specifier === 'next/headers' || specifier === 'next/navigation') {
    return nextResolve(`${specifier}.js`, context);
  }
  const parent = context.parentURL ?? '';
  if (
    (specifier.startsWith('./') || specifier.startsWith('../')) &&
    (parent.endsWith('.ts') || parent.endsWith('.tsx')) &&
    !/\.(tsx?|jsx?|json|mjs|cjs)$/.test(specifier)
  ) {
    try {
      return await nextResolve(`${specifier}.ts`, context);
    } catch {
      return nextResolve(`${specifier}.tsx`, context);
    }
  }
  if (!specifier.startsWith('@/')) {
    return nextResolve(specifier, context);
  }
  let lastError;
  for (const rel of candidates(specifier)) {
    const url = new URL(`../src/${rel}`, import.meta.url);
    try {
      return await nextResolve(url.href, context);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}
