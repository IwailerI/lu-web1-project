
// number => jump index
type Op = ">" | "<" | "+" | "-" | "." | "," | number;

type InterceptData = { opIdx: number, memory: number[], head: number };
type StepFunc = (InterceptData) => Promise<boolean>; // true = should terminate
type ReadFunc = (InterceptData) => Promise<string | number>;

function compileBF(source: string): { bytecode: Op[], sourcemap: number[] } | null {
    let bytecode: Op[] = []
    let sourcemap: number[] = []
    let stack: number[] = [];
    let j = 0;
    for (let i = 0; i < source.length; i++) {
        const c = source[i];
        if ("<>[],.+-".includes(c)) {
            sourcemap.push(i)
            if (c === "[") {
                stack.push(j);
                bytecode.push(12345) // placeholder
            } else if (c === "]") {
                if (stack.length == 0) {
                    return null;
                }

                let idx = stack.pop();
                bytecode[idx] = j;
                bytecode[j] = idx;
            } else {
                bytecode.push(c as Op);
            }
            j++;
        }
    }

    if (stack.length > 0) {
        return null;
    }

    return { bytecode, sourcemap }
}

async function* executeInteractive(
    bytecode: Op[],
    read: ReadFunc | string | null,
    step: (StepFunc) | null
): AsyncGenerator<number> {
    step = step ?? (() => Promise.resolve(false));

    if (read === null) { read = ""; }

    if (typeof read === "string") {
        const s = read
        let i = 0;
        read = async () => {
            return s[i++];
        }
    }

    let memory: number[] = [0];
    let head = 0;

    let lifetime = 1000000;

    const data = { opIdx: 0, memory, head }

    for (; data.opIdx < bytecode.length; data.opIdx++) {
        if (--lifetime < 0) throw "program exceeded 1000000 steps"

        if (await step(data)) return;

        switch (bytecode[data.opIdx]) {
            case "+": // increment value at head
                memory[head] = (memory[head] + 1) % 256;
                break;
            case "-": // decrement value at head
                memory[head] = (memory[head] + 255) % 256; // -1 = 255 mod 256
                break;
            case ">": // move head right
                head++;
                if (head == memory.length) {
                    memory.push(0)
                }
                break;
            case "<": // move head left
                head--;
                if (head < 0) throw "head pointer underflow";
                break;
            case ".": // output the value at head
                yield memory[head];
                break;
            case ",": // input the value from head
                const s = await read(data);
                if (typeof s == "string") {
                    if (s.length != 1) throw "input string is not a single character";
                    const char = s.codePointAt(0)
                    if (char === undefined || char > 0xff) throw "non ascii input";
                    memory[head] = char;
                    break;
                } else { // s is number
                    if (s < 0 || s > 0xff) throw "input number is not a byte";
                    memory[head] = s
                }
                break;
            default:
                const j = bytecode[data.opIdx] as number;
                if (j < 0 || j > bytecode.length) {
                    throw "out of bounds jump";
                } if (j < data.opIdx) {
                    // ] (jump backward)
                    if (memory[head] != 0) {
                        data.opIdx = j;
                    }
                } else if (j > data.opIdx) {
                    // [ (jump forward)
                    if (memory[head] == 0) {
                        data.opIdx = j;
                    }
                } else {
                    throw "invalid jump";
                }
        }
    }
}

function isPrintable(code: number): boolean {
    return (code >= 0x21 && code <= 0x7e) || code == 0x20;
}

function notInsaneParseInt(s: string, radix: number): number {
    const ss = s.trim()
    const i = parseInt(s, radix)
    if (i.toString(radix) === s) {
        return i;
    } else {
        return NaN;
    }
}

