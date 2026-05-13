import { defineConfig, type Plugin } from 'vitest/config';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';

function angularInlineResources(): Plugin {
  return {
    name: 'angular-inline-resources',
    transform(code, id) {
      if (!id.endsWith('.ts')) return;
      if (!code.includes('templateUrl') && !code.includes('styleUrl')) return;

      const dir = dirname(id);

      code = code.replace(/templateUrl:\s*['"](.+?)['"]/g, (_, url) => {
        const content = readFileSync(resolve(dir, url), 'utf-8')
          .replace(/\\/g, '\\\\')
          .replace(/`/g, '\\`')
          .replace(/\$\{/g, '\\${');
        return `template: \`${content}\``;
      });

      code = code.replace(/styleUrl:\s*['"](.+?)['"]/g, () => {
        return `styles: []`;
      });

      return code;
    },
  };
}

export default defineConfig({
  plugins: [angularInlineResources()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
  },
});
