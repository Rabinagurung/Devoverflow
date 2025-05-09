import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  js.configs.recommended,
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:prettier/recommended",
  ),
  {
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
            "object",
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
      "comma-dangle": "off",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],

    rules: {
      "no-undef": "off",
    },
  },
];

export default config;

// import path from "node:path";
// import { fileURLToPath } from "node:url";

// import { FlatCompat } from "@eslint/eslintrc";
// import js from "@eslint/js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const compat = new FlatCompat({
//   baseDirectory: __dirname,
//   recommendedConfig: js.configs.recommended,
//   allConfig: js.configs.all,
// });

// const config = [
//   {
//     ignores: ["components/ui/**/*"],
//   },
//   ...compat.extends(
//     "next/core-web-vitals",
//     "next/typescript",
//     //"standard",
//     "plugin:tailwindcss/recommended",
//     "prettier",
//   ),
//   {
//     rules: {
//       "import/order": [
//         "error",
//         {
//           groups: [
//             "builtin",
//             "external",
//             "internal",
//             ["parent", "sibling"],
//             "index",
//             "object",
//           ],
//           "newlines-between": "always",
//           pathGroups: [
//             {
//               pattern: "@app/**",
//               group: "external",
//               position: "after",
//             },
//           ],
//           pathGroupsExcludedImportTypes: ["builtin"],
//           alphabetize: {
//             order: "asc",
//             caseInsensitive: true,
//           },
//         },
//       ],
//       "comma-dangle": "off",
//     },
//   },
//   {
//     files: ["**/*.ts", "**/*.tsx"],
//     rules: {
//       "no-undef": "off",
//       // Add this rule to ignore parameters that start with `_`
//       "@typescript-eslint/no-unused-vars": [
//         "error",
//         {
//           argsIgnorePattern: "^_",
//         },
//       ],
//     },
//   },
// ];

// export default config;

// import path from "node:path";
// import { fileURLToPath } from "node:url";

// import { FlatCompat } from "@eslint/eslintrc";
// import js from "@eslint/js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const compat = new FlatCompat({
//   baseDirectory: __dirname,
//   recommendedConfig: js.configs.recommended,
//   allConfig: js.configs.all,
// });

// const config = [
//   {
//     ignores: ["components/ui/**/*"],
//   },
//   ...compat.extends(
//     "next/core-web-vitals",
//     "next/typescript",
//     "standard",
//     "plugin:tailwindcss/recommended",
//     "prettier",
//   ),
//   {
//     rules: {
//       "import/order": [
//         "error",
//         {
//           groups: [
//             "builtin",
//             "external",
//             "internal",
//             ["parent", "sibling"],
//             "index",
//             "object",
//           ],

//           "newlines-between": "always",

//           pathGroups: [
//             {
//               pattern: "@app/**",
//               group: "external",
//               position: "after",
//             },
//           ],

//           pathGroupsExcludedImportTypes: ["builtin"],

//           alphabetize: {
//             order: "asc",
//             caseInsensitive: true,
//           },
//         },
//       ],
//       "comma-dangle": "off",
//     },
//   },
//   {
//     files: ["**/*.ts", "**/*.tsx"],

//     rules: {
//       "no-undef": "off",
//     },
//   },
// ];

// export default config;
