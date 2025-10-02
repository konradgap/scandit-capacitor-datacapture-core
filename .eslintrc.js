module.exports = {
  root: true,
  extends: [
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"]
  },
  plugins: [
      "@typescript-eslint"
  ],
  rules: {
    "@typescript-eslint/no-unused-expressions": "error",
    "@typescript-eslint/no-empty-interface": "off",

    "@typescript-eslint/quotes": [
      "error",
      "single", {"avoidEscape": true}
    ],
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/unified-signatures": "off",
    "arrow-parens": [
      "error",
      "as-needed"
    ],
    "@typescript-eslint/member-ordering": [
      "error",
      {"classes": [
        "signature",
        "static-field",
        "instance-field",
        "static-method",

        

        "constructor",
        "instance-method"
      ]}
    ],

    // Any types usage related rules
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/unbound-method": "off",

    // Promise error handling rules
    "@typescript-eslint/no-floating-promises": "off"
  },
  ignorePatterns: ["src/ts/**/*.d.ts"]
}
