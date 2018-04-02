/**
 * @fileoverview Ban specific types from being used
 * @author James Garbutt <https://github.com/43081j>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/ban-types"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    parser: "typescript-eslint-parser"
});

ruleTester.run("ban-types", rule, {
    valid: [
        "var foo: Bar;",
        "const foo: Bar;",
        "let foo: Bar;",

        {
            code: "const foo: Bar;",
            options: [["Foo"]]
        },
        {
            code: "const foo: Bar<A, B>;",
            options: [["C"]]
        },
        {
            code: "new Foo<A>()",
            options: [["B"]]
        },
        {
            code: "foo<A>()",
            options: [["B"]]
        }
    ],

    invalid: [
        {
            code: "const foo: Bar;",
            options: [["Bar"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "Bar",
                        additionalMessage: ""
                    }
                }
            ]
        },
        {
            code: "const foo: Bar;",
            options: [["Bar", "Extra Message"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "Bar",
                        additionalMessage: "Extra Message"
                    }
                }
            ]
        },
        {
            code: "let foo: Bar;",
            options: [["Bar"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "Bar",
                        additionalMessage: ""
                    }
                }
            ]
        },
        {
            code: "let foo: Bar<A, B>;",
            options: [["A"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "A",
                        additionalMessage: ""
                    }
                }
            ]
        },
        {
            code: "let foo: Bar<A, B>;",
            options: [["B"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "A",
                        additionalMessage: ""
                    }
                }
            ]
        },
        {
            code: "let foo: string;",
            options: [["string"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "A",
                        additionalMessage: ""
                    }
                }
            ]
        },
        {
            code: "new Foo<A, B>()",
            options: [["A"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "A",
                        additionalMessage: ""
                    }
                }
            ]
        },
        {
            code: "foo<A, B>()",
            options: [["A"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "A",
                        additionalMessage: ""
                    }
                }
            ]
        },

        {
            code: "const a: Foo; const b: Bar;",
            options: [["Foo"], ["Bar"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "Foo",
                        additionalMessage: ""
                    }
                },
                {
                    messageId: "bannedType",
                    data: {
                        type: "Bar",
                        additionalMessage: ""
                    }
                }
            ]
        },

        {
            code: "function foo(x: A) {}",
            options: [["A"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "A",
                        additionalMessage: ""
                    }
                }
            ]
        },
        {
            code: "function foo(): A {}",
            options: [["A"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "A",
                        additionalMessage: ""
                    }
                }
            ]
        },
        {
            code: "function foo<T = A>() {}",
            options: [["A"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "A",
                        additionalMessage: ""
                    }
                }
            ]
        },

        {
            code: "const foo = function(x: A) {}",
            options: [["A"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "A",
                        additionalMessage: ""
                    }
                }
            ]
        },
        {
            code: "const foo = function(): A {}",
            options: [["A"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "A",
                        additionalMessage: ""
                    }
                }
            ]
        },
        {
            code: "const foo = function<T = A>() {}",
            options: [["A"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "A",
                        additionalMessage: ""
                    }
                }
            ]
        },

        {
            code: "const foo = (x: A) => {}",
            options: [["A"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "A",
                        additionalMessage: ""
                    }
                }
            ]
        },
        {
            code: "const foo = (): A => {}",
            options: [["A"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "A",
                        additionalMessage: ""
                    }
                }
            ]
        },
        {
            code: "const foo: <T = A>() => void;",
            options: [["A"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "A",
                        additionalMessage: ""
                    }
                }
            ]
        },
        {
            code: "const foo: () => A;",
            options: [["A"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "A",
                        additionalMessage: ""
                    }
                }
            ]
        },
        {
            code: "const foo: (x: A) => void;",
            options: [["A"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "A",
                        additionalMessage: ""
                    }
                }
            ]
        },

        {
            code: "class Foo<T = A> {}",
            options: [["A"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "A",
                        additionalMessage: ""
                    }
                }
            ]
        },
        {
            code: "const Foo = class<T = A> {}",
            options: [["A"]],
            errors: [
                {
                    messageId: "bannedType",
                    data: {
                        type: "A",
                        additionalMessage: ""
                    }
                }
            ]
        }
    ]
});
