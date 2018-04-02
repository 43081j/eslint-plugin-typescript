# Ban specific types from being used (ban-types)

This rule can be used to ban specific types from being used.

## Rule Details

Examples of **incorrect** code for this rule:

```ts
/*eslint ban-types: ["error", ["Object"]]*/
let foo: Object;

```

Examples of **correct** code for this rule:

```ts
/*eslint ban-types: ["error", ["Object"]]*/
let foo: string;
```

## When Not To Use It

You should turn off this rule if you do not care about type usage restrictions.
