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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.router = void 0;
/* istanbul ignore file */
var fs_1 = require("fs");
var express_1 = require("express");
var router = (0, express_1.Router)();
exports.router = router;
var debug = false;
var getWebPath = function (file) {
    return file.replace('index.ts', '').replace('_middleware.ts', '').replace('.ts', '');
};
// Cache middlewares
var middlewares = [];
var isMiddleware = function (file) { return file === '_middleware.ts'; };
var getMiddlewares = function (path) {
    return middlewares.length > 0 ? middlewares.filter(function (e) { return path === getWebPath(e.path); })[0] : null;
};
var loadAllFile = function (dir) { return __awaiter(void 0, void 0, void 0, function () {
    var files, _i, files_1, file, pathToFile, absolutePath, webPath, global_1, middlewareToThisWebPath, tempMid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                files = (0, fs_1.readdirSync)(dir);
                _i = 0, files_1 = files;
                _a.label = 1;
            case 1:
                if (!(_i < files_1.length)) return [3 /*break*/, 4];
                file = files_1[_i];
                pathToFile = "".concat(dir, "/").concat(file);
                absolutePath = pathToFile.split('api')[1].slice(1);
                webPath = getWebPath(absolutePath);
                // Verify if file is a directory
                if ((0, fs_1.lstatSync)("".concat(pathToFile)).isDirectory()) {
                    loadAllFile("".concat(pathToFile));
                    return [3 /*break*/, 3];
                }
                // Exceptions
                // Tests
                if (file.includes('.spec.') || file.includes('.spec.'))
                    return [3 /*break*/, 3];
                // Services
                if (!isMiddleware(file) && file.startsWith('_'))
                    return [3 /*break*/, 3];
                return [4 /*yield*/, Promise.resolve().then(function () { return require(process.cwd() + "/src/api/".concat(absolutePath)); })];
            case 2:
                global_1 = _a.sent();
                middlewareToThisWebPath = getMiddlewares(webPath);
                // Add middleware to cache
                if (isMiddleware(file) && global_1.middleware) {
                    tempMid = {
                        middleware: global_1.middleware,
                        path: webPath
                    };
                    middlewares.push(tempMid);
                    if (debug)
                        console.log("Middleware - ".concat(file, " - ").concat(webPath));
                    return [3 /*break*/, 3];
                }
                // Set middleware to this web path
                if (!isMiddleware(file) && !!middlewareToThisWebPath) {
                    router.use(webPath, middlewareToThisWebPath.middleware);
                    if (debug)
                        console.log("Add Middleware to route - ".concat(file, " - ").concat(webPath));
                }
                if (debug)
                    console.log("Route - ".concat(file, " - ").concat(webPath));
                // Methods
                if (global_1.getMethod)
                    router.get(webPath, global_1.getMethod);
                if (global_1.postMethod)
                    router.post(webPath, global_1.postMethod);
                if (global_1.putMethod)
                    router.put(webPath, global_1.putMethod);
                if (global_1.deleteMethod)
                    router["delete"](webPath, global_1.deleteMethod);
                if (global_1.headMethod)
                    router.head(webPath, global_1.headMethod);
                if (global_1.patchMethod)
                    router.patch(webPath, global_1.patchMethod);
                if (global_1.optionsMethod)
                    router.options(webPath, global_1.optionsMethod);
                if (global_1.allMethods)
                    router.all(webPath, global_1.allMethods);
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
loadAllFile('./src/api');
