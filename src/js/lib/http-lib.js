"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.http = void 0;
const MAX_WAIT = 5000;
function http({ url, method = 'GET', body = null }) {
    return __awaiter(this, void 0, void 0, function* () {
        method = method.toUpperCase();
        let controller = new AbortController(), signal = controller.signal, options = { method, signal };
        if (method === 'POST' || method === 'PUT') {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify(body);
        }
        try {
            setTimeout(() => controller.abort(), MAX_WAIT);
            const response = yield fetch(url, options);
            if (!response.ok)
                throw new Error('Rejected request');
            if (method === 'GET') {
                return { data: yield response.json(), error: null };
            }
            return { data: null, error: null };
        }
        catch (error) {
            return { data: null, error: error.message };
        }
    });
}
exports.http = http;
