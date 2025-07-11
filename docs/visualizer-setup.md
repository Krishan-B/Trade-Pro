# Bundle Analysis Setup: rollup-plugin-visualizer

To analyze and optimize your bundle, we will add the `rollup-plugin-visualizer` to your Vite project. This will help you identify large dependencies and optimize chunking.

## 1. Install the plugin

```
npm install --save-dev rollup-plugin-visualizer
```

## 2. Update `vite.config.ts`

Add the following import at the top:

```ts
import { visualizer } from 'rollup-plugin-visualizer';
```

Add `visualizer()` to your `plugins` array:

```ts
plugins: [
  react(),
  visualizer({ open: true }),
],
```

## 3. Run the build

```
npm run build
```

After the build, a visualization report will open in your browser. Use this to identify large modules and optimize chunking or code-splitting as needed.

---

**Next Steps:**

- Use `React.lazy` and dynamic imports for large pages/routes.
- Refine `manualChunks` in `vite.config.ts` if needed, based on the visualizer report.