window.addEventListener('load', function () {
    {
        const source = document.getElementById("source") as HTMLLinkElement;
        source.href = source.href.replace("nk", "nc");
    }

    {
        // This code block is pure JS, no typescript in sight!
        const email = document.getElementById("subscribe-form-email")
        const submit = document.getElementById("subscribe-form-submit")
        const msg = document.getElementById("subscriber-warning")

        submit.addEventListener("click", ev => {
            //@ts-ignore
            if (email.value === "") {
                msg.style.display = ""
                msg.textContent = "[email is required]"
                ev.preventDefault()
                //@ts-ignore
            } else if (!email.value.includes("@")) {
                msg.style.display = ""
                msg.textContent = "[email format is invalid]"
                ev.preventDefault()
            } else {
                msg.style.display = "none"
            }
        })
    }

    const syntaxErrorElement = this.document.getElementById("syntax-error") as HTMLParagraphElement
    const editorElement = this.document.getElementById("editor") as HTMLTextAreaElement
    const readonlyEditorElement = this.document.getElementById("readonly-editor") as HTMLPreElement

    const buttonStep = this.document.getElementById("button-step") as HTMLButtonElement
    const buttonStart = this.document.getElementById("button-start") as HTMLButtonElement
    const buttonContinue = this.document.getElementById("button-continue") as HTMLButtonElement

    const radioText = this.document.getElementById("radio-text") as HTMLInputElement
    const radioHex = this.document.getElementById("radio-hex") as HTMLInputElement
    const radioDecimal = this.document.getElementById("radio-decimal") as HTMLInputElement

    const inputSTDIn = this.document.getElementById("input-stdin") as HTMLTextAreaElement
    const inputSTDOut = this.document.getElementById("input-stdout") as HTMLTextAreaElement

    console.log(inputSTDIn, inputSTDOut)

    const memoryListElement = this.document.getElementById("memory-list") as HTMLTableElement

    let isRunning = false;

    let stepResolve = () => { }
    let stepReject = () => { }

    let stopResolve = () => { }
    let stopReject = () => { }

    let continueResolve = () => { }
    let continueReject = () => { }

    buttonContinue.addEventListener("click", ev => {
        ev.preventDefault()
        continueResolve();
    })

    buttonStart.addEventListener("click", ev => {
        ev.preventDefault()
        if (isRunning) stopResolve();
        else runBF(false);
    })

    buttonStep.addEventListener("click", ev => {
        ev.preventDefault()
        if (isRunning) stepResolve();
        else runBF(true);
    })

    buttonStart.addEventListener("click", ev => {
        ev.preventDefault();

    });

    buttonStep.addEventListener("click", ev => {
        ev.preventDefault();

    });

    inputSTDIn.addEventListener("keydown", ev => {
        if (ev.key !== "Enter" || !ev.ctrlKey) return
        ev.stopImmediatePropagation()
        ev.preventDefault();
        //@ts-ignore shut up typescript I know what im doing
        ev.currentTarget?.blur()
    })

    function showMessage(msg: string | null) {
        if (msg === undefined) {
            syntaxErrorElement.style.display = "none";
        } else {
            syntaxErrorElement.style.display = "";
            syntaxErrorElement.innerText = msg;
        }
    }

    function editBF(error?: string) {
        isRunning = false;
        if (error === undefined) {
            syntaxErrorElement.style.display = "none";
        } else {
            syntaxErrorElement.style.display = "";
            syntaxErrorElement.innerText = error;
        }
        editorElement.style.display = ""
        readonlyEditorElement.style.display = "none"
        buttonStart.disabled = false;
        buttonStart.innerText = "Start"
        buttonStep.disabled = false;
        buttonContinue.disabled = true;
        radioDecimal.disabled = true;
        radioHex.disabled = true;
        radioText.disabled = true;
        // yay magic
        renderMemory([105, 110, 97, 99, 116, 105, 118, 101], -1, null, Promise.resolve())
        renderStdIO([], [], Promise.resolve(), null)
    }
    editBF()

    function runBF(startPaused: boolean) {
        // try to compile
        const source = editorElement.value;
        const v = compileBF(source);
        if (v === null || v.bytecode.length == 0) {
            editBF("Your code is not a valid BF program. Check your brackets.")
            return
        }

        // setup initial state
        isRunning = true;
        const { sourcemap, bytecode } = v;

        let isPaused = startPaused;

        let stdinBuffer: number[] = []
        let stdoutBuffer: number[] = []
        let breakpoints: boolean[] = []
        for (let i = 0; i < bytecode.length; i++) {
            breakpoints.push(false);
        }

        syntaxErrorElement.style.display = "none"
        editorElement.style.display = "none"
        readonlyEditorElement.style.display = ""

        buttonContinue.disabled = false;
        buttonStep.disabled = false;
        buttonStart.innerText = "Stop"

        radioDecimal.disabled = false;
        radioHex.disabled = false;
        radioText.disabled = false;

        let skipToEnd = false;
        let lastIntercept: InterceptData | null = null;

        if (!isPaused) {
            renderEditor(source, sourcemap, breakpoints, -1, null, Promise.resolve())
            renderMemory([105, 110, 97, 99, 116, 105, 118, 101], -1, null, Promise.resolve())
            renderStdIO([], [], Promise.resolve(), null)
        }

        const read = async (d: InterceptData) => {
            lastIntercept = d
            if (stdinBuffer.length == 0) {
                buttonContinue.disabled = true;
                buttonStep.disabled = true;
                const { promise, resolve: stopInteractivity } = Promise.withResolvers<void>();

                const { promise: stopPromise, resolve: stopResolveLocal, reject: stopRejectLocal } = Promise.withResolvers<void>();
                stopReject()
                stopReject = stopRejectLocal
                stopResolve = stopResolveLocal

                showMessage("Waiting for input...")

                renderEditor(source, sourcemap, breakpoints, d.opIdx, {
                    setBreakpoint: (i, b) => breakpoints[i] = b,
                    goto: null,
                }, promise)
                renderMemory(d.memory, d.head, {
                    setMemory: (i, v) => d.memory[i] = v,
                    setHead: i => d.head = i,
                }, promise)
                const inputPromise = renderStdIO(stdinBuffer, stdoutBuffer, promise, (d) => stdinBuffer = d);

                const res = await Promise.race([
                    (async () => { await stopPromise; return "stop" })(),
                    (async () => { await inputPromise; return "input" })(),
                ]);

                showMessage(null)
                stopInteractivity()
                buttonContinue.disabled = false;
                buttonStep.disabled = false;

                if (res === "stop") {
                    skipToEnd = true; // make the step return immediately
                    return 0; // let it read the input it wants
                }
            }
            return stdinBuffer.splice(0, 1)[0];
        }

        const step: StepFunc = async (d: InterceptData) => {
            if (skipToEnd) return true;

            lastIntercept = d;

            if (breakpoints[d.opIdx]) {
                isPaused = true;
            }

            if (isPaused) {
                // render current state
                const { promise, resolve: stopInteractivity } = Promise.withResolvers<void>();

                renderMemory(d.memory, d.head, {
                    setMemory: (i, v) => d.memory[i] = v,
                    setHead: i => d.head = i,
                }, promise);
                renderEditor(source, sourcemap, breakpoints, d.opIdx, {
                    setBreakpoint: (i, b) => breakpoints[i] = b,
                    goto: i => d.opIdx = i
                }, promise)
                renderStdIO(stdinBuffer, stdoutBuffer, promise, (d) => stdinBuffer = d)

                // wait for input
                let stopPromise: Promise<string>, stepPromise: Promise<string>, continuePromise: Promise<string>;
                {
                    stopReject()
                    const { promise, reject, resolve } = Promise.withResolvers<void>();
                    stopReject = reject
                    stopResolve = resolve
                    stopPromise = (async () => {
                        await promise;
                        return "stop";
                    })()
                }
                {
                    stepReject()
                    const { promise, reject, resolve } = Promise.withResolvers<void>();
                    stepReject = reject
                    stepResolve = resolve
                    stepPromise = (async () => {
                        await promise;
                        return "step";
                    })()
                }
                {
                    continueReject()
                    const { promise, reject, resolve } = Promise.withResolvers<void>();
                    continueReject = reject
                    continueResolve = resolve
                    continuePromise = (async () => {
                        await promise;
                        return "continue";
                    })()
                }

                const input = await Promise.race([stopPromise, stepPromise, continuePromise]);

                // stop all interactivity on the ui
                stopInteractivity()

                if (input == "stop") {
                    // we want to exit
                    skipToEnd = true;
                    return true;
                } else if (input == "continue") {
                    // we want to run to next breakpoint
                    isPaused = false;
                }
            }

            return false;
        }

        (async () => {
            let e = undefined;
            try {
                for await (let x of executeInteractive(
                    bytecode,
                    read,
                    step,
                )) {
                    stdoutBuffer.push(x)
                }
            } catch (error) {
                e = `Runtime error: ${error}`;
                showMessage(e);
            }

            if (!skipToEnd) {
                // render last state, wait for stop button
                buttonStart.disabled = false;
                buttonContinue.disabled = true;
                buttonStep.disabled = true;
                const { promise, resolve, reject } = Promise.withResolvers<void>();
                stopReject()

                const opIdx = e === null ? bytecode.length : lastIntercept.opIdx;
                renderEditor(source, sourcemap, breakpoints, opIdx, null, Promise.resolve());
                renderMemory(lastIntercept.memory, lastIntercept.head, null, Promise.resolve());
                renderStdIO(stdinBuffer, stdoutBuffer, promise, null)

                stopReject = reject
                stopResolve = resolve

                if (e === undefined) {
                    showMessage("Program finished.")
                } else {
                    showMessage(e)
                }

                await promise
            }

            console.log("finished!")
            editBF()
        })()
    }

    function renderEditor(
        source: string,
        sourcemap: number[],
        breakpoints: boolean[],
        current: number,
        actions: {
            setBreakpoint: (i: number, b: boolean) => void,
            goto: ((i: number) => void) | null,
        } | null,
        disableActions: Promise<void>,
    ) {
        let setBreakpoint = actions?.setBreakpoint;
        let goto = i => {
            actions?.goto(i);
            current = i; // for local rendering
        };
        if (actions?.goto === null) goto = null;

        (async () => {
            await disableActions;
            setBreakpoint = null;
            goto = null;
            actions = null;
            render();
            render = null;
        })()

        let render = () => {
            readonlyEditorElement.innerHTML = "";
            let i = 0;
            let id = 0;
            for (let j of sourcemap) {
                if (i < j) {
                    readonlyEditorElement.appendChild(document.createTextNode(source.slice(i, j)));
                }
                const span = document.createElement("span");
                span.textContent = source[j];
                span.className = "instruction";
                if (current === id) {
                    span.classList.add("current");
                }
                if (breakpoints[id]) {
                    span.classList.add("breakpoint");
                }
                if (actions !== null) {
                    span.addEventListener("click", ((idx, wasBP) => ev => {
                        ev.preventDefault()
                        if (ev.ctrlKey) {
                            goto?.(idx);
                        } else {
                            setBreakpoint?.(idx, !wasBP);
                        }
                        render?.();
                    })(id, breakpoints[id]), { once: true })
                }
                id++;
                readonlyEditorElement.appendChild(span);
                i = j + 1;
            }
            if (i < source.length) {
                readonlyEditorElement.appendChild(document.createTextNode(source.slice(i)))
            }
        }

        render()
    }

    async function renderStdIO(
        stdin: number[],
        stdout: number[],
        disableActions: Promise<void>,
        updateStdin: ((d: number[]) => void) | null,
    ) {
        (async () => {
            await disableActions;
            updateStdin = null;
            render = null;
            inputSTDIn.removeEventListener("change", stdInHandler);
            radioDecimal.removeEventListener("change", radioHandler);
            radioHex.removeEventListener("change", radioHandler);
            radioText.removeEventListener("change", radioHandler);
        })()

        let { promise, resolve: resolveWaitForInput } = Promise.withResolvers<void>();

        function validateStdin(): number[] | null {
            const s = inputSTDIn.value
            if (radioText.checked) {
                const chars = s.split("").map(s => s.codePointAt(0))
                if (chars.every(c => c >= 0 || c <= 255)) {
                    return chars;
                }
            } else if (radioHex.checked) {
                const words = s.split(" ")
                    .filter(w => w !== "")
                    .map(w => notInsaneParseInt(w, 16))
                if (words.every(x => !isNaN(x) && x >= 0 && x <= 255)) {
                    return words;
                }
            } else { // decimal
                const words = s.split(" ")
                    .filter(w => w !== "")
                    .map(w => notInsaneParseInt(w, 10))
                if (words.every(x => !isNaN(x) && x >= 0 && x <= 255)) {
                    return words;
                }
            }
            return null;
        }

        function renderBuffer(buf: number[]): string {
            if (radioText.checked) {
                return String.fromCharCode(...buf);
            } else if (radioHex.checked) {
                return buf
                    .map(x => x.toString(16))
                    .map(s => s.length == 1 ? "0" + s : s) // pad with zeros
                    .join(" ")
            } else { // decimal
                return buf
                    .map(x => x.toString(10))
                    .join(" ")
            }
        }

        const stdInHandler = (ev: Event) => {
            if (updateStdin === null) return;
            ev.preventDefault()
            ev.stopImmediatePropagation()
            const v = validateStdin();
            if (v !== null) {
                updateStdin?.(v)
                stdin = v; // for local rendering
            }
            render?.();
            if (stdin.length > 0) {
                console.log(stdin)
                resolveWaitForInput()
            }
        };

        const radioHandler = (ev: Event) => {
            ev.preventDefault()
            ev.stopImmediatePropagation()

            render?.();
        }

        inputSTDIn.addEventListener("change", stdInHandler);
        radioDecimal.addEventListener("change", radioHandler);
        radioHex.addEventListener("change", radioHandler);
        radioText.addEventListener("change", radioHandler);

        let render = () => {
            inputSTDOut.value = renderBuffer(stdout);
            inputSTDIn.value = renderBuffer(stdin);
            inputSTDIn.disabled = updateStdin === null;
        }

        render()

        await promise;
    }

    function renderMemory(
        memory: number[],
        head: number,
        actions: {
            setMemory: (i: number, v: number) => void,
            setHead: (i: number) => void,
        } | null,
        disableActions: Promise<void>,
    ) {
        let setHead = (i) => {
            head = i; // for local rendering (head will not be updated otherwise)
            actions?.setHead(i);
        };
        if (actions === null) setHead = null;

        let setMemory = actions?.setMemory;

        (async () => {
            await disableActions;
            setHead = null;
            setMemory = null;
            actions = null;
            render();
            render = null;
        })()

        let render = () => {
            const disabled = actions === null;

            memoryListElement.innerHTML = ""
            // index row
            {
                const tr = document.createElement("tr");
                memoryListElement.appendChild(tr)

                const th = document.createElement("th");
                tr.appendChild(th)
                th.innerText = "#"

                for (let i = 0; i < memory.length; i++) {
                    const td = document.createElement("td");
                    tr.appendChild(td)

                    if (i === head) {
                        td.appendChild(document.createTextNode(`[${i}]`));
                    } else {
                        td.appendChild(document.createTextNode(`${i}`));
                        td.addEventListener("click", (idx => ev => {
                            ev.preventDefault()
                            setHead?.(idx)
                            render?.()
                        })(i), { once: true });
                    }
                }
            }

            // ASCII row
            {
                const tr = document.createElement("tr");
                memoryListElement.appendChild(tr)

                const th = document.createElement("th");
                tr.appendChild(th)
                th.innerText = "ASCII"

                for (let i = 0; i < memory.length; i++) {
                    const td = document.createElement("td");
                    tr.appendChild(td)

                    const input = document.createElement("input")
                    td.appendChild(input)
                    input.type = "text";
                    input.disabled = disabled;

                    if (isPrintable(memory[i])) {
                        input.value = String.fromCharCode(memory[i]);
                    } else {
                        input.value = "<?>"
                        input.className = "invalid-ascii";
                    }

                    input.addEventListener("change", (idx => ev => {
                        ev.preventDefault();
                        const s = (ev.currentTarget as HTMLInputElement).value.trim();
                        if (s.length != 1) {
                            render?.();
                            return
                        }
                        const code = s.codePointAt(0)
                        if (code < 0 || code > 0xff) {
                            render?.();
                            return
                        }
                        setMemory?.(idx, code);
                        render?.();
                    })(i))
                }
            }

            // HEX row
            {
                const tr = document.createElement("tr");
                memoryListElement.appendChild(tr)

                const th = document.createElement("th");
                tr.appendChild(th)
                th.innerText = "HEX"

                for (let i = 0; i < memory.length; i++) {
                    const td = document.createElement("td");
                    tr.appendChild(td)

                    const input = document.createElement("input")
                    td.appendChild(input)
                    input.type = "text";
                    input.disabled = disabled;

                    let hex = memory[i].toString(16)
                    if (hex.length == 1) hex = "0" + hex;
                    input.value = hex

                    input.addEventListener("change", (idx => ev => {
                        ev.preventDefault();
                        const s = (ev.currentTarget as HTMLInputElement).value.trim();
                        const n = notInsaneParseInt(s, 16)
                        if (!isNaN(n) && n >= 0 && n <= 0xff) {
                            setMemory?.(idx, n);
                        }
                        render?.();
                    })(i))
                }
            }

            // DEC row
            {
                const tr = document.createElement("tr");
                memoryListElement.appendChild(tr)

                const th = document.createElement("th");
                tr.appendChild(th)
                th.innerText = "DEC"

                for (let i = 0; i < memory.length; i++) {
                    const td = document.createElement("td");
                    tr.appendChild(td)

                    const input = document.createElement("input")
                    td.appendChild(input)
                    input.type = "text";
                    input.disabled = disabled;

                    input.value = memory[i].toString()

                    input.addEventListener("change", (idx => ev => {
                        ev.preventDefault();
                        const s = (ev.currentTarget as HTMLInputElement).value.trim();
                        const n = notInsaneParseInt(s, 10)
                        if (!isNaN(n) && n >= 0 && n <= 0xff) {
                            setMemory?.(idx, n);
                        }
                        render?.();
                    })(i))
                }
            }
        }

        render();
    }
})