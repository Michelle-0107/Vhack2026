(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/system/SimLoop.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SimLoop
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useFleetStore.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function SimLoop() {
    _s();
    const tick_update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFleetStore"])({
        "SimLoop.useFleetStore[tick_update]": (s)=>s.tick_update
    }["SimLoop.useFleetStore[tick_update]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SimLoop.useEffect": ()=>{
            const TICK_MS = 100;
            const MAX_STEPS_PER_FRAME = 3;
            let rafId = 0;
            let last = performance.now();
            let acc = 0;
            const loop = {
                "SimLoop.useEffect.loop": (now)=>{
                    const delta = now - last;
                    last = now;
                    acc += delta;
                    let steps = 0;
                    while(acc >= TICK_MS && steps < MAX_STEPS_PER_FRAME){
                        tick_update();
                        acc -= TICK_MS;
                        steps += 1;
                    }
                    rafId = requestAnimationFrame(loop);
                }
            }["SimLoop.useEffect.loop"];
            rafId = requestAnimationFrame(loop);
            return ({
                "SimLoop.useEffect": ()=>cancelAnimationFrame(rafId)
            })["SimLoop.useEffect"];
        }
    }["SimLoop.useEffect"], [
        tick_update
    ]);
    return null;
}
_s(SimLoop, "dTx3+fr4K7CZ2p6eyMZ7f7EYP6Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFleetStore"]
    ];
});
_c = SimLoop;
var _c;
__turbopack_context__.k.register(_c, "SimLoop");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/system/SimLoop.jsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/system/SimLoop.jsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_system_SimLoop_jsx_984651b0._.js.map