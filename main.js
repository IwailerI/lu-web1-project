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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
function compileBF(source) {
    var bytecode = [];
    var sourcemap = [];
    var stack = [];
    var j = 0;
    for (var i = 0; i < source.length; i++) {
        var c = source[i];
        if ("<>[],.+-".includes(c)) {
            sourcemap.push(i);
            if (c === "[") {
                stack.push(j);
                bytecode.push(12345); // placeholder
            }
            else if (c === "]") {
                if (stack.length == 0) {
                    return null;
                }
                var idx = stack.pop();
                bytecode[idx] = j;
                bytecode[j] = idx;
            }
            else {
                bytecode.push(c);
            }
            j++;
        }
    }
    if (stack.length > 0) {
        return null;
    }
    return { bytecode: bytecode, sourcemap: sourcemap };
}
function executeInteractive(bytecode, read, step) {
    return __asyncGenerator(this, arguments, function executeInteractive_1() {
        var s_1, i_1, memory, head, lifetime, data, _a, s, char, j;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    step = step !== null && step !== void 0 ? step : (function () { return Promise.resolve(false); });
                    if (read === null) {
                        read = "";
                    }
                    if (typeof read === "string") {
                        s_1 = read;
                        i_1 = 0;
                        read = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, s_1[i_1++]];
                            });
                        }); };
                    }
                    memory = [0];
                    head = 0;
                    lifetime = 1000000;
                    data = { opIdx: 0, memory: memory, head: head };
                    _b.label = 1;
                case 1:
                    if (!(data.opIdx < bytecode.length)) return [3 /*break*/, 16];
                    if (--lifetime < 0)
                        throw "program exceeded 1000000 steps";
                    return [4 /*yield*/, __await(step(data))];
                case 2:
                    if (!_b.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, __await(void 0)];
                case 3: return [2 /*return*/, _b.sent()];
                case 4:
                    _a = bytecode[data.opIdx];
                    switch (_a) {
                        case "+": return [3 /*break*/, 5];
                        case "-": return [3 /*break*/, 6];
                        case ">": return [3 /*break*/, 7];
                        case "<": return [3 /*break*/, 8];
                        case ".": return [3 /*break*/, 9];
                        case ",": return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 14];
                case 5:
                    memory[head] = (memory[head] + 1) % 256;
                    return [3 /*break*/, 15];
                case 6:
                    memory[head] = (memory[head] + 255) % 256; // -1 = 255 mod 256
                    return [3 /*break*/, 15];
                case 7:
                    head++;
                    if (head == memory.length) {
                        memory.push(0);
                    }
                    return [3 /*break*/, 15];
                case 8:
                    head--;
                    if (head < 0)
                        throw "head pointer underflow";
                    return [3 /*break*/, 15];
                case 9: return [4 /*yield*/, __await(memory[head])];
                case 10: // output the value at head
                return [4 /*yield*/, _b.sent()];
                case 11:
                    _b.sent();
                    return [3 /*break*/, 15];
                case 12: return [4 /*yield*/, __await(read(data))];
                case 13:
                    s = _b.sent();
                    if (typeof s == "string") {
                        if (s.length != 1)
                            throw "input string is not a single character";
                        char = s.codePointAt(0);
                        if (char === undefined || char > 0xff)
                            throw "non ascii input";
                        memory[head] = char;
                        return [3 /*break*/, 15];
                    }
                    else { // s is number
                        if (s < 0 || s > 0xff)
                            throw "input number is not a byte";
                        memory[head] = s;
                    }
                    return [3 /*break*/, 15];
                case 14:
                    j = bytecode[data.opIdx];
                    if (j < 0 || j > bytecode.length) {
                        throw "out of bounds jump";
                    }
                    if (j < data.opIdx) {
                        // ] (jump backward)
                        if (memory[head] != 0) {
                            data.opIdx = j;
                        }
                    }
                    else if (j > data.opIdx) {
                        // [ (jump forward)
                        if (memory[head] == 0) {
                            data.opIdx = j;
                        }
                    }
                    else {
                        throw "invalid jump";
                    }
                    _b.label = 15;
                case 15:
                    data.opIdx++;
                    return [3 /*break*/, 1];
                case 16: return [2 /*return*/];
            }
        });
    });
}
function isPrintable(code) {
    return (code >= 0x21 && code <= 0x7e) || code == 0x20;
}
function notInsaneParseInt(s, radix) {
    var ss = s.trim();
    var i = parseInt(s, radix);
    if (i.toString(radix) === s) {
        return i;
    }
    else {
        return NaN;
    }
}
window.addEventListener('load', function () {
    {
        var source = document.getElementById("source");
        source.href = source.href.replace("nk", "nc");
    }
    {
        // This code block is pure JS, no typescript in sight!
        var email_1 = document.getElementById("subscribe-form-email");
        var submit = document.getElementById("subscribe-form-submit");
        var msg_1 = document.getElementById("subscriber-warning");
        submit.addEventListener("click", function (ev) {
            //@ts-ignore
            if (email_1.value === "") {
                msg_1.style.display = "";
                msg_1.textContent = "[email is required]";
                ev.preventDefault();
                //@ts-ignore
            }
            else if (!email_1.value.includes("@")) {
                msg_1.style.display = "";
                msg_1.textContent = "[email format is invalid]";
                ev.preventDefault();
            }
            else {
                msg_1.style.display = "none";
            }
        });
    }
    var syntaxErrorElement = this.document.getElementById("syntax-error");
    var editorElement = this.document.getElementById("editor");
    var readonlyEditorElement = this.document.getElementById("readonly-editor");
    var buttonStep = this.document.getElementById("button-step");
    var buttonStart = this.document.getElementById("button-start");
    var buttonContinue = this.document.getElementById("button-continue");
    var radioText = this.document.getElementById("radio-text");
    var radioHex = this.document.getElementById("radio-hex");
    var radioDecimal = this.document.getElementById("radio-decimal");
    var inputSTDIn = this.document.getElementById("input-stdin");
    var inputSTDOut = this.document.getElementById("input-stdout");
    console.log(inputSTDIn, inputSTDOut);
    var memoryListElement = this.document.getElementById("memory-list");
    var isRunning = false;
    var stepResolve = function () { };
    var stepReject = function () { };
    var stopResolve = function () { };
    var stopReject = function () { };
    var continueResolve = function () { };
    var continueReject = function () { };
    buttonContinue.addEventListener("click", function (ev) {
        ev.preventDefault();
        continueResolve();
    });
    buttonStart.addEventListener("click", function (ev) {
        ev.preventDefault();
        if (isRunning)
            stopResolve();
        else
            runBF(false);
    });
    buttonStep.addEventListener("click", function (ev) {
        ev.preventDefault();
        if (isRunning)
            stepResolve();
        else
            runBF(true);
    });
    buttonStart.addEventListener("click", function (ev) {
        ev.preventDefault();
    });
    buttonStep.addEventListener("click", function (ev) {
        ev.preventDefault();
    });
    inputSTDIn.addEventListener("keydown", function (ev) {
        var _a;
        if (ev.key !== "Enter" || !ev.ctrlKey)
            return;
        ev.stopImmediatePropagation();
        ev.preventDefault();
        //@ts-ignore shut up typescript I know what im doing
        (_a = ev.currentTarget) === null || _a === void 0 ? void 0 : _a.blur();
    });
    function showMessage(msg) {
        if (msg === undefined) {
            syntaxErrorElement.style.display = "none";
        }
        else {
            syntaxErrorElement.style.display = "";
            syntaxErrorElement.innerText = msg;
        }
    }
    function editBF(error) {
        isRunning = false;
        if (error === undefined) {
            syntaxErrorElement.style.display = "none";
        }
        else {
            syntaxErrorElement.style.display = "";
            syntaxErrorElement.innerText = error;
        }
        editorElement.style.display = "";
        readonlyEditorElement.style.display = "none";
        buttonStart.disabled = false;
        buttonStart.innerText = "Start";
        buttonStep.disabled = false;
        buttonContinue.disabled = true;
        radioDecimal.disabled = true;
        radioHex.disabled = true;
        radioText.disabled = true;
        // yay magic
        renderMemory([105, 110, 97, 99, 116, 105, 118, 101], -1, null, Promise.resolve());
        renderStdIO([], [], Promise.resolve(), null);
    }
    editBF();
    function runBF(startPaused) {
        var _this = this;
        // try to compile
        var source = editorElement.value;
        var v = compileBF(source);
        if (v === null || v.bytecode.length == 0) {
            editBF("Your code is not a valid BF program. Check your brackets.");
            return;
        }
        // setup initial state
        isRunning = true;
        var sourcemap = v.sourcemap, bytecode = v.bytecode;
        var isPaused = startPaused;
        var stdinBuffer = [];
        var stdoutBuffer = [];
        var breakpoints = [];
        for (var i = 0; i < bytecode.length; i++) {
            breakpoints.push(false);
        }
        syntaxErrorElement.style.display = "none";
        editorElement.style.display = "none";
        readonlyEditorElement.style.display = "";
        buttonContinue.disabled = false;
        buttonStep.disabled = false;
        buttonStart.innerText = "Stop";
        radioDecimal.disabled = false;
        radioHex.disabled = false;
        radioText.disabled = false;
        var skipToEnd = false;
        var lastIntercept = null;
        if (!isPaused) {
            renderEditor(source, sourcemap, breakpoints, -1, null, Promise.resolve());
            renderMemory([105, 110, 97, 99, 116, 105, 118, 101], -1, null, Promise.resolve());
            renderStdIO([], [], Promise.resolve(), null);
        }
        var read = function (d) { return __awaiter(_this, void 0, void 0, function () {
            var _a, promise, stopInteractivity, _b, stopPromise_1, stopResolveLocal, stopRejectLocal, inputPromise_1, res;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        lastIntercept = d;
                        if (!(stdinBuffer.length == 0)) return [3 /*break*/, 2];
                        buttonContinue.disabled = true;
                        buttonStep.disabled = true;
                        _a = Promise.withResolvers(), promise = _a.promise, stopInteractivity = _a.resolve;
                        _b = Promise.withResolvers(), stopPromise_1 = _b.promise, stopResolveLocal = _b.resolve, stopRejectLocal = _b.reject;
                        stopReject();
                        stopReject = stopRejectLocal;
                        stopResolve = stopResolveLocal;
                        showMessage("Waiting for input...");
                        renderEditor(source, sourcemap, breakpoints, d.opIdx, {
                            setBreakpoint: function (i, b) { return breakpoints[i] = b; },
                            goto: null,
                        }, promise);
                        renderMemory(d.memory, d.head, {
                            setMemory: function (i, v) { return d.memory[i] = v; },
                            setHead: function (i) { return d.head = i; },
                        }, promise);
                        inputPromise_1 = renderStdIO(stdinBuffer, stdoutBuffer, promise, function (d) { return stdinBuffer = d; });
                        return [4 /*yield*/, Promise.race([
                                (function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, stopPromise_1];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, "stop"];
                                    }
                                }); }); })(),
                                (function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, inputPromise_1];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, "input"];
                                    }
                                }); }); })(),
                            ])];
                    case 1:
                        res = _c.sent();
                        showMessage(null);
                        stopInteractivity();
                        buttonContinue.disabled = false;
                        buttonStep.disabled = false;
                        if (res === "stop") {
                            skipToEnd = true; // make the step return immediately
                            return [2 /*return*/, 0]; // let it read the input it wants
                        }
                        _c.label = 2;
                    case 2: return [2 /*return*/, stdinBuffer.splice(0, 1)[0]];
                }
            });
        }); };
        var step = function (d) { return __awaiter(_this, void 0, void 0, function () {
            var _a, promise, stopInteractivity, stopPromise, stepPromise, continuePromise, _b, promise_1, reject, resolve, _c, promise_2, reject, resolve, _d, promise_3, reject, resolve, input;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (skipToEnd)
                            return [2 /*return*/, true];
                        lastIntercept = d;
                        if (breakpoints[d.opIdx]) {
                            isPaused = true;
                        }
                        if (!isPaused) return [3 /*break*/, 2];
                        _a = Promise.withResolvers(), promise = _a.promise, stopInteractivity = _a.resolve;
                        renderMemory(d.memory, d.head, {
                            setMemory: function (i, v) { return d.memory[i] = v; },
                            setHead: function (i) { return d.head = i; },
                        }, promise);
                        renderEditor(source, sourcemap, breakpoints, d.opIdx, {
                            setBreakpoint: function (i, b) { return breakpoints[i] = b; },
                            goto: function (i) { return d.opIdx = i; }
                        }, promise);
                        renderStdIO(stdinBuffer, stdoutBuffer, promise, function (d) { return stdinBuffer = d; });
                        stopPromise = void 0, stepPromise = void 0, continuePromise = void 0;
                        {
                            stopReject();
                            _b = Promise.withResolvers(), promise_1 = _b.promise, reject = _b.reject, resolve = _b.resolve;
                            stopReject = reject;
                            stopResolve = resolve;
                            stopPromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, promise_1];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, "stop"];
                                    }
                                });
                            }); })();
                        }
                        {
                            stepReject();
                            _c = Promise.withResolvers(), promise_2 = _c.promise, reject = _c.reject, resolve = _c.resolve;
                            stepReject = reject;
                            stepResolve = resolve;
                            stepPromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, promise_2];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, "step"];
                                    }
                                });
                            }); })();
                        }
                        {
                            continueReject();
                            _d = Promise.withResolvers(), promise_3 = _d.promise, reject = _d.reject, resolve = _d.resolve;
                            continueReject = reject;
                            continueResolve = resolve;
                            continuePromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, promise_3];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, "continue"];
                                    }
                                });
                            }); })();
                        }
                        return [4 /*yield*/, Promise.race([stopPromise, stepPromise, continuePromise])];
                    case 1:
                        input = _e.sent();
                        // stop all interactivity on the ui
                        stopInteractivity();
                        if (input == "stop") {
                            // we want to exit
                            skipToEnd = true;
                            return [2 /*return*/, true];
                        }
                        else if (input == "continue") {
                            // we want to run to next breakpoint
                            isPaused = false;
                        }
                        _e.label = 2;
                    case 2: return [2 /*return*/, false];
                }
            });
        }); };
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var e, _a, _b, _c, x, e_1_1, error_1, _d, promise, resolve, reject, opIdx;
            var _e, e_1, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        e = undefined;
                        _h.label = 1;
                    case 1:
                        _h.trys.push([1, 14, , 15]);
                        _h.label = 2;
                    case 2:
                        _h.trys.push([2, 7, 8, 13]);
                        _a = true, _b = __asyncValues(executeInteractive(bytecode, read, step));
                        _h.label = 3;
                    case 3: return [4 /*yield*/, _b.next()];
                    case 4:
                        if (!(_c = _h.sent(), _e = _c.done, !_e)) return [3 /*break*/, 6];
                        _g = _c.value;
                        _a = false;
                        x = _g;
                        stdoutBuffer.push(x);
                        _h.label = 5;
                    case 5:
                        _a = true;
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_1_1 = _h.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _h.trys.push([8, , 11, 12]);
                        if (!(!_a && !_e && (_f = _b.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _f.call(_b)];
                    case 9:
                        _h.sent();
                        _h.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        error_1 = _h.sent();
                        e = "Runtime error: ".concat(error_1);
                        showMessage(e);
                        return [3 /*break*/, 15];
                    case 15:
                        if (!!skipToEnd) return [3 /*break*/, 17];
                        // render last state, wait for stop button
                        buttonStart.disabled = false;
                        buttonContinue.disabled = true;
                        buttonStep.disabled = true;
                        _d = Promise.withResolvers(), promise = _d.promise, resolve = _d.resolve, reject = _d.reject;
                        stopReject();
                        opIdx = e === null ? bytecode.length : lastIntercept.opIdx;
                        renderEditor(source, sourcemap, breakpoints, opIdx, null, Promise.resolve());
                        renderMemory(lastIntercept.memory, lastIntercept.head, null, Promise.resolve());
                        renderStdIO(stdinBuffer, stdoutBuffer, promise, null);
                        stopReject = reject;
                        stopResolve = resolve;
                        if (e === undefined) {
                            showMessage("Program finished.");
                        }
                        else {
                            showMessage(e);
                        }
                        return [4 /*yield*/, promise];
                    case 16:
                        _h.sent();
                        _h.label = 17;
                    case 17:
                        console.log("finished!");
                        editBF();
                        return [2 /*return*/];
                }
            });
        }); })();
    }
    function renderEditor(source, sourcemap, breakpoints, current, actions, disableActions) {
        var _this = this;
        var setBreakpoint = actions === null || actions === void 0 ? void 0 : actions.setBreakpoint;
        var goto = function (i) {
            actions === null || actions === void 0 ? void 0 : actions.goto(i);
            current = i; // for local rendering
        };
        if ((actions === null || actions === void 0 ? void 0 : actions.goto) === null)
            goto = null;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, disableActions];
                    case 1:
                        _a.sent();
                        setBreakpoint = null;
                        goto = null;
                        actions = null;
                        render();
                        render = null;
                        return [2 /*return*/];
                }
            });
        }); })();
        var render = function () {
            readonlyEditorElement.innerHTML = "";
            var i = 0;
            var id = 0;
            for (var _i = 0, sourcemap_1 = sourcemap; _i < sourcemap_1.length; _i++) {
                var j = sourcemap_1[_i];
                if (i < j) {
                    readonlyEditorElement.appendChild(document.createTextNode(source.slice(i, j)));
                }
                var span = document.createElement("span");
                span.textContent = source[j];
                span.className = "instruction";
                if (current === id) {
                    span.classList.add("current");
                }
                if (breakpoints[id]) {
                    span.classList.add("breakpoint");
                }
                if (actions !== null) {
                    span.addEventListener("click", (function (idx, wasBP) { return function (ev) {
                        ev.preventDefault();
                        if (ev.ctrlKey) {
                            goto === null || goto === void 0 ? void 0 : goto(idx);
                        }
                        else {
                            setBreakpoint === null || setBreakpoint === void 0 ? void 0 : setBreakpoint(idx, !wasBP);
                        }
                        render === null || render === void 0 ? void 0 : render();
                    }; })(id, breakpoints[id]), { once: true });
                }
                id++;
                readonlyEditorElement.appendChild(span);
                i = j + 1;
            }
            if (i < source.length) {
                readonlyEditorElement.appendChild(document.createTextNode(source.slice(i)));
            }
        };
        render();
    }
    function renderStdIO(stdin, stdout, disableActions, updateStdin) {
        return __awaiter(this, void 0, void 0, function () {
            function validateStdin() {
                var s = inputSTDIn.value;
                if (radioText.checked) {
                    var chars = s.split("").map(function (s) { return s.codePointAt(0); });
                    if (chars.every(function (c) { return c >= 0 || c <= 255; })) {
                        return chars;
                    }
                }
                else if (radioHex.checked) {
                    var words = s.split(" ")
                        .filter(function (w) { return w !== ""; })
                        .map(function (w) { return notInsaneParseInt(w, 16); });
                    if (words.every(function (x) { return !isNaN(x) && x >= 0 && x <= 255; })) {
                        return words;
                    }
                }
                else { // decimal
                    var words = s.split(" ")
                        .filter(function (w) { return w !== ""; })
                        .map(function (w) { return notInsaneParseInt(w, 10); });
                    if (words.every(function (x) { return !isNaN(x) && x >= 0 && x <= 255; })) {
                        return words;
                    }
                }
                return null;
            }
            function renderBuffer(buf) {
                if (radioText.checked) {
                    return String.fromCharCode.apply(String, buf);
                }
                else if (radioHex.checked) {
                    return buf
                        .map(function (x) { return x.toString(16); })
                        .map(function (s) { return s.length == 1 ? "0" + s : s; }) // pad with zeros
                        .join(" ");
                }
                else { // decimal
                    return buf
                        .map(function (x) { return x.toString(10); })
                        .join(" ");
                }
            }
            var _a, promise, resolveWaitForInput, stdInHandler, radioHandler, render;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, disableActions];
                                    case 1:
                                        _a.sent();
                                        updateStdin = null;
                                        render = null;
                                        inputSTDIn.removeEventListener("change", stdInHandler);
                                        radioDecimal.removeEventListener("change", radioHandler);
                                        radioHex.removeEventListener("change", radioHandler);
                                        radioText.removeEventListener("change", radioHandler);
                                        return [2 /*return*/];
                                }
                            });
                        }); })();
                        _a = Promise.withResolvers(), promise = _a.promise, resolveWaitForInput = _a.resolve;
                        stdInHandler = function (ev) {
                            if (updateStdin === null)
                                return;
                            ev.preventDefault();
                            ev.stopImmediatePropagation();
                            var v = validateStdin();
                            if (v !== null) {
                                updateStdin === null || updateStdin === void 0 ? void 0 : updateStdin(v);
                                stdin = v; // for local rendering
                            }
                            render === null || render === void 0 ? void 0 : render();
                            if (stdin.length > 0) {
                                console.log(stdin);
                                resolveWaitForInput();
                            }
                        };
                        radioHandler = function (ev) {
                            ev.preventDefault();
                            ev.stopImmediatePropagation();
                            render === null || render === void 0 ? void 0 : render();
                        };
                        inputSTDIn.addEventListener("change", stdInHandler);
                        radioDecimal.addEventListener("change", radioHandler);
                        radioHex.addEventListener("change", radioHandler);
                        radioText.addEventListener("change", radioHandler);
                        render = function () {
                            inputSTDOut.value = renderBuffer(stdout);
                            inputSTDIn.value = renderBuffer(stdin);
                            inputSTDIn.disabled = updateStdin === null;
                        };
                        render();
                        return [4 /*yield*/, promise];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function renderMemory(memory, head, actions, disableActions) {
        var _this = this;
        var setHead = function (i) {
            head = i; // for local rendering (head will not be updated otherwise)
            actions === null || actions === void 0 ? void 0 : actions.setHead(i);
        };
        if (actions === null)
            setHead = null;
        var setMemory = actions === null || actions === void 0 ? void 0 : actions.setMemory;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, disableActions];
                    case 1:
                        _a.sent();
                        setHead = null;
                        setMemory = null;
                        actions = null;
                        render();
                        render = null;
                        return [2 /*return*/];
                }
            });
        }); })();
        var render = function () {
            var disabled = actions === null;
            memoryListElement.innerHTML = "";
            // index row
            {
                var tr = document.createElement("tr");
                memoryListElement.appendChild(tr);
                var th = document.createElement("th");
                tr.appendChild(th);
                th.innerText = "#";
                for (var i = 0; i < memory.length; i++) {
                    var td = document.createElement("td");
                    tr.appendChild(td);
                    if (i === head) {
                        td.appendChild(document.createTextNode("[".concat(i, "]")));
                    }
                    else {
                        td.appendChild(document.createTextNode("".concat(i)));
                        td.addEventListener("click", (function (idx) { return function (ev) {
                            ev.preventDefault();
                            setHead === null || setHead === void 0 ? void 0 : setHead(idx);
                            render === null || render === void 0 ? void 0 : render();
                        }; })(i), { once: true });
                    }
                }
            }
            // ASCII row
            {
                var tr = document.createElement("tr");
                memoryListElement.appendChild(tr);
                var th = document.createElement("th");
                tr.appendChild(th);
                th.innerText = "ASCII";
                for (var i = 0; i < memory.length; i++) {
                    var td = document.createElement("td");
                    tr.appendChild(td);
                    var input = document.createElement("input");
                    td.appendChild(input);
                    input.type = "text";
                    input.disabled = disabled;
                    if (isPrintable(memory[i])) {
                        input.value = String.fromCharCode(memory[i]);
                    }
                    else {
                        input.value = "<?>";
                        input.className = "invalid-ascii";
                    }
                    input.addEventListener("change", (function (idx) { return function (ev) {
                        ev.preventDefault();
                        var s = ev.currentTarget.value.trim();
                        if (s.length != 1) {
                            render === null || render === void 0 ? void 0 : render();
                            return;
                        }
                        var code = s.codePointAt(0);
                        if (code < 0 || code > 0xff) {
                            render === null || render === void 0 ? void 0 : render();
                            return;
                        }
                        setMemory === null || setMemory === void 0 ? void 0 : setMemory(idx, code);
                        render === null || render === void 0 ? void 0 : render();
                    }; })(i));
                }
            }
            // HEX row
            {
                var tr = document.createElement("tr");
                memoryListElement.appendChild(tr);
                var th = document.createElement("th");
                tr.appendChild(th);
                th.innerText = "HEX";
                for (var i = 0; i < memory.length; i++) {
                    var td = document.createElement("td");
                    tr.appendChild(td);
                    var input = document.createElement("input");
                    td.appendChild(input);
                    input.type = "text";
                    input.disabled = disabled;
                    var hex = memory[i].toString(16);
                    if (hex.length == 1)
                        hex = "0" + hex;
                    input.value = hex;
                    input.addEventListener("change", (function (idx) { return function (ev) {
                        ev.preventDefault();
                        var s = ev.currentTarget.value.trim();
                        var n = notInsaneParseInt(s, 16);
                        if (!isNaN(n) && n >= 0 && n <= 0xff) {
                            setMemory === null || setMemory === void 0 ? void 0 : setMemory(idx, n);
                        }
                        render === null || render === void 0 ? void 0 : render();
                    }; })(i));
                }
            }
            // DEC row
            {
                var tr = document.createElement("tr");
                memoryListElement.appendChild(tr);
                var th = document.createElement("th");
                tr.appendChild(th);
                th.innerText = "DEC";
                for (var i = 0; i < memory.length; i++) {
                    var td = document.createElement("td");
                    tr.appendChild(td);
                    var input = document.createElement("input");
                    td.appendChild(input);
                    input.type = "text";
                    input.disabled = disabled;
                    input.value = memory[i].toString();
                    input.addEventListener("change", (function (idx) { return function (ev) {
                        ev.preventDefault();
                        var s = ev.currentTarget.value.trim();
                        var n = notInsaneParseInt(s, 10);
                        if (!isNaN(n) && n >= 0 && n <= 0xff) {
                            setMemory === null || setMemory === void 0 ? void 0 : setMemory(idx, n);
                        }
                        render === null || render === void 0 ? void 0 : render();
                    }; })(i));
                }
            }
        };
        render();
    }
});
