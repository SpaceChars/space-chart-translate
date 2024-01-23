"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransplateVuePlugin = void 0;
var index_1 = require("./src/core/index");
var index_2 = __importDefault(require("./src/vue/index"));
exports.TransplateVuePlugin = index_2.default;
exports.default = index_1.TranslateEngine;
