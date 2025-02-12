// eslint.config.mjs
import { createRequire } from "module";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";

// Allow use of CommonJS modules in an ESM file
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize the compatibility helper with the project’s base directory.
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend from existing configurations.
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "standard",
    "plugin:tailwindcss/recommended",
    "prettier"
  ),

  // Global plugins and rules (replacing the "plugins" and "rules" in the old config).
  {
    plugins: {
      // Importing the "import" plugin.
      import: require("eslint-plugin-import"),
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // Built-in modules
            "external", // External libraries
            "internal", // Internal modules
            ["parent", "sibling"], // Parent and sibling modules
            "index", // Index file imports
            "object", // Object imports
          ],
          "newlines-between": "always",
          pathGroups: [
            {
              pattern: "@app/**",
              group: "external",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },

  // Overrides for TypeScript files (replacing the "overrides" section).

  {
    overrides: [
      {
        files: ["*.ts", "*.tsx"],
        rules: {
          "no-undef": "off",
        },
      },
    ],
  },
];

export default eslintConfig;

/* import { dirname } from "path";
import { fileURLToPath } from "url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
  plugins: ["import"],
  rules: {
    "import/order": [
      "error",
      {
        groups: [
          "builtin", // Built-in types are first
          "external", // External libraries
          "internal", // Internal modules
          ["parent", "sibling"], // Parent and sibling types can be mingled together
          "index", // Then the index file
          "object", // Object imports
        ],
        "newlines-between": "always",
        pathGroups: [
          {
            pattern: "@app/**",
            group: "external",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
  ignorePatterns: ["components/ui/**"],
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "standard",
    "plugin:tailwindcss/recommended",
    "prettier"
  ),
  {
    overrides: [
      {
        files: ["*.ts", "*.tsx"],
        rules: {
          "no-undef": "off",
        },
      },
    ],
  },
];

export default eslintConfig;
*/
