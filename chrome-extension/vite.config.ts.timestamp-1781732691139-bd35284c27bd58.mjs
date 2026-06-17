// vite.config.ts
import { defineConfig } from "file:///C:/Users/harsh/Downloads/TIMER/chrome-extension/node_modules/vite/dist/node/index.js";
import { crx } from "file:///C:/Users/harsh/Downloads/TIMER/chrome-extension/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// src/manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "Google Forms Timer",
  version: "1.0.0",
  description: "A customizable timer for Google Forms",
  permissions: ["storage", "activeTab", "clipboardWrite", "webRequest"],
  host_permissions: ["*://docs.google.com/forms/*"],
  icons: {
    "16": "public/icon128.png",
    "48": "public/icon128.png",
    "128": "public/icon128.png"
  },
  action: {
    default_popup: "src/popup/popup.html",
    default_title: "Timer Settings",
    default_icon: {
      "16": "public/icon128.png",
      "48": "public/icon128.png",
      "128": "public/icon128.png"
    }
  },
  background: {
    service_worker: "src/background/background.ts",
    type: "module"
  },
  content_scripts: [
    {
      matches: ["*://docs.google.com/forms/*"],
      js: ["src/content/content.ts"]
    },
    {
      matches: ["http://localhost:5173/*", "https://forms.tapopen.online/*"],
      js: ["src/content/dashboard-sync.ts"],
      run_at: "document_start"
    }
  ]
};

