
// ==========================================
// BERCOUNTING - NUMERICAL INTEGRATION
// ==========================================


// Membaca fungsi matematika
function evaluateFunction(expression, x) {
    return math.evaluate(expression, { x: x });
}


// Mengubah fungsi Math.js menjadi LaTeX
function convertToLatex(expression) {
    return math.parse(expression).toTex({
        parenthesis: "keep"
    });
}


// Mengatur tampilan angka desimal
function formatNumber(value) {
    return Number(value.toFixed(6)).toString();
}


// Membuat baris tabel perhitungan
function createRows(a, h, n, f, weights = null) {
    const rows = [];

    for (let i = 0; i <= n; i++) {
        const x = a + i * h;
        const y = f(x);

        const row = [
            i,
            formatNumber(x),
            formatNumber(y)
        ];

        if (weights !== null) {
            row.push(weights[i]);
        }

        rows.push(row);
    }

    return rows;
}


// ==========================================
// 1. RIEMANN SUM - LEFT ENDPOINT
// ==========================================


function riemannSum(f, a, b, n) {
    const h = (b - a) / n;
    let sum = 0;
    const points = [];

    for (let i = 0; i < n; i++) {
        const x = a + i * h;
        const y = f(x);

        points.push([
            i,
            formatNumber(x),
            formatNumber(y)
        ]);

        sum += y;
    }

    const result = sum * h;

    return {
        result: result,
        steps: [
            {
                title: "Calculate the interval width",
                formula: String.raw`h = \frac{b-a}{n}`,
                calculation: String.raw`
                    h = \frac{${b}-${a}}{${n}}
                    = ${formatNumber(h)}
                `
            },
            {
                title: "Determine the left endpoints",
                formula: String.raw`x_i = a + ih`,
                calculation: String.raw`
                    x_i = ${a} + i(${formatNumber(h)})
                `
            },
            {
                title: "Evaluate the function",
                formula: String.raw`f(x_i) = f(a+ih)`,
                headers: ["i", "xᵢ", "f(xᵢ)"],
                rows: points
            },
            {
                title: "Calculate the sum of function values",
                formula: String.raw`
                    \sum_{i=0}^{n-1} f(x_i)
                `,
                calculation: String.raw`
                    \sum f(x_i) = ${formatNumber(sum)}
                `
            },
            {
                title: "Calculate the Riemann Sum",
                formula: String.raw`
                    R_n = h \sum_{i=0}^{n-1} f(x_i)
                `,
                calculation: String.raw`
                    R_n = ${formatNumber(h)}
                    \times ${formatNumber(sum)}
                `,
                result: result
            }
        ]
    };
}



// ==========================================
// 2. TRAPEZOIDAL RULE
// ==========================================


function trapezoidalRule(f, a, b, n) {
    const h = (b - a) / n;

    let sumInterior = 0;

    const points = createRows(a, h, n, f);

    for (let i = 1; i < n; i++) {
        sumInterior += f(a + i * h);
    }

    const endpointSum = (f(a) + f(b)) / 2;
    const total = endpointSum + sumInterior;
    const result = h * total;

    return {
        result: result,
        steps: [
            {
                title: "Calculate the interval width",
                formula: String.raw`h = \frac{b-a}{n}`,
                calculation: String.raw`
                    h = \frac{${b}-${a}}{${n}}
                    = ${formatNumber(h)}
                `
            },
            {
                title: "Determine the evaluation points",
                formula: String.raw`x_i = a + ih`,
                calculation: String.raw`
                    x_i = ${a} + i(${formatNumber(h)})
                `
            },
            {
                title: "Evaluate the function",
                formula: String.raw`f(x_i) = f(a+ih)`,
                headers: ["i", "xᵢ", "f(xᵢ)"],
                rows: points
            },
            {
                title: "Calculate the weighted sum",
                formula: String.raw`
                    \frac{f(a)+f(b)}{2}
                    + \sum_{i=1}^{n-1}f(x_i)
                `,
                calculation: String.raw`
                    \frac{${formatNumber(f(a))}+${formatNumber(f(b))}}{2}
                    + ${formatNumber(sumInterior)}
                    = ${formatNumber(total)}
                `
            },
            {
                title: "Calculate the Trapezoidal Approximation",
                formula: String.raw`
                    T_n = h \left[
                    \frac{f(a)+f(b)}{2}
                    + \sum_{i=1}^{n-1}f(x_i)
                    \right]
                `,
                calculation: String.raw`
                    T_n = ${formatNumber(h)}
                    \times ${formatNumber(total)}
                `,
                result: result
            }
        ]
    };
}



// ==========================================
// 3. SIMPSON'S RULE
// ==========================================


function simpsonRule(f, a, b, n) {
    if (n % 2 !== 0) {
        throw new Error(
            "Simpson's Rule requires an even number of subintervals."
        );
    }

    const h = (b - a) / n;

    let sumOdd = 0;
    let sumEven = 0;

    const weights = [];

    for (let i = 0; i <= n; i++) {
        if (i === 0 || i === n) {
            weights.push(1);
        } else if (i % 2 === 0) {
            weights.push(2);
        } else {
            weights.push(4);
        }
    }

    const points = createRows(a, h, n, f, weights);

    for (let i = 1; i < n; i++) {
        const y = f(a + i * h);

        if (i % 2 === 0) {
            sumEven += y;
        } else {
            sumOdd += y;
        }
    }

    const endpointSum = f(a) + f(b);

    const weightedSum =
        endpointSum + 4 * sumOdd + 2 * sumEven;

    const result = (h / 3) * weightedSum;

    return {
        result: result,
        steps: [
            {
                title: "Calculate the interval width",
                formula: String.raw`h = \frac{b-a}{n}`,
                calculation: String.raw`
                    h = \frac{${b}-${a}}{${n}}
                    = ${formatNumber(h)}
                `
            },
            {
                title: "Determine the evaluation points",
                formula: String.raw`x_i = a + ih`,
                calculation: String.raw`
                    x_i = ${a} + i(${formatNumber(h)})
                `
            },
            {
                title: "Evaluate the function and assign coefficients",
                formula: String.raw`
                    1,\ 4,\ 2,\ 4,\ \ldots,\ 2,\ 4,\ 1
                `,
                headers: ["i", "xᵢ", "f(xᵢ)", "Coefficient"],
                rows: points
            },
            {
                title: "Calculate the weighted sum",
                formula: String.raw`
                    f(a)+f(b)
                    +4\sum_{\text{odd }i}f(x_i)
                    +2\sum_{\text{even }i}f(x_i)
                `,
                calculation: String.raw`
                    ${formatNumber(endpointSum)}
                    +4(${formatNumber(sumOdd)})
                    +2(${formatNumber(sumEven)})
                    = ${formatNumber(weightedSum)}
                `
            },
            {
                title: "Calculate the Simpson's Approximation",
                formula: String.raw`
                    S_n = \frac{h}{3}
                    \left[
                    f(a)+f(b)
                    +4\sum_{\text{odd }i}f(x_i)
                    +2\sum_{\text{even }i}f(x_i)
                    \right]
                `,
                calculation: String.raw`
                    S_n = \frac{${formatNumber(h)}}{3}
                    \times ${formatNumber(weightedSum)}
                `,
                result: result
            }
        ]
    };
}


// ==========================================
// 4. DISPLAY CALCULATION RESULTS
// ==========================================

