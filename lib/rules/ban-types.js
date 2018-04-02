/**
 * @fileoverview Ban specific types from being used
 * @author James Garbutt <https://github.com/43081j>
 */
"use strict";

const util = require("../util");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "Ban specific types from being used",
            extraDescription: [util.tslintRule("ban-types")],
            category: "Best Practices",
            recommended: false,
            url:
                "https://github.com/nzakas/eslint-plugin-typescript/blob/master/docs/rules/ban-types.md"
        },
        schema: {
            type: "array",
            items: {
                type: "array",
                items: [
                    {
                        type: "string"
                    },
                    {
                        type: "string"
                    }
                ],
                minItems: 1
            }
        },
        messages: {
            bannedType: "Don't use {{ type }} as a type.{{ additionalMessage }}"
        }
    },

    create(context) {
        const bannedTypes = [];

        if (context.options) {
            for (const option of context.options) {
                bannedTypes.push({
                    message: option[1] || "",
                    pattern: new RegExp(`^${option[0]}$`)
                });
            }
        }

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * Check if a type is valid
         * @param {ASTNode} node type annotation node
         * @returns {void}
         */
        function checkType(node) {
            const type = node.name;

            if (typeof type === "string") {
                for (const banned of bannedTypes) {
                    if (banned.pattern.test(type)) {
                        context.report({
                            node,
                            messageId: "bannedType",
                            data: {
                                type,
                                additionalMessage: banned.message
                            }
                        });
                    }
                }
            }
        }

        /**
         * Visits a given type parameter instantiation
         * @param {ASTNode} node the node to visit
         * @returns {void}
         */
        function visitTypeParameterInstantiation(node) {
            if (node.params) {
                node.params.forEach(checkType);
            }
        }

        /**
         * Visits a given type parameter
         * @param {ASTNode} node the node to visit
         * @returns {void}
         */
        function visitTypeParameterDeclaration(node) {
            if (node.params) {
                node.params.forEach(param => {
                    if (param.type === "TypeParameter" && param.default) {
                        checkType(param.default);
                    }
                });
            }
        }

        /**
         * Visits a given type annotation
         * @param {ASTNode} node the node to visit
         * @returns {void}
         */
        function visitTypeAnnotation(node) {
            const annotation = node.typeAnnotation;

            if (annotation.type === "TSFunctionType") {
                if (annotation.typeParameters) {
                    visitTypeParameterDeclaration(annotation.typeParameters);
                }
                return;
            }

            if (annotation.type === "TSTypeReference") {
                if (annotation.typeParameters) {
                    visitTypeParameterInstantiation(annotation.typeParameters);
                }

                checkType(node.typeName);
                return;
            }

            checkType(annotation);
        }

        /**
         * Visits a given VariableDeclarator
         * @param {ASTNode} node the node to visit
         * @returns {void}
         */
        function visitVariableDeclarator(node) {
            if (!node.id || !node.id.typeAnnotation) {
                return;
            }
            visitTypeAnnotation(node.id.typeAnnotation);
        }

        /**
         * Visits a given FunctionDeclaration or FunctionExpression
         * @param {ASTNode} node the node to visit
         * @returns {void}
         */
        function visitFunction(node) {
            if (node.returnType) {
                visitTypeAnnotation(node.returnType);
            }

            if (node.typeParameters) {
                visitTypeParameterDeclaration(node.typeParameters);
            }

            if (node.params) {
                node.params.forEach(param => {
                    if (param.typeAnnotation) {
                        visitTypeAnnotation(param.typeAnnotation);
                    }
                });
            }
        }

        /**
         * Visits a given ExpressionStatement
         * @param {ASTNode} node the node to visit
         * @returns {void}
         */
        function visitClass(node) {
            if (node.typeParameters) {
                visitTypeParameterDeclaration(node.typeParameters);
            }
        }

        /**
         * Visits a given ExpressionStatement
         * @param {ASTNode} node the node to visit
         * @returns {void}
         */
        function visitExpressionStatement(node) {
            if (!node.expression || !node.expression.typeParameters) {
                return;
            }
            visitTypeParameterInstantiation(node.expression.typeParameters);
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            VariableDeclarator: visitVariableDeclarator,
            FunctionDeclaration: visitFunction,
            FunctionExpression: visitFunction,
            ArrowFunctionExpression: visitFunction,
            ClassDeclaration: visitClass,
            ClassExpression: visitClass,
            ExpressionStatement: visitExpressionStatement
        };
    }
};