// vite.config.ts
var vite_config_default = defineConfig({
  plugins: [crx({ manifest: manifest_default })],
  build: {
    rollupOptions: {
      input: {
        popup: "src/popup/popup.html"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21hbmlmZXN0Lmpzb24iXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxoYXJzaFxcXFxEb3dubG9hZHNcXFxcVElNRVJcXFxcY2hyb21lLWV4dGVuc2lvblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcaGFyc2hcXFxcRG93bmxvYWRzXFxcXFRJTUVSXFxcXGNocm9tZS1leHRlbnNpb25cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2hhcnNoL0Rvd25sb2Fkcy9USU1FUi9jaHJvbWUtZXh0ZW5zaW9uL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBjcnggfSBmcm9tICdAY3J4anMvdml0ZS1wbHVnaW4nO1xuaW1wb3J0IG1hbmlmZXN0IGZyb20gJy4vc3JjL21hbmlmZXN0Lmpzb24nIHdpdGggeyB0eXBlOiAnanNvbicgfTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW2NyeCh7IG1hbmlmZXN0IH0pXSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDoge1xuICAgICAgICBwb3B1cDogJ3NyYy9wb3B1cC9wb3B1cC5odG1sJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIiwgIntcbiAgXCJtYW5pZmVzdF92ZXJzaW9uXCI6IDMsXG4gIFwibmFtZVwiOiBcIkdvb2dsZSBGb3JtcyBUaW1lclwiLFxuICBcInZlcnNpb25cIjogXCIxLjAuMFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiQSBjdXN0b21pemFibGUgdGltZXIgZm9yIEdvb2dsZSBGb3Jtc1wiLFxuICBcInBlcm1pc3Npb25zXCI6IFtcInN0b3JhZ2VcIiwgXCJhY3RpdmVUYWJcIiwgXCJjbGlwYm9hcmRXcml0ZVwiLCBcIndlYlJlcXVlc3RcIl0sXG4gIFwiaG9zdF9wZXJtaXNzaW9uc1wiOiBbXCIqOi8vZG9jcy5nb29nbGUuY29tL2Zvcm1zLypcIl0sXG4gIFwiaWNvbnNcIjoge1xuICAgIFwiMTZcIjogXCJwdWJsaWMvaWNvbjEyOC5wbmdcIixcbiAgICBcIjQ4XCI6IFwicHVibGljL2ljb24xMjgucG5nXCIsXG4gICAgXCIxMjhcIjogXCJwdWJsaWMvaWNvbjEyOC5wbmdcIlxuICB9LFxuICBcImFjdGlvblwiOiB7XG4gICAgXCJkZWZhdWx0X3BvcHVwXCI6IFwic3JjL3BvcHVwL3BvcHVwLmh0bWxcIixcbiAgICBcImRlZmF1bHRfdGl0bGVcIjogXCJUaW1lciBTZXR0aW5nc1wiLFxuICAgIFwiZGVmYXVsdF9pY29uXCI6IHtcbiAgICAgIFwiMTZcIjogXCJwdWJsaWMvaWNvbjEyOC5wbmdcIixcbiAgICAgIFwiNDhcIjogXCJwdWJsaWMvaWNvbjEyOC5wbmdcIixcbiAgICAgIFwiMTI4XCI6IFwicHVibGljL2ljb24xMjgucG5nXCJcbiAgICB9XG4gIH0sXG4gIFwiYmFja2dyb3VuZFwiOiB7XG4gICAgXCJzZXJ2aWNlX3dvcmtlclwiOiBcInNyYy9iYWNrZ3JvdW5kL2JhY2tncm91bmQudHNcIixcbiAgICBcInR5cGVcIjogXCJtb2R1bGVcIlxuICB9LFxuICBcImNvbnRlbnRfc2NyaXB0c1wiOiBbXG4gICAge1xuICAgICAgXCJtYXRjaGVzXCI6IFtcIio6Ly9kb2NzLmdvb2dsZS5jb20vZm9ybXMvKlwiXSxcbiAgICAgIFwianNcIjogW1wic3JjL2NvbnRlbnQvY29udGVudC50c1wiXVxuICAgIH0sXG4gICAge1xuICAgICAgXCJtYXRjaGVzXCI6IFtcImh0dHA6Ly9sb2NhbGhvc3Q6NTE3My8qXCIsIFwiaHR0cHM6Ly9mb3Jtcy50YXBvcGVuLm9ubGluZS8qXCJdLFxuICAgICAgXCJqc1wiOiBbXCJzcmMvY29udGVudC9kYXNoYm9hcmQtc3luYy50c1wiXSxcbiAgICAgIFwicnVuX2F0XCI6IFwiZG9jdW1lbnRfc3RhcnRcIlxuICAgIH1cbiAgXVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyVSxTQUFTLG9CQUFvQjtBQUN4VyxTQUFTLFdBQVc7OztBQ0RwQjtBQUFBLEVBQ0Usa0JBQW9CO0FBQUEsRUFDcEIsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsYUFBZTtBQUFBLEVBQ2YsYUFBZSxDQUFDLFdBQVcsYUFBYSxrQkFBa0IsWUFBWTtBQUFBLEVBQ3RFLGtCQUFvQixDQUFDLDZCQUE2QjtBQUFBLEVBQ2xELE9BQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxRQUFVO0FBQUEsSUFDUixlQUFpQjtBQUFBLElBQ2pCLGVBQWlCO0FBQUEsSUFDakIsY0FBZ0I7QUFBQSxNQUNkLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUFBLEVBQ0EsWUFBYztBQUFBLElBQ1osZ0JBQWtCO0FBQUEsSUFDbEIsTUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLGlCQUFtQjtBQUFBLElBQ2pCO0FBQUEsTUFDRSxTQUFXLENBQUMsNkJBQTZCO0FBQUEsTUFDekMsSUFBTSxDQUFDLHdCQUF3QjtBQUFBLElBQ2pDO0FBQUEsSUFDQTtBQUFBLE1BQ0UsU0FBVyxDQUFDLDJCQUEyQixnQ0FBZ0M7QUFBQSxNQUN2RSxJQUFNLENBQUMsK0JBQStCO0FBQUEsTUFDdEMsUUFBVTtBQUFBLElBQ1o7QUFBQSxFQUNGO0FBQ0Y7OztBRGhDQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsSUFBSSxFQUFFLDJCQUFTLENBQUMsQ0FBQztBQUFBLEVBQzNCLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLE9BQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