function calculateIntegral() {
    const expression =
        document.getElementById("function").value;

    const a =
        Number(document.getElementById("lower").value);

    const b =
        Number(document.getElementById("upper").value);

    const n =
        Number(document.getElementById("intervals").value);

    const method =
        document.getElementById("method").value;

    const resultBox =
        document.getElementById("result");

    try {
        if (!expression.trim()) {
            throw new Error("Please enter a mathematical function.");
        }

        if (!Number.isFinite(a) || !Number.isFinite(b) || a >= b) {
            throw new Error(
                "Please enter valid integration limits (a < b)."
            );
        }

        if (!Number.isInteger(n) || n < 2) {
            throw new Error(
                "Number of subintervals must be an integer of at least 2."
            );
        }

        const f = (x) => evaluateFunction(expression, x);

        // Memastikan fungsi dapat diubah menjadi LaTeX
        const functionLatex = convertToLatex(expression);

        let calculation;

        if (method === "riemann") {
            calculation = riemannSum(f, a, b, n);
        } else if (method === "trapezoidal") {
            calculation = trapezoidalRule(f, a, b, n);
        } else if (method === "simpson") {
            calculation = simpsonRule(f, a, b, n);
        } else {
            throw new Error("Please select a valid numerical method.");
        }

        const result = calculation.result;

        if (!Number.isFinite(result)) {
            throw new Error(
                "The calculation produced an invalid result."
            );
        }

        const methodNames = {
            riemann: "Riemann Sum (Left Endpoint)",
            trapezoidal: "Trapezoidal Rule",
            simpson: "Simpson's Rule"
        };

        resultBox.innerHTML = `
            <div class="result-summary">
                <h3>Calculation Result</h3>

                <p>Function:</p>
                <div class="math-display">
                    \\[f(x) = ${functionLatex}\\]
                </div>

                <p>Interval:</p>
                <div class="math-display">
                    \\[ [${a}, ${b}] \\]
                </div>

                <p>Method: ${methodNames[method]}</p>

                <div class="final-result">
                    \\[${formatNumber(result)}\\]
                </div>
            </div>

            <div class="calculation-steps">
                <h3>Calculation Process</h3>

                ${calculation.steps.map((step, index) => `
                    <div class="step-card">

                        <div class="step-heading">
                            <span class="step-number">
                                ${String(index + 1).padStart(2, "0")}
                            </span>

                            <h4>${step.title}</h4>
                        </div>

                        ${step.formula ? `
                            <div class="step-formula">
                                \\[${step.formula}\\]
                            </div>
                        ` : ""}

                        ${step.calculation ? `
                            <div class="step-calculation">
                                \\[${step.calculation}\\]
                            </div>
                        ` : ""}

                        ${step.rows ? `
                            <div class="step-table">
                                <table>
                                    <thead>
                                        <tr>
                                            ${step.headers.map(header =>
                                                `<th>${header}</th>`
                                            ).join("")}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        ${step.rows.map(row => `
                                            <tr>
                                                ${row.map(value =>
                                                    `<td>${value}</td>`
                                                ).join("")}
                                            </tr>
                                        `).join("")}
                                    </tbody>
                                </table>
                            </div>
                        ` : ""}

                        ${step.result !== undefined ? `
                            <div class="step-final">
                                Final Result:
                                \\[${formatNumber(step.result)}\\]
                            </div>
                        ` : ""}

                    </div>
                `).join("")}
            </div>
        `;

        // Merender seluruh rumus menggunakan MathJax
        if (window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise([resultBox]);
        }

    } catch (error) {
        resultBox.innerHTML = `
            <div class="result-summary">
                <h3>Calculation Error</h3>
                <p style="color: #e53935;">
                    ${error.message}
                </p>
            </div>
        `;
    }
}
// ==========================================
// DIFFERENTIATION - DERIVATIVE CALCULATOR
// ==========================================



// ==========================================
// DIFFERENTIATION - DERIVATIVE CALCULATOR
// ==========================================

// ==========================================
// DIFFERENTIATION - DERIVATIVE CALCULATOR
// ==========================================

// Membuang kurung terluar pada node
function unwrap(node) {
    while (node.isParenthesisNode) {
        node = node.content;
    }
    return node;
}

// Menyederhanakan ekspresi: coba bentuk polinom terjabar dulu,
// jika gagal (mis. ada sin, exp, dll.) pakai simplify biasa
function tidy(node) {
    try {
        return math.simplify(math.rationalize(node));
    } catch (e) {
        return math.simplify(node);
    }
}

