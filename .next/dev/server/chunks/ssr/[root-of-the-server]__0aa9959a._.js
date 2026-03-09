module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/lib/constants.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────── THEME COLORS ────────────────────────────────────
__turbopack_context__.s([
    "AI_CYAN",
    ()=>AI_CYAN,
    "BASE_DRONES",
    ()=>BASE_DRONES,
    "CRIT_RED",
    ()=>CRIT_RED,
    "HUMAN_MAG",
    ()=>HUMAN_MAG,
    "INITIAL_LOG",
    ()=>INITIAL_LOG,
    "MAX_FLEET",
    ()=>MAX_FLEET,
    "MISSION",
    ()=>MISSION,
    "NAMES",
    ()=>NAMES,
    "OK_GREEN",
    ()=>OK_GREEN,
    "SIGS",
    ()=>SIGS,
    "TYPE_META",
    ()=>TYPE_META,
    "WARN_AMB",
    ()=>WARN_AMB
]);
const AI_CYAN = "#00f5ff";
const HUMAN_MAG = "#ff00cc";
const WARN_AMB = "#ffaa00";
const CRIT_RED = "#ff3355";
const OK_GREEN = "#00ff88";
const MAX_FLEET = 10;
const MISSION = {
    sector: "7G-NORTH",
    lat: "34.0522° N",
    lon: "118.2437° W"
};
const NAMES = [
    "ALPHA",
    "BRAVO",
    "CHARLIE",
    "DELTA",
    "ECHO",
    "FOXTROT",
    "GOLF",
    "HOTEL",
    "INDIA",
    "JULIET"
];
const SIGS = [
    "EXCELLENT",
    "GOOD",
    "GOOD",
    "INTERMITTENT",
    "WEAK"
];
const BASE_DRONES = [
    {
        id: "U-01",
        name: "ALPHA",
        battery: 89,
        alt: 120,
        spd: 42,
        sig: "EXCELLENT",
        relay: "ACTIVE",
        x: 22,
        y: 24,
        mode: "AUTO",
        isRelay: true
    },
    {
        id: "U-02",
        name: "BRAVO",
        battery: 74,
        alt: 115,
        spd: 38,
        sig: "GOOD",
        relay: "STANDBY",
        x: 50,
        y: 18,
        mode: "AUTO",
        isRelay: true
    },
    {
        id: "U-03",
        name: "CHARLIE",
        battery: 42,
        alt: 122,
        spd: 45,
        sig: "INTERMITTENT",
        relay: "WARNING",
        x: 76,
        y: 26,
        mode: "AUTO",
        isRelay: false
    },
    {
        id: "U-04",
        name: "DELTA",
        battery: 14,
        alt: 98,
        spd: 22,
        sig: "WEAK",
        relay: "RE-ROUTING",
        x: 85,
        y: 55,
        mode: "MANUAL",
        isRelay: false
    },
    {
        id: "U-05",
        name: "ECHO",
        battery: 61,
        alt: 135,
        spd: 51,
        sig: "GOOD",
        relay: "ACTIVE",
        x: 60,
        y: 72,
        mode: "AUTO",
        isRelay: true
    }
];
const TYPE_META = {
    SUCCESS: {
        color: "#00ff88",
        bg: "rgba(0,255,136,0.06)",
        border: "rgba(0,255,136,0.2)"
    },
    INFO: {
        color: "#7ecfff",
        bg: "transparent",
        border: "transparent"
    },
    ANALYSIS: {
        color: "#00f5ff",
        bg: "rgba(0,245,255,0.05)",
        border: "rgba(0,245,255,0.15)"
    },
    DECISION: {
        color: "#ff3355",
        bg: "rgba(255,51,85,0.07)",
        border: "rgba(255,51,85,0.28)"
    },
    ACTION: {
        color: "#aaffee",
        bg: "transparent",
        border: "transparent"
    },
    MANUAL: {
        color: "#ff00cc",
        bg: "rgba(255,0,204,0.07)",
        border: "rgba(255,0,204,0.28)"
    },
    RECALL: {
        color: "#ffaa00",
        bg: "rgba(255,170,0,0.07)",
        border: "rgba(255,170,0,0.28)"
    },
    COT: {
        color: "#00f5ff",
        bg: "rgba(0,245,255,0.04)",
        border: "rgba(0,245,255,0.12)"
    },
    HEAL: {
        color: "#00ff88",
        bg: "rgba(0,255,136,0.06)",
        border: "rgba(0,255,136,0.22)"
    },
    PROMPT: {
        color: "#ffdd55",
        bg: "rgba(255,221,85,0.06)",
        border: "rgba(255,221,85,0.2)"
    },
    WARNING: {
        color: "#ffaa00",
        bg: "rgba(255,170,0,0.07)",
        border: "rgba(255,170,0,0.25)"
    }
};
const INITIAL_LOG = [
    {
        id: 0,
        time: "08:42:10",
        type: "SUCCESS",
        msg: "Llama-3.2 initialized on local NPU. MCP bridge online."
    },
    {
        id: 1,
        time: "08:42:11",
        type: "INFO",
        msg: "Scanning MCP tool registry... 14 tools registered."
    },
    {
        id: 2,
        time: "08:42:12",
        type: "ANALYSIS",
        msg: "Mesh topology stable. 5 nodes, 8 active relay links."
    },
    {
        id: 3,
        time: "08:42:16",
        type: "WARNING",
        msg: "U-04 (DELTA) battery critical: 14%. Estimated 6 min flight time."
    },
    {
        id: 4,
        time: "08:42:18",
        type: "DECISION",
        msg: "AI recommends immediate RECALL of U-04. Coverage gap: GRID-8B."
    }
];
}),
"[project]/src/lib/utils.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clamp",
    ()=>clamp,
    "droneColor",
    ()=>droneColor,
    "initDronePhysics",
    ()=>initDronePhysics,
    "makeLog",
    ()=>makeLog,
    "nowStr",
    ()=>nowStr,
    "rnd",
    ()=>rnd
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.js [app-ssr] (ecmascript)");
;
let logIdCounter = 5;
function nowStr() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}
function makeLog(type, msg) {
    return {
        id: logIdCounter++,
        time: nowStr(),
        type,
        msg
    };
}
function rnd(a, b) {
    return a + Math.random() * (b - a);
}
function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
}
function droneColor(mode) {
    return mode === "MANUAL" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"];
}
function initDronePhysics(drone) {
    return {
        ...drone,
        trail: [],
        vx: (Math.random() - 0.5) * 0.065,
        vy: (Math.random() - 0.5) * 0.065,
        healTarget: null,
        color: droneColor(drone.mode)
    };
}
}),
"[project]/src/store/useFleetStore.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFleetStore",
    ()=>useFleetStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
"use client";
;
;
;
/**
 * BEACON-NET Fleet Store
 * - Holds simulated swarm state (positions, links, logs)
 * - Runs a lightweight physics step (invoked at 10Hz by the map)
 * - Implements CoT-style self-healing when relay nodes are recalled
 */ const seedDrones = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BASE_DRONES"].map(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initDronePhysics"]);
const useFleetStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        // Core state
        drones: seedDrones,
        log: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INITIAL_LOG"],
        recalling: new Set(),
        newIds: new Set(),
        healingLinks: new Set(),
        activeDrone: null,
        deployCount: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BASE_DRONES"].length,
        intelText: "",
        tick: 0,
        latency: 11.8,
        sigBars: [
            55,
            70,
            48,
            82,
            90,
            65,
            44,
            78,
            92,
            58,
            71,
            85
        ],
        flashDeploy: false,
        // UI actions
        setActiveDrone: (id)=>set({
                activeDrone: id
            }),
        setIntelText: (v)=>set({
                intelText: v
            }),
        pushLog: (...entries)=>set((s)=>({
                    log: [
                        ...s.log,
                        ...entries
                    ]
                })),
        // Mesh networking
        getMeshEdges: ()=>{
            const { drones, activeDrone } = get();
            const edges = [];
            for(let i = 0; i < drones.length; i++){
                for(let j = i + 1; j < drones.length; j++){
                    const a = drones[i];
                    const b = drones[j];
                    // At least one must be a relay to form a link
                    if (!a.isRelay && !b.isRelay) continue;
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    // Maximum transmission range: 45 units
                    if (dist < 45) {
                        edges.push({
                            key: `${a.id}-${b.id}`,
                            a,
                            b,
                            dist,
                            isHuman: a.mode === "MANUAL" || b.mode === "MANUAL",
                            isHighlit: activeDrone === a.id || activeDrone === b.id
                        });
                    }
                }
            }
            return edges;
        },
        // Heartbeat: physics, battery, trails
        tick_update: ()=>{
            set((s)=>{
                const drones = s.drones.map((d)=>{
                    let nx = d.x + d.vx, ny = d.y + d.vy;
                    // 1) Boundary physics (bounce at edges)
                    let nvx = nx < 10 || nx > 92 ? -d.vx : d.vx + (Math.random() - 0.5) * 0.012;
                    let nvy = ny < 10 || ny > 88 ? -d.vy : d.vy + (Math.random() - 0.5) * 0.012;
                    // 2) Self-healing navigation: nudge toward the healing waypoint
                    if (d.healTarget) {
                        const dx = d.healTarget.x - d.x, dy = d.healTarget.y - d.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist > 2) {
                            nvx += dx / dist * 0.06;
                            nvy += dy / dist * 0.06;
                        } else {
                            nvx = d.vx;
                            nvy = d.vy;
                        }
                    }
                    // 3) Trail history for the ghosting effect (last 8 points)
                    const trail = [
                        ...d.trail || [],
                        {
                            x: d.x,
                            y: d.y
                        }
                    ].slice(-8);
                    // 4) Random battery depletion
                    const battery = Math.max(1, d.battery - (Math.random() < 0.004 ? 1 : 0));
                    return {
                        ...d,
                        x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clamp"])(nx, 10, 92),
                        y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clamp"])(ny, 10, 88),
                        vx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clamp"])(nvx, -0.14, 0.14),
                        vy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clamp"])(nvy, -0.14, 0.14),
                        trail,
                        battery
                    };
                });
                // Update telemetry noise
                const latency = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clamp"])(s.latency + (Math.random() - 0.5) * 0.35, 7, 30);
                const sigBars = [
                    ...s.sigBars.slice(1),
                    Math.floor((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rnd"])(35, 96))
                ];
                return {
                    drones,
                    latency,
                    sigBars,
                    tick: s.tick + 1
                };
            });
        },
        // Deployment
        deployUnit: ()=>{
            const { deployCount, pushLog } = get();
            if (deployCount >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAX_FLEET"]) return;
            const idx = deployCount;
            const newId = `U-${String(idx + 1).padStart(2, "0")}`;
            const name = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NAMES"][idx];
            const newDrone = {
                id: newId,
                name,
                battery: Math.floor((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rnd"])(75, 95)),
                alt: Math.floor((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rnd"])(95, 155)),
                spd: Math.floor((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rnd"])(30, 58)),
                sig: "EXCELLENT",
                relay: "ACTIVE",
                x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rnd"])(14, 88),
                y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rnd"])(14, 84),
                mode: "MANUAL",
                isRelay: false,
                trail: [],
                vx: (Math.random() - 0.5) * 0.065,
                vy: (Math.random() - 0.5) * 0.065,
                healTarget: null,
                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"]
            };
            set((s)=>({
                    drones: [
                        ...s.drones,
                        newDrone
                    ],
                    deployCount: s.deployCount + 1,
                    newIds: new Set([
                        ...s.newIds,
                        newId
                    ]),
                    flashDeploy: true
                }));
            pushLog((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLog"])("MANUAL", `[OPERATOR] ${newId} deployed. survivor search in Sector 7G.`), (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLog"])("COT", `CoT: Integrating new node ${newId}. Optimizing mesh...`), (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLog"])("ANALYSIS", `Grid expansion verified. +18% signal redundancy.`));
            setTimeout(()=>set({
                    flashDeploy: false
                }), 800);
            setTimeout(()=>set((s)=>{
                    const n = new Set(s.newIds);
                    n.delete(newId);
                    return {
                        newIds: n
                    };
                }), 3000);
        },
        // Recall protocol with CoT-style self-healing
        recallUnit: (id)=>{
            const { drones, recalling, pushLog } = get();
            const recalled = drones.find((d)=>d.id === id);
            if (!recalled || recalling.has(id)) return;
            set((s)=>({
                    recalling: new Set([
                        ...s.recalling,
                        id
                    ])
                }));
            pushLog((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLog"])("RECALL", `[HUMAN] RTB order issued to ${id}. Swapping to recovery mode.`));
            setTimeout(()=>{
                const snapshot = get();
                const current = snapshot.drones;
                const toRemove = current.find((d)=>d.id === id);
                if (!toRemove) {
                    set((s)=>({
                            recalling: new Set([
                                ...s.recalling
                            ].filter((x)=>x !== id))
                        }));
                    return;
                }
                const remaining = current.filter((d)=>d.id !== id);
                const shouldHeal = !!toRemove.isRelay && remaining.length >= 2;
                if (!shouldHeal) {
                    set((s)=>({
                            drones: remaining,
                            deployCount: remaining.length,
                            recalling: new Set([
                                ...s.recalling
                            ].filter((x)=>x !== id)),
                            activeDrone: s.activeDrone === id ? null : s.activeDrone
                        }));
                    return;
                }
                const healer = remaining.reduce((best, d)=>{
                    if (!best) return d;
                    const da = Math.sqrt((d.x - toRemove.x) ** 2 + (d.y - toRemove.y) ** 2);
                    const db = Math.sqrt((best.x - toRemove.x) ** 2 + (best.y - toRemove.y) ** 2);
                    return da < db ? d : best;
                }, null);
                if (!healer) {
                    set((s)=>({
                            drones: remaining,
                            deployCount: remaining.length,
                            recalling: new Set([
                                ...s.recalling
                            ].filter((x)=>x !== id)),
                            activeDrone: s.activeDrone === id ? null : s.activeDrone
                        }));
                    return;
                }
                const target = {
                    x: (toRemove.x + healer.x) / 2 + (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rnd"])(-5, 5),
                    y: (toRemove.y + healer.y) / 2 + (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rnd"])(-5, 5)
                };
                const linkKey = `${healer.id}-heal-${id}`;
                set((s)=>({
                        drones: remaining.map((d)=>d.id === healer.id ? {
                                ...d,
                                healTarget: target,
                                isRelay: true,
                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"],
                                mode: "AUTO"
                            } : d),
                        deployCount: remaining.length,
                        recalling: new Set([
                            ...s.recalling
                        ].filter((x)=>x !== id)),
                        healingLinks: new Set([
                            ...s.healingLinks,
                            linkKey
                        ]),
                        activeDrone: s.activeDrone === id ? null : s.activeDrone,
                        log: [
                            ...s.log,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLog"])("COT", `CoT: Critical relay ${id} lost. Coverage gap detected.`),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLog"])("DECISION", `AI: Rerouting ${healer.id} to maintain mesh coverage.`),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLog"])("ACTION", `Uploading new flight plan to ${healer.id}...`)
                        ]
                    }));
                setTimeout(()=>{
                    const st = get();
                    if (!st.healingLinks.has(linkKey)) return;
                    st.pushLog((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLog"])("HEAL", `SELF-HEAL COMPLETE: ${healer.id} has filled the gap. Mesh integrity optimal.`));
                    set((s)=>({
                            healingLinks: new Set([
                                ...s.healingLinks
                            ].filter((k)=>k !== linkKey)),
                            drones: s.drones.map((d)=>d.id === healer.id ? {
                                    ...d,
                                    healTarget: null
                                } : d)
                        }));
                }, 4200);
            }, 1200);
        },
        // Hybrid control
        toggleMode: (id)=>{
            const { drones, pushLog } = get();
            const drone = drones.find((d)=>d.id === id);
            if (!drone) return;
            const newMode = drone.mode === "AUTO" ? "MANUAL" : "AUTO";
            set((s)=>({
                    drones: s.drones.map((d)=>d.id !== id ? d : {
                            ...d,
                            mode: newMode,
                            color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["droneColor"])(newMode)
                        })
                }));
            pushLog((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLog"])(newMode === "MANUAL" ? "MANUAL" : "ACTION", `${id} switched to ${newMode} mode.`));
        },
        submitIntel: ()=>{
            const { intelText, pushLog } = get();
            if (!intelText.trim()) return;
            pushLog((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLog"])("PROMPT", intelText.trim()), (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLog"])("COT", `CoT: Cross-referencing intel with satellite imagery...`), (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLog"])("ACTION", `Search parameters updated based on human input.`));
            set({
                intelText: ""
            });
        }
    }));
}),
"[project]/src/components/system/SystemStatusBar.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SystemStatusBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cpu.js [app-ssr] (ecmascript) <export default as Cpu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Radio$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/radio.js [app-ssr] (ecmascript) <export default as Radio>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-ssr] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useFleetStore.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function SystemStatusBar() {
    const drones = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.drones);
    const latency = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.latency);
    const aiCount = drones.filter((d)=>d.mode === "AUTO").length;
    const manCount = drones.filter((d)=>d.mode === "MANUAL").length;
    const atCap = drones.length >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAX_FLEET"];
    const hwStats = [
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Radio$3e$__["Radio"], {
                size: 9
            }, void 0, false, {
                fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                lineNumber: 19,
                columnNumber: 12
            }, this),
            label: "EDGE NODE",
            value: "LOCAL: ACTIVE",
            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"]
        },
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__["Cpu"], {
                size: 9
            }, void 0, false, {
                fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                lineNumber: 20,
                columnNumber: 12
            }, this),
            label: "HARDWARE",
            value: "32GB / 8GB VRAM",
            color: "#7ecfff"
        },
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                size: 9
            }, void 0, false, {
                fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                lineNumber: 21,
                columnNumber: 12
            }, this),
            label: "FLEET",
            value: `${drones.length}/${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAX_FLEET"]} ACTIVE`,
            color: atCap ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CRIT_RED"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]
        },
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                size: 9
            }, void 0, false, {
                fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                lineNumber: 22,
                columnNumber: 12
            }, this),
            label: "LATENCY",
            value: `${latency.toFixed(1)} MS`,
            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            height: 48,
            background: "rgba(0,245,255,0.028)",
            borderBottom: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}28`,
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            gap: 0,
            backdropFilter: "blur(14px)",
            flexShrink: 0
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    marginRight: 22
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 9,
                            height: 9,
                            background: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"],
                            borderRadius: 1,
                            animation: "blink 1.8s infinite",
                            boxShadow: `0 0 8px ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}`
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontFamily: "'Orbitron',sans-serif",
                            fontSize: 16,
                            fontWeight: 900,
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"],
                            letterSpacing: 3
                        },
                        children: "BEACON-NET"
                    }, void 0, false, {
                        fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}44`,
                            fontSize: 14,
                            margin: "0 4px"
                        },
                        children: "::"
                    }, void 0, false, {
                        fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontFamily: "'Orbitron',sans-serif",
                            fontSize: 11,
                            color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}77`,
                            letterSpacing: 2
                        },
                        children: "HITL COMMAND v4.2"
                    }, void 0, false, {
                        fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 8,
                    marginRight: 18
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            background: `rgba(0,245,255,0.06)`,
                            border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}33`,
                            borderRadius: 20,
                            padding: "3px 9px",
                            fontSize: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 5,
                                    height: 5,
                                    borderRadius: "50%",
                                    background: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"],
                                    boxShadow: `0 0 5px ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}`
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                                lineNumber: 42,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"],
                                    letterSpacing: 1
                                },
                                children: [
                                    "AI AUTO: ",
                                    aiCount
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            background: `rgba(255,0,204,0.06)`,
                            border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"]}44`,
                            borderRadius: 20,
                            padding: "3px 9px",
                            fontSize: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 5,
                                    height: 5,
                                    borderRadius: "50%",
                                    background: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"],
                                    boxShadow: `0 0 5px ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"]}`
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"],
                                    letterSpacing: 1
                                },
                                children: [
                                    "MANUAL: ",
                                    manCount
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 16,
                    flex: 1,
                    fontSize: 9,
                    color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}55`
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "SECTOR: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]
                                },
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MISSION"].sector
                            }, void 0, false, {
                                fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                                lineNumber: 53,
                                columnNumber: 23
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "LAT: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]
                                },
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MISSION"].lat
                            }, void 0, false, {
                                fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                                lineNumber: 54,
                                columnNumber: 20
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "LON: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]
                                },
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MISSION"].lon
                            }, void 0, false, {
                                fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                                lineNumber: 55,
                                columnNumber: 20
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 20,
                    fontSize: 9
                },
                children: hwStats.map(({ icon, label, value, color })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            textAlign: "right"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}33`,
                                    marginBottom: 1,
                                    fontSize: 8,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 3,
                                    justifyContent: "flex-end"
                                },
                                children: [
                                    icon,
                                    label
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                                lineNumber: 62,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color,
                                    fontWeight: 700,
                                    fontSize: 9
                                },
                                children: value
                            }, void 0, false, {
                                fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                                lineNumber: 65,
                                columnNumber: 13
                            }, this)
                        ]
                    }, label, true, {
                        fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/system/SystemStatusBar.jsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/system/SystemStatusBar.jsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/fleet/BatteryBar.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BatteryBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function BatteryBar({ value }) {
    const color = value > 60 ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"] : value > 25 ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WARN_AMB"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CRIT_RED"];
    const MotionDiv = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "relative",
            height: 4,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 2,
            overflow: "hidden",
            width: "100%",
            marginTop: 3
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MotionDiv, {
            initial: {
                width: 0
            },
            animate: {
                width: `${value}%`
            },
            transition: {
                duration: 0.9,
                ease: "easeOut"
            },
            style: {
                height: "100%",
                background: color,
                borderRadius: 2,
                boxShadow: `0 0 5px ${color}88`
            }
        }, void 0, false, {
            fileName: "[project]/src/components/fleet/BatteryBar.jsx",
            lineNumber: 13,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/fleet/BatteryBar.jsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/fleet/StatusDot.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StatusDot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.js [app-ssr] (ecmascript)");
"use client";
;
;
function StatusDot({ relay }) {
    const color = relay === "ACTIVE" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"] : relay === "STANDBY" ? "#556677" : relay === "WARNING" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WARN_AMB"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CRIT_RED"];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 5px ${color}`,
            flexShrink: 0
        }
    }, void 0, false, {
        fileName: "[project]/src/components/fleet/StatusDot.jsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/fleet/DroneCard.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DroneCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-ssr] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-ssr] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gauge.js [app-ssr] (ecmascript) <export default as Gauge>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$signal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Signal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/signal.js [app-ssr] (ecmascript) <export default as Signal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$fleet$2f$BatteryBar$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/fleet/BatteryBar.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$fleet$2f$StatusDot$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/fleet/StatusDot.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
const SIG_COLOR = {
    EXCELLENT: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"],
    GOOD: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"],
    INTERMITTENT: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WARN_AMB"],
    WEAK: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CRIT_RED"]
};
function DroneCard({ drone, active, isNew, isRecalling, onSelect, onToggleMode, onRecall }) {
    const cardRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null); // Reference for scrolling
    const sigColor = SIG_COLOR[drone.sig] ?? "#666";
    const isManual = drone.mode === "MANUAL";
    const MotionDiv = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div;
    const MotionButton = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button;
    // Navigation Logic: Smoothly scroll this card into the sidebar view when selected
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (active && cardRef.current) {
            cardRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    }, [
        active
    ]);
    const borderCol = isRecalling ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CRIT_RED"] : active ? isManual ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"] : isNew ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"] : "rgba(0,245,255,0.12)";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MotionDiv, {
        ref: cardRef,
        layout: true,
        initial: isNew ? {
            opacity: 0,
            x: -50,
            scale: 0.9
        } : false,
        animate: isRecalling ? {
            opacity: 0.45,
            scale: 0.97
        } : {
            opacity: 1,
            x: 0,
            scale: 1
        },
        exit: {
            opacity: 0,
            x: -60,
            scale: 0.88
        },
        transition: {
            type: "spring",
            stiffness: 280,
            damping: 24
        },
        onClick: ()=>!isRecalling && onSelect(drone.id),
        style: {
            cursor: isRecalling ? "not-allowed" : "pointer",
            background: active ? "rgba(0,245,255,0.08)" : "rgba(0,0,0,0.38)",
            border: `1px solid ${borderCol}`,
            borderRadius: 7,
            padding: "9px 11px",
            marginBottom: 6,
            boxShadow: active ? `0 0 16px ${isManual ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"] + "44" : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"] + "33"}` : "none",
            position: "relative",
            overflow: "hidden",
            transition: "border 0.25s, box-shadow 0.25s, background 0.25s"
        },
        children: [
            active && !isRecalling && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: `linear-gradient(90deg,transparent,${isManual ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]},transparent)`,
                    animation: "scanLine 2s linear infinite"
                }
            }, void 0, false, {
                fileName: "[project]/src/components/fleet/DroneCard.jsx",
                lineNumber: 62,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 3
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$fleet$2f$StatusDot$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                relay: drone.relay
                            }, void 0, false, {
                                fileName: "[project]/src/components/fleet/DroneCard.jsx",
                                lineNumber: 72,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: active ? isManual ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"] : "#b0e0e0",
                                    fontFamily: "'Share Tech Mono',monospace",
                                    fontSize: 11,
                                    fontWeight: 700
                                },
                                children: drone.id
                            }, void 0, false, {
                                fileName: "[project]/src/components/fleet/DroneCard.jsx",
                                lineNumber: 73,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/fleet/DroneCard.jsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: drone.battery > 60 ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"] : drone.battery > 25 ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WARN_AMB"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CRIT_RED"],
                            fontSize: 11
                        },
                        children: [
                            drone.battery,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/fleet/DroneCard.jsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/fleet/DroneCard.jsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$fleet$2f$BatteryBar$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                value: drone.battery
            }, void 0, false, {
                fileName: "[project]/src/components/fleet/DroneCard.jsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 10,
                    marginTop: 6
                },
                children: [
                    {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                            size: 8
                        }, void 0, false, {
                            fileName: "[project]/src/components/fleet/DroneCard.jsx",
                            lineNumber: 87,
                            columnNumber: 19
                        }, this),
                        k: "ALT",
                        v: `${drone.alt}M`
                    },
                    {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__["Gauge"], {
                            size: 8
                        }, void 0, false, {
                            fileName: "[project]/src/components/fleet/DroneCard.jsx",
                            lineNumber: 88,
                            columnNumber: 19
                        }, this),
                        k: "SPD",
                        v: `${drone.spd}KM`
                    },
                    {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$signal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Signal$3e$__["Signal"], {
                            size: 8
                        }, void 0, false, {
                            fileName: "[project]/src/components/fleet/DroneCard.jsx",
                            lineNumber: 89,
                            columnNumber: 19
                        }, this),
                        k: "SIG",
                        v: drone.sig.slice(0, 5),
                        c: sigColor
                    }
                ].map(({ icon, k, v, c })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            fontSize: 8,
                            color: "#2a6060"
                        },
                        children: [
                            icon,
                            " ",
                            k,
                            ": ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: c ?? "#6ab0c0"
                                },
                                children: v
                            }, void 0, false, {
                                fileName: "[project]/src/components/fleet/DroneCard.jsx",
                                lineNumber: 92,
                                columnNumber: 25
                            }, this)
                        ]
                    }, k, true, {
                        fileName: "[project]/src/components/fleet/DroneCard.jsx",
                        lineNumber: 91,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/fleet/DroneCard.jsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 7
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: (e)=>{
                            e.stopPropagation();
                            !isRecalling && onToggleMode(drone.id);
                        },
                        style: {
                            display: "flex",
                            border: `1px solid ${isManual ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"] + "55" : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"] + "33"}`,
                            borderRadius: 3,
                            overflow: "hidden",
                            cursor: "pointer"
                        },
                        children: [
                            "AUTO",
                            "MANUAL"
                        ].map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "2px 6px",
                                    fontSize: 7,
                                    background: drone.mode === m ? m === "MANUAL" ? "rgba(255,0,204,0.2)" : "rgba(0,245,255,0.15)" : "transparent",
                                    color: drone.mode === m ? m === "MANUAL" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"] : "rgba(0,245,255,0.28)"
                                },
                                children: m
                            }, m, false, {
                                fileName: "[project]/src/components/fleet/DroneCard.jsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/fleet/DroneCard.jsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MotionButton, {
                        whileTap: {
                            scale: 0.9
                        },
                        onClick: (e)=>{
                            e.stopPropagation();
                            !isRecalling && onRecall(drone.id);
                        },
                        style: {
                            padding: "2px 9px",
                            fontSize: 8,
                            background: `rgba(255,170,0,0.08)`,
                            border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WARN_AMB"]}44`,
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WARN_AMB"],
                            borderRadius: 3,
                            cursor: "pointer"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                size: 8,
                                style: {
                                    marginRight: 4,
                                    display: 'inline'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/fleet/DroneCard.jsx",
                                lineNumber: 117,
                                columnNumber: 11
                            }, this),
                            " RECALL"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/fleet/DroneCard.jsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/fleet/DroneCard.jsx",
                lineNumber: 98,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/fleet/DroneCard.jsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/fleet/SwarmRegistry.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SwarmRegistry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-plus.js [app-ssr] (ecmascript) <export default as PlusCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$fleet$2f$DroneCard$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/fleet/DroneCard.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useFleetStore.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function SwarmRegistry() {
    // Global Store Selectors
    const drones = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.drones);
    const recalling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.recalling);
    const newIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.newIds);
    const deployCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.deployCount);
    const flashDeploy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.flashDeploy);
    const deployUnit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.deployUnit);
    const recallUnit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.recallUnit);
    const toggleMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.toggleMode);
    const activeDrone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.activeDrone); // Standardized name
    const setActiveDrone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.setActiveDrone);
    const atCap = deployCount >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAX_FLEET"];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: 274,
            background: "rgba(0,5,16,0.75)",
            borderRight: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}18`,
            display: "flex",
            flexDirection: "column",
            backdropFilter: "blur(12px)",
            flexShrink: 0
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "10px 12px 9px",
                    borderBottom: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}14`
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 9
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: "'Orbitron',sans-serif",
                                    fontSize: 10,
                                    letterSpacing: 3,
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]
                                },
                                children: "SWARM REGISTRY"
                            }, void 0, false, {
                                fileName: "[project]/src/components/fleet/SwarmRegistry.jsx",
                                lineNumber: 35,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 8,
                                    color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}55`
                                },
                                children: [
                                    drones.length,
                                    "/",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAX_FLEET"],
                                    " UNITS"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/fleet/SwarmRegistry.jsx",
                                lineNumber: 36,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/fleet/SwarmRegistry.jsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: deployUnit,
                        disabled: atCap,
                        style: {
                            width: "100%",
                            padding: "9px 0",
                            marginBottom: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            background: flashDeploy ? `rgba(0,255,136,0.22)` : atCap ? `rgba(0,255,136,0.03)` : `rgba(0,255,136,0.09)`,
                            border: `1px solid ${atCap ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"] + "22" : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"]}`,
                            borderRadius: 5,
                            cursor: atCap ? "not-allowed" : "pointer",
                            color: atCap ? `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"]}33` : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"],
                            fontFamily: "'Orbitron',sans-serif",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 3,
                            boxShadow: flashDeploy ? `0 0 32px ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"]}88, 0 0 64px ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"]}44` : atCap ? "none" : `0 0 10px ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"]}28`,
                            transition: "all 0.25s",
                            animation: flashDeploy ? "deployBurst 0.8s ease-out" : "none"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                                size: 16
                            }, void 0, false, {
                                fileName: "[project]/src/components/fleet/SwarmRegistry.jsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "DEPLOY UNIT"
                            }, void 0, false, {
                                fileName: "[project]/src/components/fleet/SwarmRegistry.jsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/fleet/SwarmRegistry.jsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            gap: 10,
                            fontSize: 7,
                            color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}44`,
                            padding: "2px 2px"
                        },
                        children: [
                            {
                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"],
                                label: "AI-CYAN = AUTONOMOUS"
                            },
                            {
                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"],
                                label: "MAGENTA = MANUAL"
                            }
                        ].map(({ color, label })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 3
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: 12,
                                            height: 1.5,
                                            background: color,
                                            borderRadius: 1
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/fleet/SwarmRegistry.jsx",
                                        lineNumber: 67,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: `${color}99`
                                        },
                                        children: label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/fleet/SwarmRegistry.jsx",
                                        lineNumber: 68,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, label, true, {
                                fileName: "[project]/src/components/fleet/SwarmRegistry.jsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/fleet/SwarmRegistry.jsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/fleet/SwarmRegistry.jsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflowY: "auto",
                    padding: "8px 11px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: drones.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$fleet$2f$DroneCard$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                drone: d,
                                // This prop triggers the highlight and Auto-Scroll inside DroneCard
                                active: activeDrone === d.id,
                                isNew: newIds.has(d.id),
                                isRecalling: recalling.has(d.id),
                                onSelect: setActiveDrone,
                                onToggleMode: toggleMode,
                                onRecall: recallUnit
                            }, d.id, false, {
                                fileName: "[project]/src/components/fleet/SwarmRegistry.jsx",
                                lineNumber: 78,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/fleet/SwarmRegistry.jsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    atCap && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            textAlign: "center",
                            fontSize: 8,
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CRIT_RED"],
                            letterSpacing: 1,
                            padding: "6px 0",
                            animation: "blink 1.5s infinite"
                        },
                        children: "⚠ MAX FLEET CAPACITY REACHED"
                    }, void 0, false, {
                        fileName: "[project]/src/components/fleet/SwarmRegistry.jsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/fleet/SwarmRegistry.jsx",
                lineNumber: 75,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/fleet/SwarmRegistry.jsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/map/TopoGrid.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TopoGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.js [app-ssr] (ecmascript)");
"use client";
;
;
function TopoGrid() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        style: {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.14
        },
        viewBox: "0 0 900 580",
        preserveAspectRatio: "none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pattern", {
                        id: "tgrid",
                        width: "36",
                        height: "36",
                        patternUnits: "userSpaceOnUse",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M 36 0 L 0 0 0 36",
                            fill: "none",
                            stroke: "#00c0a0",
                            strokeWidth: "0.4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/map/TopoGrid.jsx",
                            lineNumber: 17,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/TopoGrid.jsx",
                        lineNumber: 16,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("radialGradient", {
                        id: "tglow",
                        cx: "50%",
                        cy: "50%",
                        r: "50%",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0%",
                                stopColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"],
                                stopOpacity: "0.1"
                            }, void 0, false, {
                                fileName: "[project]/src/components/map/TopoGrid.jsx",
                                lineNumber: 20,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "100%",
                                stopColor: "#000",
                                stopOpacity: "0"
                            }, void 0, false, {
                                fileName: "[project]/src/components/map/TopoGrid.jsx",
                                lineNumber: 21,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/map/TopoGrid.jsx",
                        lineNumber: 19,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/map/TopoGrid.jsx",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                width: "900",
                height: "580",
                fill: "url(#tgrid)"
            }, void 0, false, {
                fileName: "[project]/src/components/map/TopoGrid.jsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                width: "900",
                height: "580",
                fill: "url(#tglow)"
            }, void 0, false, {
                fileName: "[project]/src/components/map/TopoGrid.jsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            [
                1,
                2,
                3,
                4,
                5
            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                    cx: "450",
                    cy: "290",
                    rx: 65 * i,
                    ry: 46 * i,
                    fill: "none",
                    stroke: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"],
                    strokeWidth: "0.3",
                    opacity: 0.5 - i * 0.07
                }, i, false, {
                    fileName: "[project]/src/components/map/TopoGrid.jsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this)),
            [
                1,
                2,
                3
            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                    cx: "190",
                    cy: "160",
                    rx: 52 * i,
                    ry: 36 * i,
                    fill: "none",
                    stroke: "#0066ff",
                    strokeWidth: "0.28",
                    opacity: 0.42 - i * 0.1
                }, i + 10, false, {
                    fileName: "[project]/src/components/map/TopoGrid.jsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this)),
            [
                1,
                2
            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                    cx: "720",
                    cy: "440",
                    rx: 44 * i,
                    ry: 30 * i,
                    fill: "none",
                    stroke: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"],
                    strokeWidth: "0.28",
                    opacity: 0.32
                }, i + 20, false, {
                    fileName: "[project]/src/components/map/TopoGrid.jsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/map/TopoGrid.jsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/map/ThermalZone.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ThermalZone
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function ThermalZone({ x, y, color = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"], isActive = false }) {
    const clamp01 = (v)=>Math.max(0, Math.min(1, v));
    const hexToRgba = (hex, alpha)=>{
        const h = String(hex || "").replace("#", "").trim();
        const a = clamp01(alpha);
        if (h.length !== 6) return `rgba(0,245,255,${a})`;
        const r = parseInt(h.slice(0, 2), 16);
        const g = parseInt(h.slice(2, 4), 16);
        const b = parseInt(h.slice(4, 6), 16);
        return `rgba(${r},${g},${b},${a})`;
    };
    // No coordinates => legacy bottom-left widget position
    const isWidget = x === undefined || y === undefined;
    const containerStyle = isWidget ? {
        position: "absolute",
        bottom: 32,
        left: 14,
        width: 108,
        height: 80,
        background: "rgba(0,0,0,0.9)",
        border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CRIT_RED"]}66`,
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: `0 0 14px ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CRIT_RED"]}22`,
        zIndex: 10
    } : {
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 1
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: containerStyle,
        children: [
            isWidget && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 7,
                    color: "#ff7755",
                    fontFamily: "'Share Tech Mono', monospace",
                    padding: "3px 6px",
                    borderBottom: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CRIT_RED"]}22`,
                    letterSpacing: 1
                },
                children: "THERMAL_ZONE_ACTIVE"
            }, void 0, false, {
                fileName: "[project]/src/components/map/ThermalZone.jsx",
                lineNumber: 52,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "relative",
                    width: isWidget ? "100%" : 120,
                    height: isWidget ? 60 : 120,
                    background: isWidget ? "#040410" : "transparent"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%,-50%)",
                            width: isActive ? 40 : 24,
                            height: isActive ? 40 : 24,
                            background: `radial-gradient(circle, ${color}66 0%, ${color}11 60%, transparent 80%)`,
                            borderRadius: "50%",
                            animation: "thermalPulse 2s ease-in-out infinite",
                            boxShadow: isActive ? `0 0 20px ${color}44` : `0 0 12px ${color}22`,
                            transition: "all 0.5s ease"
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/ThermalZone.jsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    [
                        1,
                        2,
                        3
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%,-50%)",
                                width: (isWidget ? 8 : 20) + i * (isWidget ? 12 : 30),
                                height: (isWidget ? 8 : 20) + i * (isWidget ? 12 : 30),
                                borderRadius: "50%",
                                border: `1px solid ${hexToRgba(color, isActive ? 0.55 / i : 0.28 / i)}`,
                                opacity: 1,
                                animation: `thermalRing 2.2s ease-in-out ${i * 0.42}s infinite`
                            }
                        }, i, false, {
                            fileName: "[project]/src/components/map/ThermalZone.jsx",
                            lineNumber: 82,
                            columnNumber: 11
                        }, this)),
                    isWidget && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "absolute",
                            bottom: 3,
                            left: 4,
                            fontSize: 7,
                            color: "#ff9966",
                            fontFamily: "'Share Tech Mono', monospace"
                        },
                        children: "HEAT SIG: GRID_42-X"
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/ThermalZone.jsx",
                        lineNumber: 96,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/map/ThermalZone.jsx",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/map/ThermalZone.jsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/map/DroneMapIcon.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DroneMapIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function DroneMapIcon({ drone, isActive, isNew, isRecalling, onClick }) {
    const c = drone.mode === "MANUAL" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"] : drone.color ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"];
    const MotionDiv = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div;
    const glowStr = isRecalling ? `0px 0px 14px ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CRIT_RED"]}` : isActive ? `0px 0px ${isNew ? 12 : 9}px ${c}` : `0px 0px 4px ${c}88`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MotionDiv, {
        initial: isNew ? {
            opacity: 0,
            scale: 0
        } : false,
        animate: isRecalling ? {
            opacity: 0.3,
            scale: 0.7,
            rotate: 15
        } : {
            opacity: 1,
            scale: 1,
            rotate: 0
        },
        exit: {
            opacity: 0,
            scale: 0,
            transition: {
                duration: 0.5
            }
        },
        transition: {
            type: "spring",
            stiffness: 280,
            damping: 20
        },
        onClick: (e)=>{
            e.stopPropagation();
            onClick(drone.id);
        },
        style: {
            position: "absolute",
            left: `${drone.x}%`,
            top: `${drone.y}%`,
            transform: "translate(-50%,-50%)",
            cursor: "pointer",
            animation: isRecalling ? "none" : "droneHover 2.4s ease-in-out infinite",
            zIndex: isActive ? 14 : 7,
            filter: `drop-shadow(${glowStr})`
        },
        children: [
            isActive && !isRecalling && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    inset: -16,
                    borderRadius: "50%",
                    border: `1px solid ${c}`,
                    opacity: 0.5,
                    animation: "pulseRing 1.8s ease-out infinite"
                }
            }, void 0, false, {
                fileName: "[project]/src/components/map/DroneMapIcon.jsx",
                lineNumber: 44,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                width: "28",
                height: "28",
                viewBox: "0 0 28 28",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                        points: "14,3 18,14 14,11 10,14",
                        fill: c,
                        opacity: "0.94"
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/DroneMapIcon.jsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this),
                    [
                        [
                            6,
                            10
                        ],
                        [
                            22,
                            10
                        ],
                        [
                            6,
                            20
                        ],
                        [
                            22,
                            20
                        ]
                    ].map(([cx, cy], i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: cx,
                            cy: cy,
                            r: "2.6",
                            fill: c,
                            opacity: "0.72"
                        }, i, false, {
                            fileName: "[project]/src/components/map/DroneMapIcon.jsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "6",
                        y1: "10",
                        x2: "14",
                        y2: "13.5",
                        stroke: c,
                        strokeWidth: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/DroneMapIcon.jsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "22",
                        y1: "10",
                        x2: "14",
                        y2: "13.5",
                        stroke: c,
                        strokeWidth: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/DroneMapIcon.jsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "6",
                        y1: "20",
                        x2: "14",
                        y2: "16",
                        stroke: c,
                        strokeWidth: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/DroneMapIcon.jsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "22",
                        y1: "20",
                        x2: "14",
                        y2: "16",
                        stroke: c,
                        strokeWidth: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/DroneMapIcon.jsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    drone.isRelay && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "14",
                        cy: "14",
                        r: "2.2",
                        fill: "none",
                        stroke: c,
                        strokeWidth: "0.8",
                        opacity: "0.6"
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/DroneMapIcon.jsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/map/DroneMapIcon.jsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    top: -18,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0,0,0,0.85)",
                    border: `1px solid ${c}44`,
                    borderRadius: 3,
                    padding: "1px 5px",
                    fontSize: 7,
                    color: c,
                    whiteSpace: "nowrap",
                    fontFamily: "'Share Tech Mono',monospace",
                    letterSpacing: 0.5
                },
                children: [
                    drone.id,
                    drone.mode === "MANUAL" ? " [M]" : ""
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/map/DroneMapIcon.jsx",
                lineNumber: 67,
                columnNumber: 7
            }, this)
        ]
    }, drone.id, true, {
        fileName: "[project]/src/components/map/DroneMapIcon.jsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/map/OverrideCursor.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OverrideCursor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function OverrideCursor({ x, y, isManual }) {
    const c = isManual ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"];
    const MotionDiv = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MotionDiv, {
        initial: {
            opacity: 0,
            scale: 0.3
        },
        animate: {
            opacity: 1,
            scale: 1
        },
        transition: {
            type: "spring",
            stiffness: 320,
            damping: 22
        },
        style: {
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            transform: "translate(-50%,-50%)",
            pointerEvents: "none",
            zIndex: 20
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                width: "54",
                height: "54",
                viewBox: "0 0 54 54",
                style: {
                    overflow: "visible"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "27",
                        cy: "27",
                        r: "23",
                        fill: "none",
                        stroke: c,
                        strokeWidth: "1.4",
                        strokeDasharray: "5 4",
                        style: {
                            animation: "sweep 5s linear infinite",
                            transformOrigin: "27px 27px"
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/OverrideCursor.jsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "27",
                        cy: "27",
                        r: "14",
                        fill: "none",
                        stroke: c,
                        strokeWidth: "0.7",
                        opacity: "0.45"
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/OverrideCursor.jsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    [
                        [
                            27,
                            2,
                            27,
                            11
                        ],
                        [
                            27,
                            43,
                            27,
                            52
                        ],
                        [
                            2,
                            27,
                            11,
                            27
                        ],
                        [
                            43,
                            27,
                            52,
                            27
                        ]
                    ].map(([x1, y1, x2, y2], i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: x1,
                            y1: y1,
                            x2: x2,
                            y2: y2,
                            stroke: c,
                            strokeWidth: "1.2"
                        }, i, false, {
                            fileName: "[project]/src/components/map/OverrideCursor.jsx",
                            lineNumber: 34,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "27",
                        cy: "27",
                        r: "3.5",
                        fill: c,
                        opacity: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/OverrideCursor.jsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/map/OverrideCursor.jsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    top: -20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: 7,
                    color: c,
                    fontFamily: "'Share Tech Mono',monospace",
                    whiteSpace: "nowrap",
                    letterSpacing: 1.2,
                    textShadow: `0 0 8px ${c}`
                },
                children: isManual ? "MANUAL OVERRIDE" : "AI CONTROL"
            }, void 0, false, {
                fileName: "[project]/src/components/map/OverrideCursor.jsx",
                lineNumber: 38,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/map/OverrideCursor.jsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/map/RelayLink.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RelayLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.js [app-ssr] (ecmascript)");
"use client";
;
;
function RelayLink({ edge, isHealLink, idx }) {
    const { a, b, isHuman, isHighlit } = edge;
    const stroke = isHealLink ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"] : isHuman ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"];
    const width = isHighlit ? 2.2 : isHealLink ? 1.8 : isHuman ? 1.2 : 0.8;
    const opacity = isHighlit ? 0.95 : isHealLink ? 0.9 : isHuman ? 0.7 : 0.35;
    const dash = isHighlit || isHealLink ? "none" : isHuman ? "none" : "5 6";
    const filter = isHighlit ? isHuman ? "url(#magGlow)" : "url(#cyanGlow)" : isHealLink ? "url(#healGlow)" : "none";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
        x1: `${a.x}%`,
        y1: `${a.y}%`,
        x2: `${b.x}%`,
        y2: `${b.y}%`,
        stroke: stroke,
        strokeWidth: width,
        strokeDasharray: dash,
        opacity: opacity,
        filter: filter,
        style: {
            animation: isHealLink ? "healPulse 1.2s ease-in-out infinite" : `meshPulse 3.2s ease-in-out ${idx * 0.25}s infinite`
        }
    }, void 0, false, {
        fileName: "[project]/src/components/map/RelayLink.jsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/map/MapGrid.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MapGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crosshair$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Crosshair$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/crosshair.js [app-ssr] (ecmascript) <export default as Crosshair>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useFleetStore.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2f$TopoGrid$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/map/TopoGrid.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2f$ThermalZone$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/map/ThermalZone.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2f$DroneMapIcon$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/map/DroneMapIcon.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2f$OverrideCursor$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/map/OverrideCursor.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2f$RelayLink$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/map/RelayLink.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
function MapGrid() {
    const drones = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.drones);
    const activeDrone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.activeDrone);
    const setActiveDrone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.setActiveDrone);
    const toggleMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.toggleMode);
    const getMeshEdges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.getMeshEdges);
    const healingLinks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.healingLinks);
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Target selection: pick the nearest drone to the click point
    const handleMapClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!mapRef.current) return;
        const rect = mapRef.current.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width * 100;
        const py = (e.clientY - rect.top) / rect.height * 100;
        let closest = null, minD = 8;
        drones.forEach((d)=>{
            const dist = Math.sqrt((d.x - px) ** 2 + (d.y - py) ** 2);
            if (dist < minD) {
                minD = dist;
                closest = d.id;
            }
        });
        setActiveDrone(closest);
    }, [
        drones,
        setActiveDrone
    ]);
    const edges = getMeshEdges();
    const activeD = drones.find((d)=>d.id === activeDrone);
    const aiLinks = edges.filter((e)=>!e.isHuman).length;
    const humanLinks = edges.filter((e)=>e.isHuman).length;
    const meshStatus = drones.length < 2 ? "OFFLINE" : healingLinks.size > 0 ? "HEALING" : edges.length >= Math.max(0, drones.length - 1) ? "OPTIMAL" : "DEGRADED";
    const meshColor = meshStatus === "OPTIMAL" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"] : meshStatus === "OFFLINE" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CRIT_RED"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WARN_AMB"];
    const sectorLabel = `SECTOR ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MISSION"]?.sector ?? "7G"}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            flex: 1,
            position: "relative",
            overflow: "hidden",
            background: "#02080f"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 12,
                    height: 54,
                    display: "flex",
                    alignItems: "center",
                    padding: "7px 12px",
                    background: "linear-gradient(180deg, rgba(0,10,22,0.92) 0%, rgba(0,6,16,0.82) 100%)",
                    borderBottom: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}22`,
                    boxShadow: "0 8px 22px rgba(0,0,0,0.35)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 96,
                            height: 34,
                            border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}22`,
                            borderRadius: 4,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "0 10px",
                            background: "rgba(0,0,0,0.35)",
                            gap: 2
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 9,
                                    color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}77`,
                                    fontFamily: "'Share Tech Mono'",
                                    letterSpacing: 2
                                },
                                children: "MESH"
                            }, void 0, false, {
                                fileName: "[project]/src/components/map/MapGrid.jsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 9,
                                    color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}55`,
                                    fontFamily: "'Share Tech Mono'",
                                    letterSpacing: 2
                                },
                                children: "PROTOCOL v4.2"
                            }, void 0, false, {
                                fileName: "[project]/src/components/map/MapGrid.jsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/map/MapGrid.jsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 18
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 2
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 9,
                                            color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}66`,
                                            fontFamily: "'Share Tech Mono'",
                                            letterSpacing: 2,
                                            textTransform: "uppercase",
                                            lineHeight: 1
                                        },
                                        children: [
                                            "COMMANDER VIEW · ",
                                            sectorLabel
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/map/MapGrid.jsx",
                                        lineNumber: 89,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontFamily: "'Orbitron',sans-serif",
                                            fontSize: 18,
                                            fontWeight: 900,
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"],
                                            letterSpacing: 3,
                                            lineHeight: 1.02,
                                            textTransform: "uppercase",
                                            textAlign: "center"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: "DECENTRALIZED"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/map/MapGrid.jsx",
                                                lineNumber: 109,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: "SWARM ALPHA"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/map/MapGrid.jsx",
                                                lineNumber: 110,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/map/MapGrid.jsx",
                                        lineNumber: 99,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/map/MapGrid.jsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    gap: 2,
                                    marginTop: 2
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 9,
                                            color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}66`,
                                            fontFamily: "'Share Tech Mono'",
                                            letterSpacing: 2
                                        },
                                        children: "NODES"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/map/MapGrid.jsx",
                                        lineNumber: 115,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontFamily: "'Orbitron',sans-serif",
                                            fontSize: 18,
                                            fontWeight: 900,
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"],
                                            letterSpacing: 2
                                        },
                                        children: [
                                            drones.length,
                                            "/",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAX_FLEET"]
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/map/MapGrid.jsx",
                                        lineNumber: 116,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/map/MapGrid.jsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/map/MapGrid.jsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 14
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    gap: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            width: 54
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 9,
                                                    color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}66`,
                                                    fontFamily: "'Share Tech Mono'",
                                                    letterSpacing: 2
                                                },
                                                children: "AI"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/map/MapGrid.jsx",
                                                lineNumber: 125,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 9,
                                                    color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}55`,
                                                    fontFamily: "'Share Tech Mono'",
                                                    letterSpacing: 2
                                                },
                                                children: "LINKS"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/map/MapGrid.jsx",
                                                lineNumber: 126,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontFamily: "'Orbitron',sans-serif",
                                                    fontSize: 16,
                                                    fontWeight: 900,
                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"],
                                                    letterSpacing: 2
                                                },
                                                children: aiLinks
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/map/MapGrid.jsx",
                                                lineNumber: 127,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/map/MapGrid.jsx",
                                        lineNumber: 124,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            width: 70
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 9,
                                                    color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"]}88`,
                                                    fontFamily: "'Share Tech Mono'",
                                                    letterSpacing: 2
                                                },
                                                children: "HUMAN"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/map/MapGrid.jsx",
                                                lineNumber: 130,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 9,
                                                    color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"]}66`,
                                                    fontFamily: "'Share Tech Mono'",
                                                    letterSpacing: 2
                                                },
                                                children: "LINKS"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/map/MapGrid.jsx",
                                                lineNumber: 131,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontFamily: "'Orbitron',sans-serif",
                                                    fontSize: 16,
                                                    fontWeight: 900,
                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"],
                                                    letterSpacing: 2
                                                },
                                                children: humanLinks
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/map/MapGrid.jsx",
                                                lineNumber: 132,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/map/MapGrid.jsx",
                                        lineNumber: 129,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/map/MapGrid.jsx",
                                lineNumber: 123,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    height: 34,
                                    padding: "0 10px",
                                    borderRadius: 4,
                                    border: `1px solid ${meshColor}44`,
                                    background: "rgba(0,0,0,0.35)",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "flex-end",
                                    gap: 2,
                                    minWidth: 98
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 9,
                                            color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}55`,
                                            fontFamily: "'Share Tech Mono'",
                                            letterSpacing: 2
                                        },
                                        children: "MESH"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/map/MapGrid.jsx",
                                        lineNumber: 149,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontFamily: "'Orbitron',sans-serif",
                                            fontSize: 14,
                                            fontWeight: 900,
                                            color: meshColor,
                                            letterSpacing: 2
                                        },
                                        children: meshStatus
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/map/MapGrid.jsx",
                                        lineNumber: 150,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/map/MapGrid.jsx",
                                lineNumber: 136,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/map/MapGrid.jsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/map/MapGrid.jsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: mapRef,
                onClick: handleMapClick,
                style: {
                    position: "absolute",
                    inset: 0,
                    top: 54,
                    cursor: "crosshair"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2f$TopoGrid$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/components/map/MapGrid.jsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2f$ThermalZone$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/components/map/MapGrid.jsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        style: {
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            opacity: 0.15,
                            pointerEvents: "none"
                        },
                        viewBox: "0 0 900 540",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                style: {
                                    transformOrigin: "450px 270px",
                                    animation: "sweep 7s linear infinite"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M450 270 L850 270 A400 400 0 0 0 450 -130 Z",
                                    fill: "url(#swpG)"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/map/MapGrid.jsx",
                                    lineNumber: 166,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/map/MapGrid.jsx",
                                lineNumber: 165,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                    id: "swpG",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                            offset: "0%",
                                            stopColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"],
                                            stopOpacity: "0.8"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/map/MapGrid.jsx",
                                            lineNumber: 170,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                            offset: "100%",
                                            stopColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"],
                                            stopOpacity: "0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/map/MapGrid.jsx",
                                            lineNumber: 171,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/map/MapGrid.jsx",
                                    lineNumber: 169,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/map/MapGrid.jsx",
                                lineNumber: 168,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/map/MapGrid.jsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        style: {
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            pointerEvents: "none"
                        },
                        children: [
                            drones.map((d)=>d.trail?.map((pt, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: `${pt.x}%`,
                                        cy: `${pt.y}%`,
                                        r: 1.5 - idx * 0.15,
                                        fill: d.color || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"],
                                        opacity: 0.05 + idx * 0.04
                                    }, `tr-${d.id}-${idx}`, false, {
                                        fileName: "[project]/src/components/map/MapGrid.jsx",
                                        lineNumber: 181,
                                        columnNumber: 13
                                    }, this))),
                            edges.map((edge, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2f$RelayLink$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    edge: edge,
                                    idx: i
                                }, edge.key, false, {
                                    fileName: "[project]/src/components/map/MapGrid.jsx",
                                    lineNumber: 186,
                                    columnNumber: 35
                                }, this)),
                            drones.filter((d)=>d.healTarget).map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: `${d.healTarget.x}%`,
                                            cy: `${d.healTarget.y}%`,
                                            r: "8",
                                            fill: "none",
                                            stroke: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"],
                                            strokeWidth: "1",
                                            strokeDasharray: "3 4",
                                            style: {
                                                animation: "blink 1s infinite"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/map/MapGrid.jsx",
                                            lineNumber: 191,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: `${d.x}%`,
                                            y1: `${d.y}%`,
                                            x2: `${d.healTarget.x}%`,
                                            y2: `${d.healTarget.y}%`,
                                            stroke: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"],
                                            strokeWidth: "1.5",
                                            strokeDasharray: "4 5",
                                            opacity: "0.6"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/map/MapGrid.jsx",
                                            lineNumber: 193,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, `heal-${d.id}`, true, {
                                    fileName: "[project]/src/components/map/MapGrid.jsx",
                                    lineNumber: 190,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/map/MapGrid.jsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: drones.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Fragment, {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2f$ThermalZone$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        x: d.x,
                                        y: d.y,
                                        color: d.color,
                                        isActive: activeDrone === d.id
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/map/MapGrid.jsx",
                                        lineNumber: 204,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2f$DroneMapIcon$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        drone: d,
                                        isActive: activeDrone === d.id,
                                        onClick: setActiveDrone
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/map/MapGrid.jsx",
                                        lineNumber: 207,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, d.id, true, {
                                fileName: "[project]/src/components/map/MapGrid.jsx",
                                lineNumber: 202,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/MapGrid.jsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this),
                    activeD && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2f$OverrideCursor$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        x: activeD.x,
                        y: activeD.y,
                        isManual: activeD.mode === "MANUAL"
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/MapGrid.jsx",
                        lineNumber: 217,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/map/MapGrid.jsx",
                lineNumber: 155,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    bottom: 22,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 12,
                    zIndex: 20
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>activeDrone && toggleMode(activeDrone),
                        disabled: !activeDrone,
                        style: {
                            background: activeDrone ? "rgba(255,0,204,0.12)" : "rgba(255,255,255,0.03)",
                            border: `1px solid ${activeDrone ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"] : "#333"}`,
                            color: activeDrone ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"] : "#555",
                            padding: "8px 24px",
                            borderRadius: 4,
                            cursor: activeDrone ? "pointer" : "not-allowed",
                            fontFamily: "'Share Tech Mono'",
                            fontSize: 11,
                            letterSpacing: 1.5,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            transition: "all 0.3s"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crosshair$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Crosshair$3e$__["Crosshair"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/src/components/map/MapGrid.jsx",
                                lineNumber: 233,
                                columnNumber: 11
                            }, this),
                            " ",
                            activeDrone ? `OVERRIDE ${activeDrone}` : "AWAITING SELECTION"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/map/MapGrid.jsx",
                        lineNumber: 222,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        style: {
                            background: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"],
                            color: "#000",
                            fontWeight: 900,
                            padding: "8px 24px",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontFamily: "'Orbitron'",
                            fontSize: 11,
                            letterSpacing: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            boxShadow: `0 0 20px ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}66`
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/src/components/map/MapGrid.jsx",
                                lineNumber: 244,
                                columnNumber: 11
                            }, this),
                            " SYNC MESH"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/map/MapGrid.jsx",
                        lineNumber: 236,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/map/MapGrid.jsx",
                lineNumber: 221,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/map/MapGrid.jsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/logs/LogEntry.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LogEntry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const MSG_COLOR = (type)=>{
    if (type === "DECISION") return "#ff8899";
    if (type === "MANUAL" || type === "RECALL") return "#ff99ee";
    if (type === "COT" || type === "HEAL") return `rgba(0,245,255,0.78)`;
    if (type === "PROMPT") return "#ffee88";
    return `rgba(0,245,255,0.7)`;
};
function LogEntry({ item }) {
    const meta = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TYPE_META"][item.type] ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TYPE_META"].INFO;
    const hasBox = !!meta.bg && meta.bg !== "transparent";
    const MotionDiv = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MotionDiv, {
        initial: {
            opacity: 0,
            y: 10,
            x: item.type === "MANUAL" || item.type === "RECALL" ? -6 : 4
        },
        animate: {
            opacity: 1,
            y: 0,
            x: 0
        },
        transition: {
            duration: 0.3,
            ease: "easeOut"
        },
        style: {
            fontSize: 9,
            lineHeight: 1.6,
            background: hasBox ? meta.bg : "transparent",
            border: hasBox ? `1px solid ${meta.border}` : "none",
            borderRadius: hasBox ? 4 : 0,
            padding: hasBox ? "5px 8px" : "1px 2px"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    color: "rgba(0,245,255,0.28)",
                    marginRight: 2
                },
                children: [
                    "[",
                    item.time,
                    "]"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/logs/LogEntry.jsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    color: meta.color,
                    fontWeight: 700,
                    marginRight: 4,
                    textDecoration: item.type === "ANALYSIS" ? "underline" : "none"
                },
                children: [
                    item.type,
                    ":"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/logs/LogEntry.jsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    color: MSG_COLOR(item.type)
                },
                children: item.msg
            }, void 0, false, {
                fileName: "[project]/src/components/logs/LogEntry.jsx",
                lineNumber: 41,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/logs/LogEntry.jsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/logs/SignalChart.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SignalChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.js [app-ssr] (ecmascript)");
"use client";
;
;
function SignalChart({ bars }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: "flex",
            alignItems: "flex-end",
            gap: 2,
            height: 56,
            padding: "4px 0"
        },
        children: bars.map((h, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    height: `${h}%`,
                    borderRadius: "2px 2px 0 0",
                    background: i === bars.length - 1 ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"] : `rgba(0,245,255,${0.22 + i * 0.025})`,
                    boxShadow: i === bars.length - 1 ? `0 0 7px ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"]}` : "none",
                    transition: "height 0.5s ease"
                }
            }, i, false, {
                fileName: "[project]/src/components/logs/SignalChart.jsx",
                lineNumber: 14,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/logs/SignalChart.jsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/logs/AIIntelligenceHub.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AIIntelligenceHub
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-ssr] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link-2.js [app-ssr] (ecmascript) <export default as Link2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-off.js [app-ssr] (ecmascript) <export default as ShieldOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-ssr] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/brain.js [app-ssr] (ecmascript) <export default as Brain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useFleetStore.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$logs$2f$LogEntry$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/logs/LogEntry.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$logs$2f$SignalChart$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/logs/SignalChart.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
const ACTION_BTNS = [
    {
        l: "RE-CALIBRATE",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
            size: 10
        }, void 0, false, {
            fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
            lineNumber: 11,
            columnNumber: 30
        }, ("TURBOPACK compile-time value", void 0)),
        c: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]
    },
    {
        l: "ESTABLISH_LINK",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
            size: 10
        }, void 0, false, {
            fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
            lineNumber: 12,
            columnNumber: 30
        }, ("TURBOPACK compile-time value", void 0)),
        c: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]
    },
    {
        l: "ABORT_MSN",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldOff$3e$__["ShieldOff"], {
            size: 10
        }, void 0, false, {
            fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
            lineNumber: 13,
            columnNumber: 30
        }, ("TURBOPACK compile-time value", void 0)),
        c: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CRIT_RED"]
    },
    {
        l: "ENCRYPT_FEED",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
            size: 10
        }, void 0, false, {
            fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
            lineNumber: 14,
            columnNumber: 30
        }, ("TURBOPACK compile-time value", void 0)),
        c: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]
    }
];
function AIIntelligenceHub() {
    const log = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.log);
    const sigBars = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.sigBars);
    const latency = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.latency);
    const recalling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.recalling);
    const intelText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.intelText);
    const setIntelText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.setIntelText);
    const submitIntel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useFleetStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFleetStore"])((s)=>s.submitIntel);
    const logRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [
        log
    ]);
    const healing = recalling.size > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: 318,
            background: "rgba(0,4,16,0.84)",
            borderLeft: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}18`,
            display: "flex",
            flexDirection: "column",
            backdropFilter: "blur(12px)",
            flexShrink: 0
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "10px 13px",
                    borderBottom: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}14`
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontFamily: "'Orbitron',sans-serif",
                                fontSize: 10,
                                letterSpacing: 3,
                                color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]
                            },
                            children: "AI INTELLIGENCE HUB"
                        }, void 0, false, {
                            fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                alignItems: "center",
                                gap: 5
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: 5,
                                        height: 5,
                                        borderRadius: "50%",
                                        background: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"],
                                        animation: "blink 1.2s infinite",
                                        boxShadow: `0 0 5px ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"]}`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                                    lineNumber: 50,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"], {
                                    size: 10,
                                    color: "#ffdd55"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                                    lineNumber: 51,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: 7,
                                        color: "#ffdd55",
                                        letterSpacing: 1
                                    },
                                    children: "LLAMA-3.2 ACTIVE"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "9px 13px",
                    borderBottom: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}0e`
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 9,
                            letterSpacing: 2,
                            color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}55`,
                            marginBottom: 4
                        },
                        children: "SIGNAL PROPAGATION"
                    }, void 0, false, {
                        fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$logs$2f$SignalChart$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        bars: sigBars
                    }, void 0, false, {
                        fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 8,
                            color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}44`
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "LATENCY: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]
                                        },
                                        children: [
                                            latency.toFixed(1),
                                            "MS"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                                        lineNumber: 62,
                                        columnNumber: 26
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"]
                                },
                                children: [
                                    "MESH: ▲ ",
                                    healing ? "HEALING" : "OPTIMAL"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "8px 13px",
                    borderBottom: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}0e`,
                    display: "flex",
                    gap: 10
                },
                children: [
                    {
                        title: "AI AUTONOMOUS",
                        c: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"],
                        desc: "Auto-routing, collision avoidance, coverage optimization"
                    },
                    {
                        title: "HUMAN OVERRIDE",
                        c: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"],
                        desc: "Manual waypoints, survivor tracking, recall authority"
                    }
                ].map(({ title, c, desc })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            background: "rgba(0,0,0,0.3)",
                            border: `1px solid ${c}22`,
                            borderRadius: 4,
                            padding: "6px 8px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 8,
                                    color: c,
                                    letterSpacing: 1,
                                    marginBottom: 3,
                                    fontFamily: "'Orbitron',sans-serif"
                                },
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 7,
                                    color: `${c}66`,
                                    lineHeight: 1.5
                                },
                                children: desc
                            }, void 0, false, {
                                fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this)
                        ]
                    }, title, true, {
                        fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                        lineNumber: 73,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "8px 13px",
                    borderBottom: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}0e`
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 9,
                            letterSpacing: 2,
                            color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}55`,
                            marginBottom: 5
                        },
                        children: "HUMAN INTEL INPUT"
                    }, void 0, false, {
                        fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "relative"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: intelText,
                                onChange: (e)=>setIntelText(e.target.value),
                                onKeyDown: (e)=>{
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        submitIntel();
                                    }
                                },
                                placeholder: "Enter field intel, survivor sighting, tactical override...",
                                rows: 3,
                                style: {
                                    width: "100%",
                                    background: `rgba(0,245,255,0.03)`,
                                    border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}28`,
                                    borderRadius: 4,
                                    color: "#aaffee",
                                    fontFamily: "'Share Tech Mono',monospace",
                                    fontSize: 9,
                                    padding: "7px 10px",
                                    resize: "none",
                                    outline: "none",
                                    lineHeight: 1.6
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: submitIntel,
                                style: {
                                    position: "absolute",
                                    bottom: 7,
                                    right: 7,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    background: `rgba(0,245,255,0.12)`,
                                    border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}44`,
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"],
                                    fontFamily: "'Share Tech Mono',monospace",
                                    fontSize: 8,
                                    padding: "3px 8px",
                                    borderRadius: 3,
                                    cursor: "pointer",
                                    letterSpacing: 1
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                        size: 9
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                                        lineNumber: 105,
                                        columnNumber: 13
                                    }, this),
                                    " SUBMIT"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                                lineNumber: 96,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 7,
                            color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}28`,
                            marginTop: 3
                        },
                        children: "ENTER to submit · SHIFT+ENTER newline"
                    }, void 0, false, {
                        fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    padding: "8px 13px",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 7
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: "'Orbitron',sans-serif",
                                    fontSize: 10,
                                    letterSpacing: 2,
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]
                                },
                                children: "MISSION LOG"
                            }, void 0, false, {
                                fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    gap: 5,
                                    alignItems: "center"
                                },
                                children: [
                                    healing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 7,
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OK_GREEN"],
                                            animation: "blink 0.7s infinite",
                                            letterSpacing: 1
                                        },
                                        children: "⬡ SELF-HEALING"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                                        lineNumber: 117,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: `rgba(0,245,255,0.07)`,
                                            border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}28`,
                                            borderRadius: 3,
                                            padding: "1px 6px",
                                            fontSize: 7,
                                            color: "#7ecfff"
                                        },
                                        children: "REAL-TIME"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                                        lineNumber: 119,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: logRef,
                        style: {
                            flex: 1,
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: 4
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                initial: false,
                                children: log.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$logs$2f$LogEntry$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        item: item
                                    }, item.id, false, {
                                        fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                                        lineNumber: 127,
                                        columnNumber: 30
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    height: 4
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: 9,
                    borderTop: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}0e`,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 6
                },
                children: ACTION_BTNS.map((btn)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 5,
                            background: `rgba(${btn.c === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CRIT_RED"] ? "255,51,85" : "0,245,255"},0.05)`,
                            border: `1px solid ${btn.c}33`,
                            color: btn.c,
                            fontFamily: "'Share Tech Mono',monospace",
                            fontSize: 8,
                            padding: "8px 6px",
                            borderRadius: 4,
                            cursor: "pointer",
                            letterSpacing: 1.1,
                            transition: "all 0.2s"
                        },
                        onMouseEnter: (e)=>e.currentTarget.style.background = `rgba(${btn.c === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CRIT_RED"] ? "255,51,85" : "0,245,255"},0.14)`,
                        onMouseLeave: (e)=>e.currentTarget.style.background = `rgba(${btn.c === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CRIT_RED"] ? "255,51,85" : "0,245,255"},0.05)`,
                        children: [
                            btn.icon,
                            btn.l
                        ]
                    }, btn.l, true, {
                        fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
                lineNumber: 134,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/logs/AIIntelligenceHub.jsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/system/SystemFooter.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SystemFooter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function SystemFooter() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            height: 24,
            background: "rgba(0,0,0,0.55)",
            borderTop: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}18`,
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            justifyContent: "space-between",
            fontSize: 8,
            color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}38`,
            flexShrink: 0
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 5
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                        size: 9,
                        color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}66`
                    }, void 0, false, {
                        fileName: "[project]/src/components/system/SystemFooter.jsx",
                        lineNumber: 16,
                        columnNumber: 9
                    }, this),
                    "SECURE_ENCRYPTED_LINK_ESTABLISHED"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/system/SystemFooter.jsx",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    color: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]}55`
                },
                children: [
                    "◆ ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AI_CYAN"]
                        },
                        children: "CYAN"
                    }, void 0, false, {
                        fileName: "[project]/src/components/system/SystemFooter.jsx",
                        lineNumber: 20,
                        columnNumber: 11
                    }, this),
                    " = AI AUTONOMOUS  |  ◆ ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUMAN_MAG"]
                        },
                        children: "MAGENTA"
                    }, void 0, false, {
                        fileName: "[project]/src/components/system/SystemFooter.jsx",
                        lineNumber: 21,
                        columnNumber: 11
                    }, this),
                    " = HUMAN OVERRIDE"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/system/SystemFooter.jsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: [
                    "AUTH: ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: "#ffdd55"
                        },
                        children: "COMMAND_OVERRIDE"
                    }, void 0, false, {
                        fileName: "[project]/src/components/system/SystemFooter.jsx",
                        lineNumber: 23,
                        columnNumber: 19
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/system/SystemFooter.jsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: "MESH: DYNAMIC_DAISY_CHAIN_v3"
            }, void 0, false, {
                fileName: "[project]/src/components/system/SystemFooter.jsx",
                lineNumber: 24,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/system/SystemFooter.jsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0aa9959a._.js.map