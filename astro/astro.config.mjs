// @ts-check
import { defineConfig } from 'astro/config';

// ThailandAddict — static build for Cloudflare. Output keeps flat ".html" filenames
// so internal links and Cloudflare's clean-URL redirect keep working.
export default defineConfig({
  site: 'https://thailandaddict.com',
  build: { format: 'file' },
  trailingSlash: 'never',
});