function ordinalSuffix(number) {
    if (number % 100 >= 11 && number % 100 <= 13) return "th";
    switch (number % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

function derivativeNotation(order) {
    return order <= 3 ? "f" + "'".repeat(order) + "(x)" : `f^{(${order})}(x)`;
}
// Notasi turunan ke-n (n = 0 berarti fungsi asal)
function prevNotation(order) {
    return order === 0 ? "f(x)" : derivativeNotation(order);
}

// Membuat kartu langkah lengkap untuk satu kali turunan pada bentuk N / v^k
// Mengembalikan { html, num, k, latex }
function quotientStepCard(i, num, den, k, denDerivative) {

    const numDerivative = tidy(math.derivative(num, "x"));
    const kCoef = k > 1 ? `${k}` : "";

    // Pembilang baru (sudah disederhanakan)
    const newNum = tidy(math.parse(
        `(${numDerivative.toString()})*(${den.toString()})` +
        ` - ${k}*(${num.toString()})*(${denDerivative.toString()})`
    ));

    const newK = k + 1;
    const oldDenTex = k > 1
        ? `\\left(${den.toTex()}\\right)^{${k}}`
        : `\\left(${den.toTex()}\\right)`;
    const newDenTex = `\\left(${den.toTex()}\\right)^{${newK}}`;
    const latex = `\\frac{${newNum.toTex()}}{${newDenTex}}`;

    const html = `
        <div class="step-card">
            <h4>Step ${i} — ${i}${ordinalSuffix(i)} Derivative</h4>

            <p>Current function:</p>
            \\[
                ${prevNotation(i - 1)} = \\frac{${num.toTex()}}{${oldDenTex}}
            \\]

            <p>Let the numerator be \\(N(x)\\) and the base of the denominator be \\(v(x)\\):</p>
            \\[ N(x) = ${num.toTex()} \\]
            \\[ v(x) = ${den.toTex()} \\]

            <p>Differentiate both:</p>
            \\[ N'(x) = ${numDerivative.toTex()} \\]
            \\[ v'(x) = ${denDerivative.toTex()} \\]

            <p>Apply the Quotient Rule (denominator power ${k}):</p>
            \\[
                ${derivativeNotation(i)} =
                \\frac{N'(x)\\,v(x) - ${kCoef}\\,N(x)\\,v'(x)}{v(x)^{${newK}}}
            \\]

            <p>Substitute:</p>
            \\[
                ${derivativeNotation(i)} = \\frac{
                    \\left(${numDerivative.toTex()}\\right)\\left(${den.toTex()}\\right)
                    - ${kCoef}\\left(${num.toTex()}\\right)\\left(${denDerivative.toTex()}\\right)
                }{${newDenTex}}
            \\]

            <p>Simplify the numerator:</p>
            \\[
                ${derivativeNotation(i)} = ${latex}
            \\]
        </div>
    `;

    return { html, num: newNum, k: newK, latex };
}

function calculateDerivative() {

    const expression = document.getElementById("function").value.trim();
    const method = Number(document.getElementById("method").value);
    const result = document.getElementById("result");

    try {

        if (expression === "") {
            throw new Error("Please enter a mathematical function.");
        }

        if (!Number.isInteger(method) || method < 1 || method > 5) {
            throw new Error("Please select a derivative order from 1 to 5.");
        }

        const originalFunction = math.parse(expression);
        const functionNode = unwrap(originalFunction);

        const isQuotient =
            functionNode.isOperatorNode &&
            functionNode.op === "/" &&
            functionNode.args.length === 2;

        let steps = `
            <div class="result-summary">
                <h3>Calculation Result</h3>

                <div class="step-card">
                    <h4>Original Function</h4>
                    \\[
                        f(x) = ${originalFunction.toTex()}
                    \\]
                </div>
        `;

        let finalLatex;

        // ==========================================
        // QUOTIENT RULE
        // ==========================================
       

            if (isQuotient) {

            let num = unwrap(functionNode.args[0]);
            const den = unwrap(functionNode.args[1]);
            const denDerivative = tidy(math.derivative(den, "x"));
            let k = 1;

            // Kartu pengantar: identifikasi u, v dan rumus umum
            steps += `
                <div class="step-card">
                    <h4>Quotient Rule</h4>

                    <p>Identify the numerator and denominator:</p>
                    \\[ u(x) = ${num.toTex()} \\]
                    \\[ v(x) = ${den.toTex()} \\]

                    <p>First derivative formula:</p>
                    \\[
                        f'(x) = \\frac{u'(x)v(x)-u(x)v'(x)}{v(x)^2}
                    \\]

                    <p>
                        After each derivative the result has the form
                        \\( \\dfrac{N}{v^k} \\), so the next derivative uses:
                    </p>
                    \\[
                        \\left(\\frac{N}{v^k}\\right)' =
                        \\frac{N'v - kNv'}{v^{k+1}}
                    \\]
                </div>
            `;

            // Turunan ke-1 sampai ke-n, masing-masing dengan langkah lengkap
            for (let i = 1; i <= method; i++) {
                const step = quotientStepCard(i, num, den, k, denDerivative);
                steps += step.html;
                num = step.num;
                k = step.k;
                finalLatex = step.latex;
            }

        } else {
            let currentDerivative = originalFunction;

            for (let i = 1; i <= method; i++) {

                currentDerivative = math.simplify(
                    math.derivative(currentDerivative, "x")
                );

                steps += `
                    <div class="step-card">
                        <h4>Step ${i} — ${i}${ordinalSuffix(i)} Derivative</h4>
                        \\[
                            ${derivativeNotation(i)} = ${currentDerivative.toTex()}
                        \\]
                    </div>
                `;
            }

            finalLatex = currentDerivative.toTex();
        }

        // ==========================================
        // FINAL RESULT
        // ==========================================
        steps += `
            <div class="final-result">
                <h4>Final Result</h4>
                \\[
                    ${derivativeNotation(method)} = ${finalLatex}
                \\]
            </div>
            </div>
        `;

        result.innerHTML = steps;

        if (window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise([result]);
        }

    } catch (error) {

        result.innerHTML = `
            <div class="result-summary">
                <h3>Calculation Error</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}
// ==========================================
// DIFFERENTIAL EQUATIONS - SOLVER
// (aktif hanya di halaman yang punya #equation)
// ==========================================
(function () {

    /* ---------- HELPERS ---------- */
    const S = s => math.parse(s);

    function clean(node) {
        try { return math.simplify(node); } catch (e) { return node; }
    }

    function dependsOn(node, v) {
        let found = false;
        node.traverse((n, path, parent) => {
            if (n.isSymbolNode && n.name === v &&
                !(parent && parent.isFunctionNode && parent.fn === n)) found = true;
        });
        return found;
    }

    function substitute(node, name, value) {
        return node.transform(n =>
            (n.isSymbolNode && n.name === name) ? new math.ConstantNode(value) : n
        );
    }

    // e^u  ->  exp(u)  (supaya integrator hanya mengenal satu bentuk)
    function normalize(node) {
        return node.transform(n => {
            if (n.isOperatorNode && n.fn === "pow" &&
                unwrap(n.args[0]).isSymbolNode && unwrap(n.args[0]).name === "e") {
                return new math.FunctionNode("exp", [n.args[1]]);
            }
            return n;
        });
    }

    function checkSymbols(node) {
        node.traverse((n, path, parent) => {
            if (n.isSymbolNode && !(parent && parent.isFunctionNode && parent.fn === n)) {
                if (!["x", "y", "yp", "e", "pi"].includes(n.name)) {
                    throw new Error(`Unknown symbol "${n.name}". Use only x and y.`);
                }
            }
        });
    }

    const fmt  = v => String(parseFloat(Number(v).toPrecision(10)));
    const wrap = v => `(${fmt(v)})`;
    const signed = v => (v < 0 ? `- ${fmt(-v)}` : `+ ${fmt(v)}`);

    /* ---------- LaTeX & HTML ---------- */
    function tex(node) {
        return node.transform(n =>
            (n.isFunctionNode && n.fn.name === "exp")
                ? new math.OperatorNode("^", "pow", [new math.SymbolNode("e"), n.args[0]])
                : n
        ).toTex({ parenthesis: "auto" });
    }

    function texW(node) {
        const u = unwrap(node);
        const t = tex(node);
        return (u.isOperatorNode && (u.fn === "add" || u.fn === "subtract"))
            ? `\\left(${t}\\right)` : t;
    }

    const eq   = t => `\\[${t}\\]`;
    const note = t => `<p>${t}</p>`;
    const card = (title, body) =>
        `<div class="step-card"><h4>${title}</h4>${body}</div>`;

    function icCard(ic, C) {
        if (!isFinite(C)) {
            throw new Error("The initial condition is outside the domain of the solution.");
        }
        return card("Apply the Initial Condition",
            note(`Substitute x = ${fmt(ic.x)} and y = ${fmt(ic.y)} into the solution and solve for C:`) +
            eq(`C = ${fmt(C)}`));
    }

    /* ==========================================================
       MINI SYMBOLIC INTEGRATOR  (math.js tidak punya integral)
       ========================================================== */
    function linearCoef(node, v) {
        try {
            const d = math.simplify(math.derivative(node, v));
            return dependsOn(d, v) ? null : d;
        } catch (e) { return null; }
    }

    function isPoly(n, v) {
        let d = n;
        for (let i = 0; i < 8; i++) {
            if (!dependsOn(d, v)) return true;
            d = math.simplify(math.derivative(d, v));
        }
        return false;
    }

    function polyCoeffs(node, v) {
        try {
            const d1 = math.derivative(node, v);
            const d2 = math.derivative(d1, v);
            const d3 = math.derivative(d2, v);
            if (dependsOn(d3, v) || Math.abs(Number(d3.evaluate())) > 1e-12) return null;
            const c = [node, d1, d2].map(n => Number(n.evaluate({ [v]: 0 })));
            c[2] = c[2] / 2;
            return c.every(isFinite) ? c : null;
        } catch (e) { return null; }
    }

    function tryParts(A, B, v) {
        const b = unwrap(B);
        const okFn = b.isFunctionNode &&
            ["exp", "sin", "cos", "sinh", "cosh"].includes(b.fn.name) &&
            linearCoef(b.args[0], v);
        if (!okFn || !dependsOn(A, v) || !isPoly(A, v)) return null;

        const F = integ(b, v);
        if (!F) return null;
        const dA = math.simplify(math.derivative(A, v));
        const rest = integ(S(`(${dA})*(${F})`), v);
        if (!rest) return null;
        return S(`(${A})*(${F})-(${rest})`);
    }

    function integrate(node, v) { return integ(normalize(node), v); }

    function integ(node, v, expanded) {
        const r = integBase(node, v);
        if (r) return r;
        if (!expanded) {
            try {
                const ex = unwrap(math.rationalize(node));
                if (ex.toString() !== unwrap(node).toString()) return integ(ex, v, true);
            } catch (e) { /* tidak bisa dijabarkan */ }
        }
        return null;
    }

    function integBase(node, v) {
        node = unwrap(node);
        if (!dependsOn(node, v)) return S(`(${node})*${v}`);
        if (node.isSymbolNode) return S(`${v}^2/2`);

        if (node.isFunctionNode) {
            const name = node.fn.name;
            const arg = node.args[0];
            const k = linearCoef(arg, v);
            if (!k) return null;
            switch (name) {
                case "exp":  return S(`exp(${arg})/(${k})`);
                case "sin":  return S(`-cos(${arg})/(${k})`);
                case "cos":  return S(`sin(${arg})/(${k})`);
                case "tan":  return S(`-log(abs(cos(${arg})))/(${k})`);
                case "sinh": return S(`cosh(${arg})/(${k})`);
                case "cosh": return S(`sinh(${arg})/(${k})`);
                case "sqrt": return S(`2/3*(${arg})^(3/2)/(${k})`);
                case "log":  return S(`((${arg})*log(${arg})-(${arg}))/(${k})`);
                default:     return null;
            }
        }

        if (!node.isOperatorNode) return null;
        const [a, b] = node.args;

        switch (node.fn) {

            case "unaryMinus": {
                const r = integ(a, v);
                return r && S(`-(${r})`);
            }

            case "add": case "subtract": {
                const ra = integ(a, v), rb = integ(b, v);
                if (!ra || !rb) return null;
                return S(`(${ra})${node.fn === "add" ? "+" : "-"}(${rb})`);
            }

            case "multiply": {
                if (!dependsOn(a, v)) { const r = integ(b, v); return r && S(`(${a})*(${r})`); }
                if (!dependsOn(b, v)) { const r = integ(a, v); return r && S(`(${b})*(${r})`); }
                return tryParts(a, b, v) || tryParts(b, a, v);
            }

            case "divide": {
                if (!dependsOn(b, v)) { const r = integ(a, v); return r && S(`(${r})/(${b})`); }
                const den = unwrap(b);

                if (!dependsOn(a, v)) {
                    const k = linearCoef(den, v);
                    if (k) return S(`(${a})/(${k})*log(abs(${den}))`);

                    if (den.isOperatorNode && den.fn === "pow" && !dependsOn(den.args[1], v)) {
                        return integ(S(`(${a})*(${den.args[0]})^(-(${den.args[1]}))`), v);
                    }
                    if (den.isFunctionNode && den.fn.name === "exp") {
                        return integ(S(`(${a})*exp(-(${den.args[0]}))`), v);
                    }
                    const c = polyCoeffs(den, v);
                    if (c && Math.abs(c[1]) < 1e-12 && c[0] > 0 && c[2] > 0) {
                        return S(`(${a})/sqrt(${fmt(c[0] * c[2])})*atan(sqrt(${fmt(c[2] / c[0])})*${v})`);
                    }
                }

                // bentuk f'/f
                try {
                    const dd = math.derivative(den, v);
                    const ratio = clean(S(`(${a})/(${dd})`));
                    if (!dependsOn(ratio, v)) return S(`(${ratio})*log(abs(${den}))`);
                } catch (e) { /* lanjut */ }
                return null;
            }

            case "pow": {
                if (!dependsOn(b, v)) {
                    let n;
                    try { n = Number(b.evaluate()); } catch (e) { return null; }
                    if (!isFinite(n)) return null;
                    const base = unwrap(a);
                    const k = (base.isSymbolNode && base.name === v) ? S("1") : linearCoef(base, v);
                    if (!k) return null;
                    if (Math.abs(n + 1) < 1e-12) return S(`log(abs(${base}))/(${k})`);
                    return S(`(${base})^((${b})+1)/(((${b})+1)*(${k}))`);
                }
                if (!dependsOn(a, v)) {
                    const k = linearCoef(b, v);
                    if (k) return S(`(${a})^(${b})/((${k})*log(${a}))`);
                }
                return null;
            }
        }
        return null;
    }

    /* ==========================================================
       PARSE PERSAMAAN  ->  dy/dx = rhs(x, y)
       ========================================================== */
    function parseEquation(text) {
        const s = text.replace(/\s+/g, "")
                      .replace(/dy\/dx/gi, "(yp)")
                      .replace(/y['′’]/g, "(yp)");
        const sides = s.split("=");
        if (sides.length !== 2 || !sides[0] || !sides[1]) {
            throw new Error('Enter an equation with exactly one "=" sign, e.g. dy/dx = 2*x.');
        }

        const F = S(`(${sides[0]})-(${sides[1]})`);
        checkSymbols(F);
        if (!dependsOn(F, "yp")) throw new Error("The equation must contain dy/dx (or y').");

        const A = clean(math.derivative(F, "yp"));
        if (dependsOn(A, "yp")) {
            throw new Error("Only first-order equations that are linear in dy/dx are supported.");
        }
        const F0 = substitute(F, "yp", 0);
        return clean(S(`-(${F0})/(${A})`));
    }

    /* ==========================================================
       METODE 1 : SEPARABLE
       ========================================================== */
    function splitXY(node) {
        node = unwrap(node);
        const dx = dependsOn(node, "x"), dy = dependsOn(node, "y");
        if (!dy) return { g: node, h: S("1") };
        if (!dx) return { g: S("1"), h: node };

        if (node.isFunctionNode && node.fn.name === "exp") {
            const arg = unwrap(node.args[0]);
            if (arg.isOperatorNode && (arg.fn === "add" || arg.fn === "subtract")) {
                const p = splitXY(S(`exp(${arg.args[0]})`));
                const q = splitXY(S(arg.fn === "add" ? `exp(${arg.args[1]})` : `exp(-(${arg.args[1]}))`));
                return p && q && { g: S(`(${p.g})*(${q.g})`), h: S(`(${p.h})*(${q.h})`) };
            }
        }

        if (node.isOperatorNode) {
            const [a, b] = node.args;
            switch (node.fn) {
                case "unaryMinus": {
                    const p = splitXY(a);
                    return p && { g: S(`-(${p.g})`), h: p.h };
                }
                case "multiply": {
                    const p = splitXY(a), q = splitXY(b);
                    return p && q && { g: S(`(${p.g})*(${q.g})`), h: S(`(${p.h})*(${q.h})`) };
                }
                case "divide": {
                    const p = splitXY(a), q = splitXY(b);
                    return p && q && { g: S(`(${p.g})/(${q.g})`), h: S(`(${p.h})/(${q.h})`) };
                }
                case "pow":
                    if (!dependsOn(b, "x") && !dependsOn(b, "y")) {
                        const p = splitXY(a);
                        return p && { g: S(`(${p.g})^(${b})`), h: S(`(${p.h})^(${b})`) };
                    }
            }
        }
        return null;
    }

    function linearInfo(h) {
        const d = linearCoef(h, "y");
        if (!d || dependsOn(d, "x")) return null;
        try {
            const a = Number(d.evaluate());
            const b = Number(substitute(h, "y", 0).evaluate());
            if (isFinite(a) && isFinite(b) && a !== 0) return { a, b };
        } catch (e) { /* bukan linear numerik */ }
        return null;
    }

    function powerInfo(h) {
        const u = unwrap(h);
        if (u.isOperatorNode && u.fn === "pow" &&
            unwrap(u.args[0]).isSymbolNode && unwrap(u.args[0]).name === "y" &&
            !dependsOn(u.args[1], "y") && !dependsOn(u.args[1], "x")) {
            const n = Number(u.args[1].evaluate());
            if (isFinite(n) && Math.abs(n - 1) > 1e-12) return { n };
        }
        return null;
    }

    function solveSeparable(rhs, ic) {
        const cards = [];
        const parts = splitXY(normalize(rhs));
        if (!parts) {
            throw new Error("This equation is not separable: dy/dx cannot be written as g(x)·h(y).");
        }
        const g = clean(parts.g);
        const h = clean(parts.h);
        if (dependsOn(g, "y") || dependsOn(h, "x")) throw new Error("This equation is not separable.");

        const hIsOne = h.toString() === "1";
        const constH = !dependsOn(h, "y");

        // Langkah 1 : pisahkan variabel
        cards.push(card("Separate the Variables",
            note("Write the right-hand side as a product of a function of x and a function of y:") +
            eq("\\frac{dy}{dx} = g(x)\\,h(y)") +
            eq(`g(x) = ${tex(g)} \\qquad h(y) = ${tex(h)}`) +
            note("Move all y terms to the left and all x terms to the right:") +
            eq(hIsOne ? `dy = ${tex(g)}\\,dx`
                      : `\\frac{1}{${tex(h)}}\\,dy = ${tex(g)}\\,dx`) +
            (constH ? "" : note("Note: dividing by h(y) assumes h(y) ≠ 0. Any constant y with h(y) = 0 is also a solution."))
        ));

        // Langkah 2 : integralkan
        const R = integrate(g, "x");
        const L = constH ? clean(S(`y/(${h})`)) : integrate(S(`1/(${h})`), "y");
        if (!R || !L) throw new Error("Sorry, this integral is not supported by the solver yet.");
        const Rc = clean(R), Lc = clean(L);

        cards.push(card("Integrate Both Sides",
            eq(hIsOne ? `\\int dy = \\int ${tex(g)}\\,dx`
                      : `\\int \\frac{1}{${tex(h)}}\\,dy = \\int ${tex(g)}\\,dx`) +
            eq(`${tex(Lc)} = ${tex(Rc)} + C`)
        ));

        // Langkah 3 : selesaikan untuk y
        const lin = constH ? null : linearInfo(h);
        const pw  = (constH || lin) ? null : powerInfo(h);
        let finalTex;

        if (constH) {
            const hv = Number(h.evaluate());
            const general = tex(clean(S(`(${h})*((${Rc})+C)`)));
            cards.push(card("Solve for y", eq(`y = ${general}`)));
            finalTex = `y = ${general}`;
            if (ic) {
                const C = ic.y / hv - Number(Rc.evaluate({ x: ic.x }));
                cards.push(icCard(ic, C));
                finalTex = `y = ${tex(clean(S(`(${h})*((${Rc})+${wrap(C)})`)))}`;
            }

        } else if (lin) {
            const { a, b } = lin;
            const ex = clean(S(`exp((${fmt(a)})*(${Rc}))`));
            const general = tex(clean(S(`(K*exp((${fmt(a)})*(${Rc}))-(${fmt(b)}))/(${fmt(a)})`)));
            cards.push(card("Solve for y",
                note("Since h(y) is linear in y, exponentiate both sides and absorb the constant into K (K = ±e<sup>aC</sup>):") +
                eq(`${tex(h)} = K\\,${tex(ex)}`) +
                eq(`y = ${general}`)));
            finalTex = `y = ${general}`;
            if (ic) {
                const K = (a * ic.y + b) * Math.exp(-a * Number(Rc.evaluate({ x: ic.x })));
                cards.push(card("Apply the Initial Condition",
                    note(`Substitute x = ${fmt(ic.x)} and y = ${fmt(ic.y)} and solve for K:`) +
                    eq(`K = ${fmt(K)}`)));
                if (!isFinite(K)) throw new Error("The initial condition is outside the domain of the solution.");
                finalTex = `y = ${tex(clean(S(`(${wrap(K)}*exp((${fmt(a)})*(${Rc}))-(${fmt(b)}))/(${fmt(a)})`)))}`;
            }

        } else if (pw) {
            const m = 1 - pw.n;
            const general = tex(clean(S(`((${fmt(m)})*((${Rc})+C))^(1/(${fmt(m)}))`)));
            cards.push(card("Solve for y", eq(`y = ${general}`)));
            finalTex = `y = ${general}`;
            if (ic) {
                const C = Math.pow(ic.y, m) / m - Number(Rc.evaluate({ x: ic.x }));
                cards.push(icCard(ic, C));
                finalTex = `y = ${tex(clean(S(`((${fmt(m)})*((${Rc})+${wrap(C)}))^(1/(${fmt(m)}))`)))}`;
            }

        } else {
            cards.push(card("Implicit Solution",
                note("y cannot be isolated in a simple closed form, so the solution is left in implicit form.")));
            finalTex = `${tex(Lc)} = ${tex(Rc)} + C`;
            if (ic) {
                const C = Number(Lc.evaluate({ y: ic.y })) - Number(Rc.evaluate({ x: ic.x }));
                cards.push(icCard(ic, C));
                finalTex = `${tex(Lc)} = ${tex(Rc)} ${signed(C)}`;
            }
        }

        return { cards, finalTex };
    }

    /* ==========================================================
       METODE 2 : FIRST-ORDER LINEAR   y' + P(x) y = Q(x)
       ========================================================== */
    function expOf(I) {
        const t = unwrap(I.transform(n => (n.isFunctionNode && n.fn.name === "abs") ? n.args[0] : n));
        const isLog = n => { n = unwrap(n); return n.isFunctionNode && n.fn.name === "log"; };

        if (isLog(t)) return unwrap(t).args[0];
        if (t.isOperatorNode && t.fn === "multiply") {
            const [a, b] = t.args;
            if (isLog(b) && !dependsOn(a, "x")) return clean(S(`(${unwrap(b).args[0]})^(${a})`));
            if (isLog(a) && !dependsOn(b, "x")) return clean(S(`(${unwrap(a).args[0]})^(${b})`));
        }
        return clean(S(`exp(${t})`));
    }

    function solveLinear(rhs, ic) {
        const cards = [];

        const dY = clean(math.derivative(rhs, "y"));
        if (dependsOn(dY, "y")) throw new Error("This equation is not linear in y.");
        const P = clean(S(`-(${dY})`));
        const Q = clean(substitute(rhs, "y", 0));

        // Langkah 1 : bentuk standar
        cards.push(card("Standard Form",
            note("Write the equation as") +
            eq("\\frac{dy}{dx} + P(x)\\,y = Q(x)") +
            eq(`P(x) = ${tex(P)} \\qquad Q(x) = ${tex(Q)}`)));

        // Langkah 2 : faktor integrasi
        const I0 = integrate(P, "x");
        if (!I0) throw new Error("Sorry, ∫P(x)dx is not supported by the solver yet.");
        const I  = clean(I0);
        const mu = expOf(I);
        cards.push(card("Integrating Factor",
            eq("\\mu(x) = e^{\\int P(x)\\,dx}") +
            eq(`\\int P(x)\\,dx = ${tex(I)}`) +
            eq(`\\mu(x) = ${tex(mu)}`) +
            (I.toString().includes("abs") ? note("(Taking the argument of the logarithm as positive.)") : "")));

        // Langkah 3 : kalikan
        const prod = clean(S(`(${mu})*(${Q})`));
        cards.push(card("Multiply Both Sides by μ(x)",
            note("The left side becomes the derivative of a product:") +
            eq("\\frac{d}{dx}\\left[\\mu(x)\\,y\\right] = \\mu(x)\\,Q(x)") +
            eq(`\\frac{d}{dx}\\left[${texW(mu)}\\,y\\right] = ${tex(prod)}`)));

        // Langkah 4 : integralkan
        const J0 = integrate(prod, "x");
        if (!J0) throw new Error("Sorry, ∫μ(x)Q(x)dx is not supported by the solver yet.");
        const J = clean(J0);
        cards.push(card("Integrate Both Sides",
            eq(`${texW(mu)}\\,y = \\int ${tex(prod)}\\,dx`) +
            eq(`${texW(mu)}\\,y = ${tex(J)} + C`)));

        // Langkah 5 : selesaikan untuk y
        cards.push(card("Solve for y",
            eq(`y = \\frac{${tex(J)} + C}{${tex(mu)}}`)));

        let finalTex = `y = \\frac{${tex(J)} + C}{${tex(mu)}}`;

        if (ic) {
            const muX = Number(mu.evaluate({ x: ic.x }));
            const JX  = Number(J.evaluate({ x: ic.x }));
            const C   = muX * ic.y - JX;
            if (!isFinite(C)) throw new Error("The initial condition is outside the domain of the solution.");
            cards.push(card("Apply the Initial Condition",
                note(`Substitute x = ${fmt(ic.x)} and y = ${fmt(ic.y)}:`) +
                eq(`C = \\mu(${fmt(ic.x)})\\cdot ${fmt(ic.y)} - \\left(${tex(J)}\\right)\\Big|_{x=${fmt(ic.x)}} = ${fmt(C)}`)));
            finalTex = Math.abs(C) < 1e-12
                ? `y = \\frac{${tex(J)}}{${tex(mu)}}`
                : `y = \\frac{${tex(J)} ${signed(C)}}{${tex(mu)}}`;
        }

        return { cards, finalTex };
    }

    /* ==========================================================
       INISIALISASI HALAMAN (hanya jika elemen-elemennya ada)
       ========================================================== */
    function initDifferentialPage() {

        const equationInput   = document.getElementById("equation");
        const solveButton     = document.querySelector(".solve-button");
        const solutionSection = document.getElementById("solution-section");
        const resultBox       = document.getElementById("solution-result");

        // Bukan halaman persamaan diferensial -> keluar tanpa error
        if (!equationInput || !solveButton || !solutionSection || !resultBox) return;

        // Pilihan metode
        const methodCards = document.querySelectorAll(".method-card");
        methodCards.forEach(card => {
            card.addEventListener("click", () => {
                methodCards.forEach(item => {
                    item.classList.remove("active");
                    item.setAttribute("aria-pressed", "false");
                });
                card.classList.add("active");
                card.setAttribute("aria-pressed", "true");
            });
        });

        // Tombol Solve
        solveButton.addEventListener("click", () => {

            const text = equationInput.value.trim();
            const xs   = document.getElementById("initial-x").value.trim();
            const ys   = document.getElementById("initial-y").value.trim();

            if (text === "") {
                alert("Please enter a differential equation.");
                return;
            }
            if ((xs === "") !== (ys === "")) {
                alert("Fill in both Initial x and Initial y, or leave both empty.");
                return;
            }

            const ic = xs === "" ? null : { x: Number(xs), y: Number(ys) };
            const method = document.querySelector(".method-card.active").dataset.method;

            let html;
            try {
                const rhs = parseEquation(text);
                const out = method === "linear" ? solveLinear(rhs, ic) : solveSeparable(rhs, ic);

                html = `<div class="result-summary">` + out.cards.join("") +
                       `<div class="final-result"><h4>Final Result</h4>${eq(out.finalTex)}</div></div>`;
            } catch (err) {
                const msg = String(err.message).replace(/</g, "&lt;");
                html = card("Calculation Error", note(msg));
            }

            resultBox.classList.remove("solution-placeholder");
            resultBox.classList.add("solution-output");
            resultBox.innerHTML = html;

            solutionSection.hidden = false;

            if (window.MathJax && MathJax.typesetPromise) {
                MathJax.typesetPromise([resultBox]);
            }
            solutionSection.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initDifferentialPage);
    } else {
        initDifferentialPage();
    }

})();
// ==========================================
// LINEAR ALGEBRA - MATRIX CALCULATOR
// (aktif hanya di halaman yang punya #matrix-a)
// ==========================================
(function () {

    const MAX_SIZE = 6;

    /* ---------- HELPERS ---------- */
    const F = v => math.fraction(v);
    const isZero = f => f.n === 0;
    const copy = M => M.map(r => r.slice());

    // Pecahan -> LaTeX
    function ft(v) {
        const f = math.fraction(v);
        const neg = f.s < 0 && f.n !== 0;
        const body = f.d === 1 ? `${f.n}` : `\\frac{${f.n}}{${f.d}}`;
        return (neg ? "-" : "") + body;
    }

    // Matriks -> LaTeX (split = jumlah kolom kiri untuk matriks augmented)
    function texM(M, split) {
        const cols = M[0].length;
        const body = M.map(r =>
            r.map(v => (typeof v === "string" ? v : ft(v))).join(" & ")
        ).join(" \\\\ ");
        if (split == null) return `\\begin{bmatrix}${body}\\end{bmatrix}`;
        return `\\left[\\begin{array}{${"c".repeat(split)}|${"c".repeat(cols - split)}}${body}\\end{array}\\right]`;
    }

    const eq   = t => `\\[${t}\\]`;
    const note = t => `<p>${t}</p>`;
    const card = (title, body) =>
        `<div class="step-card"><h4>${title}</h4>${body}</div>`;

    const stepCard = (k, op, M, split) =>
        card(`Step ${k}`, eq(op) + eq(texM(M, split)));

    // R_i <- R_i - m R_r
    function opSub(i, r, m) {
        const neg = m.s < 0;
        const a = math.abs(m);
        const c = a.equals(1) ? "" : ft(a);
        return `R_{${i + 1}} \\leftarrow R_{${i + 1}} ${neg ? "+" : "-"} ${c}R_{${r + 1}}`;
    }

    // Kombinasi linear: r + sum(c * nama)
    function linComb(r, terms) {
        let s = isZero(r) ? "" : ft(r);
        for (const t of terms) {
            if (isZero(t.c)) continue;
            const neg = t.c.s < 0;
            const a = math.abs(t.c);
            const body = `${a.equals(1) ? "" : ft(a)}${t.name}`;
            s += s === "" ? (neg ? "-" : "") + body : (neg ? " - " : " + ") + body;
        }
        return s || "0";
    }

    /* ---------- PARSING ---------- */
    function parseMatrix(text, name) {
        const rows = text.trim().split(/\n|;/).map(r => r.trim()).filter(Boolean);
        if (rows.length === 0) throw new Error(`Please enter ${name}.`);

        const M = rows.map(r =>
            r.split(/[\s,]+/).filter(Boolean).map(tok => {
                try { return math.fraction(tok); }
                catch (e) { throw new Error(`"${tok}" in ${name} is not a valid number.`); }
            })
        );

        const w = M[0].length;
        if (M.some(r => r.length !== w)) {
            throw new Error(`Every row of ${name} must have the same number of entries.`);
        }
        if (M.length > MAX_SIZE || w > MAX_SIZE) {
            throw new Error(`${name} may be at most ${MAX_SIZE} × ${MAX_SIZE}.`);
        }
        return M;
    }

    /* ---------- GAUSS-JORDAN ----------
       Mereduksi M menjadi RREF. 'limit' = jumlah kolom koefisien
       (kolom augmented tidak dipakai sebagai pivot). */
    function rref(A, limit, split, log) {
        const M = copy(A);
        const rows = M.length;
        const pivots = [];
        let r = 0;
        let k = 0;

        const record = op => log.push(stepCard(++k, op, M, split));

        for (let c = 0; c < limit && r < rows; c++) {

            let p = -1;
            for (let i = r; i < rows; i++) {
                if (!isZero(M[i][c])) { p = i; break; }
            }
            if (p < 0) continue;

            if (p !== r) {
                [M[p], M[r]] = [M[r], M[p]];
                record(`R_{${r + 1}} \\leftrightarrow R_{${p + 1}}`);
            }

            const piv = M[r][c];
            if (!piv.equals(1)) {
                M[r] = M[r].map(v => math.divide(v, piv));
                record(`R_{${r + 1}} \\leftarrow \\left(${ft(math.divide(F(1), piv))}\\right)R_{${r + 1}}`);
            }

            for (let i = 0; i < rows; i++) {
                if (i === r || isZero(M[i][c])) continue;
                const m = M[i][c];
                M[i] = M[i].map((v, j) => math.subtract(v, math.multiply(m, M[r][j])));
                record(opSub(i, r, m));
            }

            pivots.push(c);
            r++;
        }
        return { M, pivots };
    }

    /* ==========================================================
       1. DETERMINANT
       ========================================================== */
    function solveDeterminant(A) {
        const n = A.length;
        if (n !== A[0].length) throw new Error("The determinant needs a square matrix.");

        const cards = [card("Matrix", eq(`A = ${texM(A)}`))];

        if (n === 1) {
            return { cards, finalTex: `\\det A = ${ft(A[0][0])}` };
        }

        if (n === 2) {
            const [a, b] = A[0];
            const [c, d] = A[1];
            const det = math.subtract(math.multiply(a, d), math.multiply(b, c));
            cards.push(card("2 × 2 Formula",
                eq("\\det A = ad - bc") +
                eq(`\\det A = (${ft(a)})(${ft(d)}) - (${ft(b)})(${ft(c)}) = ${ft(det)}`)));
            return { cards, finalTex: `\\det A = ${ft(det)}` };
        }

        cards.push(card("Strategy", note(
            "Reduce A to an upper triangular matrix. Swapping two rows flips the sign " +
            "of the determinant, while adding a multiple of one row to another does not " +
            "change it. The determinant is then the product of the diagonal entries.")));

        const M = copy(A);
        let swaps = 0;
        let k = 0;

        for (let c = 0; c < n; c++) {

            let p = -1;
            for (let i = c; i < n; i++) {
                if (!isZero(M[i][c])) { p = i; break; }
            }
            if (p < 0) {
                cards.push(card("Zero Column", note(
                    `Column ${c + 1} has no nonzero entry on or below the diagonal, so the determinant is 0.`)));
                return { cards, finalTex: "\\det A = 0" };
            }

            if (p !== c) {
                [M[p], M[c]] = [M[c], M[p]];
                swaps++;
                cards.push(stepCard(++k, `R_{${c + 1}} \\leftrightarrow R_{${p + 1}}`, M));
            }

            for (let i = c + 1; i < n; i++) {
                if (isZero(M[i][c])) continue;
                const m = math.divide(M[i][c], M[c][c]);
                M[i] = M[i].map((v, j) => math.subtract(v, math.multiply(m, M[c][j])));
                cards.push(stepCard(++k, opSub(i, c, m), M));
            }
        }

        let det = F(swaps % 2 === 0 ? 1 : -1);
        for (let i = 0; i < n; i++) det = math.multiply(det, M[i][i]);

        const diag = M.map((r, i) => `\\left(${ft(r[i])}\\right)`).join(" \\cdot ");
        cards.push(card("Multiply the Diagonal",
            eq(`\\det A = (-1)^{${swaps}} \\cdot ${diag} = ${ft(det)}`)));

        return { cards, finalTex: `\\det A = ${ft(det)}` };
    }

    /* ==========================================================
       2. INVERSE
       ========================================================== */
    function solveInverse(A) {
        const n = A.length;
        if (n !== A[0].length) throw new Error("Only square matrices have an inverse.");

        const aug = A.map((r, i) =>
            r.concat(Array.from({ length: n }, (_, j) => F(i === j ? 1 : 0))));

        const cards = [
            card("Augmented Matrix", note("Write A next to the identity matrix:") +
                eq(`[\\,A \\mid I\\,] = ${texM(aug, n)}`)),
        ];

        const { M, pivots } = rref(aug, n, n, cards);

        if (pivots.length < n) {
            cards.push(card("Not Invertible", note(
                "The left block cannot be reduced to the identity matrix (a row of zeros appears), " +
                "so det(A) = 0 and A has no inverse.")));
            return { cards, finalTex: "\\text{A is singular: } A^{-1} \\text{ does not exist}" };
        }

        const inv = M.map(r => r.slice(n));
        cards.push(card("Read the Inverse",
            note("The left block is now the identity matrix, so the right block is A⁻¹:") +
            eq(`[\\,I \\mid A^{-1}\\,] = ${texM(M, n)}`)));

        return { cards, finalTex: `A^{-1} = ${texM(inv)}` };
    }

    /* ==========================================================
       3. LINEAR SYSTEM  Ax = b
       ========================================================== */
    function solveSystem(A, B) {
        const m = A.length;
        const n = A[0].length;

        if (B.some(r => r.length !== 1)) {
            throw new Error("b must have exactly one value per line.");
        }
        if (B.length !== m) {
            throw new Error(`b needs ${m} values, one for each row of A.`);
        }

        const aug = A.map((r, i) => r.concat([B[i][0]]));

        const cards = [
            card("Augmented Matrix", note("Combine the coefficients and the constants:") +
                eq(`[\\,A \\mid b\\,] = ${texM(aug, n)}`)),
        ];

        const { M, pivots } = rref(aug, n, n, cards);

        // Baris [0 0 ... 0 | c] dengan c != 0  ->  tidak ada solusi
        for (let i = 0; i < m; i++) {
            const allZero = M[i].slice(0, n).every(isZero);
            if (allZero && !isZero(M[i][n])) {
                cards.push(card("No Solution", note(
                    `Row ${i + 1} reads 0 = ${ft(M[i][n])}, which is impossible. The system is inconsistent.`)));
                return { cards, finalTex: "\\text{No solution (the system is inconsistent)}" };
            }
        }

        // Solusi tunggal
        if (pivots.length === n) {
            const x = pivots.map((_, i) => [M[i][n]]);
            cards.push(card("Unique Solution",
                note("Every variable has a pivot, so the solution is unique:") +
                eq(x.map((v, i) => `x_{${i + 1}} = ${ft(v[0])}`).join(" \\qquad "))));
            return { cards, finalTex: `\\mathbf{x} = ${texM(x)}` };
        }

        // Solusi tak hingga
        const free = [];
        for (let j = 0; j < n; j++) if (!pivots.includes(j)) free.push(j);

        const lines = [];
        for (let j = 0; j < n; j++) {
            const row = pivots.indexOf(j);
            if (row < 0) {
                lines.push(`x_{${j + 1}} &= x_{${j + 1}} \\ \\text{(free)}`);
            } else {
                const terms = free.map(f => ({
                    c: math.unaryMinus(M[row][f]),
                    name: `x_{${f + 1}}`,
                }));
                lines.push(`x_{${j + 1}} &= ${linComb(M[row][n], terms)}`);
            }
        }

        const freeNames = free.map(f => `x_{${f + 1}}`).join(", ");
        cards.push(card("Infinitely Many Solutions", note(
            `There are ${free.length} free variable(s): \\(${freeNames}\\). ` +
            `Express the pivot variables in terms of them:`) +
            eq(`\\begin{aligned}${lines.join(" \\\\ ")}\\end{aligned}`)));

        return { cards, finalTex: `\\begin{aligned}${lines.join(" \\\\ ")}\\end{aligned}` };
    }

    /* ==========================================================
       4. MULTIPLICATION  A x B
       ========================================================== */
    function solveMultiply(A, B) {
        const m = A.length, n = A[0].length, p = B[0].length;

        if (n !== B.length) {
            throw new Error(
                `Sizes do not match: A is ${m}×${n} and B is ${B.length}×${p}. ` +
                `The number of columns of A must equal the number of rows of B.`);
        }

        const cards = [
            card("Matrices", eq(`A = ${texM(A)} \\qquad B = ${texM(B)}`) +
                note(`A is ${m} × ${n} and B is ${n} × ${p}, so AB is ${m} × ${p}.`)),
            card("Formula",
                eq("(AB)_{ij} = \\sum_{k} a_{ik}\\,b_{kj}")),
        ];

        const expr = [];
        const result = [];

        for (let i = 0; i < m; i++) {
            const exprRow = [];
            const resRow = [];
            for (let j = 0; j < p; j++) {
                let sum = F(0);
                const parts = [];
                for (let k = 0; k < n; k++) {
                    sum = math.add(sum, math.multiply(A[i][k], B[k][j]));
                    parts.push(`(${ft(A[i][k])})(${ft(B[k][j])})`);
                }
                exprRow.push(parts.join(" + "));
                resRow.push(sum);
            }
            expr.push(exprRow);
            result.push(resRow);
        }

        cards.push(card("Compute Each Entry", eq(`AB = ${texM(expr)}`)));
        cards.push(card("Simplify", eq(`AB = ${texM(result)}`)));

        return { cards, finalTex: `AB = ${texM(result)}` };
    }

    /* ==========================================================
       INISIALISASI HALAMAN
       ========================================================== */
    const CONFIG = {
        determinant: {
            aLabel: "Matrix A", aPh: "2 1 3\n0 -1 4\n1 2 5", b: null,
        },
        inverse: {
            aLabel: "Matrix A", aPh: "2 1\n5 3", b: null,
        },
        system: {
            aLabel: "Coefficient matrix A", aPh: "2 1 -1\n-3 -1 2\n-2 1 2",
            b: { label: "Constants vector b (one value per line)", ph: "8\n-11\n-3" },
        },
        multiply: {
            aLabel: "Matrix A", aPh: "1 2\n3 4",
            b: { label: "Matrix B", ph: "5 6\n7 8" },
        },
    };

    function initLinearAlgebraPage() {

        const inputA          = document.getElementById("matrix-a");
        const inputB          = document.getElementById("matrix-b");
        const groupB          = document.getElementById("matrix-b-group");
        const solveButton     = document.querySelector(".solve-button");
        const solutionSection = document.getElementById("solution-section");
        const resultBox       = document.getElementById("solution-result");

        // Bukan halaman aljabar linear -> keluar tanpa error
        if (!inputA || !inputB || !groupB || !solveButton || !solutionSection || !resultBox) return;

        const methodCards = document.querySelectorAll(".method-card");

        function activeMethod() {
            return document.querySelector(".method-card.active").dataset.method;
        }

        function updateForm() {
            const cfg = CONFIG[activeMethod()];

            document.getElementById("matrix-a-label").textContent = cfg.aLabel;
            inputA.placeholder = "Example:\n" + cfg.aPh;

            if (cfg.b) {
                groupB.hidden = false;
                document.getElementById("matrix-b-label").textContent = cfg.b.label;
                inputB.placeholder = "Example:\n" + cfg.b.ph;
            } else {
                groupB.hidden = true;
                inputB.value = "";
            }
        }

        methodCards.forEach(card => {
            card.addEventListener("click", () => {
                methodCards.forEach(item => {
                    item.classList.remove("active");
                    item.setAttribute("aria-pressed", "false");
                });
                card.classList.add("active");
                card.setAttribute("aria-pressed", "true");
                updateForm();
            });
        });

        updateForm();

        solveButton.addEventListener("click", () => {

            const method = activeMethod();
            const textA = inputA.value.trim();
            const textB = inputB.value.trim();

            if (textA === "") {
                alert("Please enter a matrix.");
                return;
            }
            if (CONFIG[method].b && textB === "") {
                alert(`Please fill in ${CONFIG[method].b.label.split(" (")[0]}.`);
                return;
            }

            let html;
            try {
                const A = parseMatrix(textA, "A");
                let out;

                if (method === "determinant")      out = solveDeterminant(A);
                else if (method === "inverse")     out = solveInverse(A);
                else if (method === "system")      out = solveSystem(A, parseMatrix(textB, "b"));
                else                               out = solveMultiply(A, parseMatrix(textB, "B"));

                html = `<div class="result-summary">` + out.cards.join("") +
                       `<div class="final-result"><h4>Final Result</h4>${eq(out.finalTex)}</div></div>`;
            } catch (err) {
                const msg = String(err.message).replace(/</g, "&lt;");
                html = card("Calculation Error", note(msg));
            }

            resultBox.classList.remove("solution-placeholder");
            resultBox.classList.add("solution-output");
            resultBox.innerHTML = html;

            solutionSection.hidden = false;

            if (window.MathJax && MathJax.typesetPromise) {
                MathJax.typesetPromise([resultBox]);
            }
            solutionSection.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initLinearAlgebraPage);
    } else {
        initLinearAlgebraPage();
    }

})();