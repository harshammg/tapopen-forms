// vite.config.ts
import { defineConfig } from "file:///C:/Users/harsh/Downloads/TIMER/chrome-extension/node_modules/vite/dist/node/index.js";
import { crx } from "file:///C:/Users/harsh/Downloads/TIMER/chrome-extension/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// src/manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "Google Forms Timer",
  version: "1.0.0",
  description: "A customizable timer for Google Forms",
  permissions: ["storage", "activeTab", "tabs", "clipboardWrite", "webRequest"],
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21hbmlmZXN0Lmpzb24iXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxoYXJzaFxcXFxEb3dubG9hZHNcXFxcVElNRVJcXFxcY2hyb21lLWV4dGVuc2lvblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcaGFyc2hcXFxcRG93bmxvYWRzXFxcXFRJTUVSXFxcXGNocm9tZS1leHRlbnNpb25cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2hhcnNoL0Rvd25sb2Fkcy9USU1FUi9jaHJvbWUtZXh0ZW5zaW9uL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBjcnggfSBmcm9tICdAY3J4anMvdml0ZS1wbHVnaW4nO1xuaW1wb3J0IG1hbmlmZXN0IGZyb20gJy4vc3JjL21hbmlmZXN0Lmpzb24nIHdpdGggeyB0eXBlOiAnanNvbicgfTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW2NyeCh7IG1hbmlmZXN0IH0pXSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDoge1xuICAgICAgICBwb3B1cDogJ3NyYy9wb3B1cC9wb3B1cC5odG1sJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIiwgIntcbiAgXCJtYW5pZmVzdF92ZXJzaW9uXCI6IDMsXG4gIFwibmFtZVwiOiBcIkdvb2dsZSBGb3JtcyBUaW1lclwiLFxuICBcInZlcnNpb25cIjogXCIxLjAuMFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiQSBjdXN0b21pemFibGUgdGltZXIgZm9yIEdvb2dsZSBGb3Jtc1wiLFxuICBcInBlcm1pc3Npb25zXCI6IFtcInN0b3JhZ2VcIiwgXCJhY3RpdmVUYWJcIiwgXCJ0YWJzXCIsIFwiY2xpcGJvYXJkV3JpdGVcIiwgXCJ3ZWJSZXF1ZXN0XCJdLFxuICBcImhvc3RfcGVybWlzc2lvbnNcIjogW1wiKjovL2RvY3MuZ29vZ2xlLmNvbS9mb3Jtcy8qXCJdLFxuICBcImljb25zXCI6IHtcbiAgICBcIjE2XCI6IFwicHVibGljL2ljb24xMjgucG5nXCIsXG4gICAgXCI0OFwiOiBcInB1YmxpYy9pY29uMTI4LnBuZ1wiLFxuICAgIFwiMTI4XCI6IFwicHVibGljL2ljb24xMjgucG5nXCJcbiAgfSxcbiAgXCJhY3Rpb25cIjoge1xuICAgIFwiZGVmYXVsdF9wb3B1cFwiOiBcInNyYy9wb3B1cC9wb3B1cC5odG1sXCIsXG4gICAgXCJkZWZhdWx0X3RpdGxlXCI6IFwiVGltZXIgU2V0dGluZ3NcIixcbiAgICBcImRlZmF1bHRfaWNvblwiOiB7XG4gICAgICBcIjE2XCI6IFwicHVibGljL2ljb24xMjgucG5nXCIsXG4gICAgICBcIjQ4XCI6IFwicHVibGljL2ljb24xMjgucG5nXCIsXG4gICAgICBcIjEyOFwiOiBcInB1YmxpYy9pY29uMTI4LnBuZ1wiXG4gICAgfVxuICB9LFxuICBcImJhY2tncm91bmRcIjoge1xuICAgIFwic2VydmljZV93b3JrZXJcIjogXCJzcmMvYmFja2dyb3VuZC9iYWNrZ3JvdW5kLnRzXCIsXG4gICAgXCJ0eXBlXCI6IFwibW9kdWxlXCJcbiAgfSxcbiAgXCJjb250ZW50X3NjcmlwdHNcIjogW1xuICAgIHtcbiAgICAgIFwibWF0Y2hlc1wiOiBbXCIqOi8vZG9jcy5nb29nbGUuY29tL2Zvcm1zLypcIl0sXG4gICAgICBcImpzXCI6IFtcInNyYy9jb250ZW50L2NvbnRlbnQudHNcIl1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwibWF0Y2hlc1wiOiBbXCJodHRwOi8vbG9jYWxob3N0OjUxNzMvKlwiLCBcImh0dHBzOi8vZm9ybXMudGFwb3Blbi5vbmxpbmUvKlwiXSxcbiAgICAgIFwianNcIjogW1wic3JjL2NvbnRlbnQvZGFzaGJvYXJkLXN5bmMudHNcIl0sXG4gICAgICBcInJ1bl9hdFwiOiBcImRvY3VtZW50X3N0YXJ0XCJcbiAgICB9XG4gIF1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlUsU0FBUyxvQkFBb0I7QUFDeFcsU0FBUyxXQUFXOzs7QUNEcEI7QUFBQSxFQUNFLGtCQUFvQjtBQUFBLEVBQ3BCLE1BQVE7QUFBQSxFQUNSLFNBQVc7QUFBQSxFQUNYLGFBQWU7QUFBQSxFQUNmLGFBQWUsQ0FBQyxXQUFXLGFBQWEsUUFBUSxrQkFBa0IsWUFBWTtBQUFBLEVBQzlFLGtCQUFvQixDQUFDLDZCQUE2QjtBQUFBLEVBQ2xELE9BQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxRQUFVO0FBQUEsSUFDUixlQUFpQjtBQUFBLElBQ2pCLGVBQWlCO0FBQUEsSUFDakIsY0FBZ0I7QUFBQSxNQUNkLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUFBLEVBQ0EsWUFBYztBQUFBLElBQ1osZ0JBQWtCO0FBQUEsSUFDbEIsTUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLGlCQUFtQjtBQUFBLElBQ2pCO0FBQUEsTUFDRSxTQUFXLENBQUMsNkJBQTZCO0FBQUEsTUFDekMsSUFBTSxDQUFDLHdCQUF3QjtBQUFBLElBQ2pDO0FBQUEsSUFDQTtBQUFBLE1BQ0UsU0FBVyxDQUFDLDJCQUEyQixnQ0FBZ0M7QUFBQSxNQUN2RSxJQUFNLENBQUMsK0JBQStCO0FBQUEsTUFDdEMsUUFBVTtBQUFBLElBQ1o7QUFBQSxFQUNGO0FBQ0Y7OztBRGhDQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsSUFBSSxFQUFFLDJCQUFTLENBQUMsQ0FBQztBQUFBLEVBQzNCLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLE9BQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
