"""
run_viz.py - Visualises the Mesa disaster simulation.
Saves each step as a PNG frame in simulation_frames/ and prints state to console.
"""
import os
import json
import matplotlib
matplotlib.use("Agg")  # non-interactive backend — works without a display
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

from vhack_engine.simulation.disaster_model import DisasterModel

STEPS = 20
GRID_SIZE = 20
OUTPUT_DIR = "simulation_frames"

os.makedirs(OUTPUT_DIR, exist_ok=True)

model = DisasterModel(num_drones=3, num_survivors=5, width=GRID_SIZE, height=GRID_SIZE)

for step in range(STEPS):
    model.step()
    state = model.get_state()

    # --- Console output ---
    print(f"\n=== Step {state['step']} ===")
    for d in state["drones"]:
        print(f"  Drone {d['id']:>2}  pos={d['pos']}  battery={d['battery']:.1f}%")
    for s in state["survivors"]:
        status = "RESCUED" if s["rescued"] else f"health={s['health']:.1f}"
        print(f"  Survivor {s['id']:>2}  pos={s['pos']}  {status}")

    # --- Plot ---
    fig, ax = plt.subplots(figsize=(7, 7))
    ax.set_xlim(-0.5, GRID_SIZE - 0.5)
    ax.set_ylim(-0.5, GRID_SIZE - 0.5)
    ax.set_xticks(range(GRID_SIZE))
    ax.set_yticks(range(GRID_SIZE))
    ax.grid(True, color="lightgray", linewidth=0.5)
    ax.set_facecolor("#1a1a2e")
    ax.set_title(f"Disaster Simulation — Step {state['step']}", color="white", fontsize=13)
    fig.patch.set_facecolor("#1a1a2e")
    ax.tick_params(colors="gray")

    # Draw survivors
    for s in state["survivors"]:
        x, y = s["pos"]
        color = "#555555" if s["rescued"] else "#ff4d4d"
        ax.plot(x, y, "o", color=color, markersize=14, zorder=2)
        ax.text(x, y - 0.55, f"{s['health']:.0f}", color="white",
                ha="center", fontsize=6, zorder=3)

    # Draw drones
    for d in state["drones"]:
        x, y = d["pos"]
        ax.plot(x, y, "s", color="#00bfff", markersize=16, zorder=3)
        ax.text(x, y + 0.55, f"{d['battery']:.0f}%", color="white",
                ha="center", fontsize=6, zorder=4)
        ax.text(x, y, f"D{d['id']}", color="black",
                ha="center", va="center", fontsize=7, fontweight="bold", zorder=5)

    # Legend
    legend = [
        mpatches.Patch(color="#00bfff", label="Drone"),
        mpatches.Patch(color="#ff4d4d", label="Survivor"),
        mpatches.Patch(color="#555555", label="Rescued"),
    ]
    ax.legend(handles=legend, loc="upper right", facecolor="#2a2a4a", labelcolor="white")

    fname = os.path.join(OUTPUT_DIR, f"step_{state['step']:03d}.png")
    plt.savefig(fname, dpi=100, bbox_inches="tight")
    plt.close(fig)
    print(f"  Saved: {fname}")

print(f"\nDone. {STEPS} frames saved to '{OUTPUT_DIR}/'")
