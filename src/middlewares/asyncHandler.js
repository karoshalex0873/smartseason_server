"use strict";
// asyncHandler to handle async errors in Express routes
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.default = asyncHandler;
