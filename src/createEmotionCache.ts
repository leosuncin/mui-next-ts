import createCache from '@emotion/cache';

export default function createEmotionCache() {
  // prepend: true moves MUI styles to the top of the <head> so they're loaded first.
  // It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
  return createCache({ key: 'css', prepend: true });
}
