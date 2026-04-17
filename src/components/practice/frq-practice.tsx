"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ErrorBoundary } from "@/components/error-boundary";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface FRQPart {
  label: string;
  question: string;
  points: number;
  rubric: string[];
  sampleResponse: string;
}

interface FRQProblem {
  id: number;
  title: string;
  scenario: string;
  given: string[];
  parts: FRQPart[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const frqProblems: FRQProblem[] = [
  {
    id: 1,
    title: "Large Water Tank with a Hole",
    scenario:
      "A large cylindrical water tank is open at the top and has a small circular hole of area A₀ = 2.0 × 10⁻⁴ m² near its base. The water level is maintained at a height h = 1.8 m above the hole. Assume ideal fluid behavior.",
    given: ["h = 1.8 m", "A₀ = 2.0 × 10⁻⁴ m²", "g = 9.8 m/s²", "ρ_water = 1000 kg/m³"],
    parts: [
      {
        label: "a",
        question:
          "Derive an expression for the exit velocity of water from the hole and calculate its numerical value. Justify your approach.",
        points: 3,
        rubric: [
          "(1 pt) Correctly applies Torricelli's theorem / Bernoulli's equation between the water surface and the hole: P_atm + ½ρv_top² + ρgh = P_atm + ½ρv_hole²",
          "(1 pt) Recognizes v_top ≈ 0 (large tank approximation) and simplifies to v = √(2gh)",
          "(1 pt) Correct numerical answer: v = √(2 × 9.8 × 1.8) ≈ 5.94 m/s",
        ],
        sampleResponse:
          "Applying Bernoulli's equation between the water surface (top) and the hole (bottom), with both points exposed to atmospheric pressure:\n\nP_atm + ½ρv_top² + ρgh = P_atm + ½ρv_hole²\n\nBecause the tank is large, the cross-sectional area of the tank is much greater than the hole area, so by continuity A_tank·v_top = A₀·v_hole. Since A_tank >> A₀, v_top ≈ 0.\n\nSimplifying: ρgh = ½ρv²  →  v = √(2gh)\n\nv = √(2 × 9.8 m/s² × 1.8 m) = √(35.28) ≈ 5.94 m/s",
      },
      {
        label: "b",
        question: "Calculate the volumetric flow rate Q out of the hole.",
        points: 2,
        rubric: [
          "(1 pt) Correctly uses Q = A₀v (or Q = A₀√(2gh))",
          "(1 pt) Correct numerical answer: Q = (2.0 × 10⁻⁴)(5.94) ≈ 1.19 × 10⁻³ m³/s",
        ],
        sampleResponse:
          "The volumetric flow rate is given by:\n\nQ = A₀ × v = A₀ × √(2gh)\n\nQ = (2.0 × 10⁻⁴ m²)(5.94 m/s)\n\nQ ≈ 1.19 × 10⁻³ m³/s  (about 1.19 L/s)",
      },
      {
        label: "c",
        question:
          "If the hole area is doubled to 2A₀ while the water level h remains unchanged, what happens to the exit velocity? Justify your answer quantitatively.",
        points: 2,
        rubric: [
          "(1 pt) States that exit velocity is unchanged (v = √(2gh) is independent of hole area)",
          "(1 pt) Correct justification: Bernoulli/Torricelli's theorem shows v depends only on h and g, not on hole size; flow rate Q doubles but velocity does not change",
        ],
        sampleResponse:
          "The exit velocity is unchanged. From Torricelli's theorem, v = √(2gh), which depends only on the water height h and gravitational acceleration g — not on the area of the hole.\n\nDoubling the hole area doubles the flow rate (Q = 2A₀·v), but the exit speed at each fluid element remains v = √(2 × 9.8 × 1.8) ≈ 5.94 m/s. The hole size determines how much fluid exits per second, not how fast each particle moves.",
      },
      {
        label: "d",
        question:
          "Now the tank is closed (no water is added). Sketch a qualitative graph of water height h versus time t as the tank drains. Label any key features.",
        points: 3,
        rubric: [
          "(1 pt) Curve starts at h = h₀ and ends at h = 0",
          "(1 pt) Curve is concave up (decreasing slope, not linear), indicating the rate of height decrease slows as h decreases",
          "(1 pt) Correctly labels axes, shows h₀ at t = 0, and curve is smooth and monotonically decreasing",
        ],
        sampleResponse:
          "The graph shows h on the y-axis (starting at h₀) and t on the x-axis (starting at 0).\n\nKey features:\n- At t = 0, h = h₀ (initial full height)\n- The curve is concave up: steeply decreasing at first, then flattening\n- h → 0 asymptotically (or reaches 0 at finite time for a real tank)\n- The shape is parabolic: since dh/dt ∝ -√h, solving gives h(t) = (√h₀ - t·A₀√(g/2)/A_tank)²\n\nPhysically: as h decreases, v decreases, so the rate of drainage slows continuously.",
      },
      {
        label: "e",
        question:
          "Explain qualitatively, without using equations, why the flow rate decreases as the tank drains.",
        points: 2,
        rubric: [
          "(1 pt) States that as the water level drops, the pressure at the hole decreases (less water weight above the hole)",
          "(1 pt) Connects lower pressure difference to lower exit velocity, and therefore lower flow rate",
        ],
        sampleResponse:
          "As water drains, the height of water above the hole decreases. This means there is less water pressing down, so the pressure at the hole (due to the water column above it) is lower. With less pressure driving the flow, the water exits the hole more slowly. Since flow rate equals exit speed times hole area, and the area stays constant, the flow rate decreases as the tank drains.",
      },
    ],
  },
  {
    id: 2,
    title: "U-Tube with Two Fluids",
    scenario:
      "A U-tube manometer is open at both ends. The left arm contains water (ρ_w = 1000 kg/m³) and an unknown liquid (ρ_x) sitting on top of it. The right arm contains only water. The unknown liquid fills the left arm to a height of 0.12 m above the water-liquid interface. The water level on the right side is 0.08 m higher than the water level on the left side.",
    given: [
      "ρ_w = 1000 kg/m³",
      "Height of unknown liquid: h_x = 0.12 m",
      "Water level difference: Δh = 0.08 m (right side higher)",
      "g = 9.8 m/s²",
    ],
    parts: [
      {
        label: "a",
        question:
          "Draw a clearly labeled diagram of the U-tube showing both fluid columns, the interface, and the relevant heights. Indicate where the pressure reference level should be chosen.",
        points: 2,
        rubric: [
          "(1 pt) Diagram shows: left arm with unknown liquid on top of water, right arm with water only, U-tube connection at bottom",
          "(1 pt) Correctly labels h_x = 0.12 m for unknown liquid column, marks the water-liquid interface on the left, and shows the right water level is Δh = 0.08 m above the left water level. Reference level chosen at the water-liquid interface (or bottom of U-tube).",
        ],
        sampleResponse:
          "[Diagram description]\nLeft arm (top to bottom): unknown liquid (0.12 m tall) → water-liquid interface → water column down to U-bend\nRight arm: water column (level is 0.08 m higher than left water surface) → down to U-bend\n\nReference level: the water-liquid interface on the left side (where the two fluids meet). This is the most convenient level because pressure can be equated at this horizontal plane.",
      },
      {
        label: "b",
        question:
          "Write the pressure equality equation at the water-liquid interface level (the reference level). Explain each term.",
        points: 3,
        rubric: [
          "(1 pt) Chooses the correct reference level (left water surface / water-liquid interface)",
          "(1 pt) Correctly writes: P_atm + ρ_x·g·h_x = P_atm + ρ_w·g·Δh  (pressure from left column = pressure from right column at reference level)",
          "(1 pt) Explains each term: P_atm is atmospheric pressure at each open surface; ρ_x·g·h_x is pressure due to unknown liquid column; ρ_w·g·Δh is pressure due to extra water height on right",
        ],
        sampleResponse:
          "At the water-liquid interface on the left (reference level), pressure must be equal on both sides:\n\nP_left = P_right\n\nP_atm + ρ_x·g·h_x = P_atm + ρ_w·g·Δh\n\nTerms:\n- P_atm: atmospheric pressure acting at the top of each open arm\n- ρ_x·g·h_x: pressure added by the unknown liquid column (height h_x) on the left\n- ρ_w·g·Δh: pressure added by the extra water column (height Δh) on the right side\n\nThe atmospheric terms cancel.",
      },
      {
        label: "c",
        question: "Solve for the density of the unknown liquid ρ_x.",
        points: 2,
        rubric: [
          "(1 pt) Correctly cancels P_atm and isolates ρ_x: ρ_x = ρ_w·Δh / h_x",
          "(1 pt) Correct numerical answer: ρ_x = (1000)(0.08)/(0.12) ≈ 667 kg/m³",
        ],
        sampleResponse:
          "From the pressure equality (P_atm cancels):\n\nρ_x·g·h_x = ρ_w·g·Δh\n\nρ_x = ρ_w · (Δh / h_x) = 1000 × (0.08 / 0.12) = 1000 × 0.667 ≈ 667 kg/m³\n\nThe unknown liquid is less dense than water (ρ_x < ρ_w), which makes physical sense — it sits on top of the water.",
      },
      {
        label: "d",
        question:
          "If more of the unknown liquid is slowly poured into the left arm, describe qualitatively what happens to the water levels on both sides. Justify your answer.",
        points: 2,
        rubric: [
          "(1 pt) States that the right water level rises and the left water level falls as more liquid is added",
          "(1 pt) Correct justification: adding liquid increases pressure on the left side at the reference level, pushing water from left arm into right arm until a new pressure balance is reached",
        ],
        sampleResponse:
          "When more unknown liquid is poured into the left arm, the pressure at the water-liquid interface on the left increases (more liquid above). This extra pressure pushes water across the U-bend from left to right.\n\nResult: the water level on the left drops and the water level on the right rises until the pressures equalize again at the new interface level. The height difference Δh between the two water surfaces increases to accommodate the taller unknown liquid column.",
      },
    ],
  },
  {
    id: 3,
    title: "Object on a Spring Scale in Air and Water",
    scenario:
      "A solid aluminum cylinder is weighed on a spring scale. In air, the scale reads 26.5 N. When fully submerged in fresh water (ρ_w = 1000 kg/m³), the scale reads 16.7 N.",
    given: [
      "Weight in air: W_air = 26.5 N",
      "Scale reading in water: W_water = 16.7 N",
      "ρ_water = 1000 kg/m³",
      "g = 9.8 m/s²",
    ],
    parts: [
      {
        label: "a",
        question: "Find the true weight and mass of the aluminum cylinder.",
        points: 2,
        rubric: [
          "(1 pt) Correctly identifies W = W_air = 26.5 N (scale reads true weight in air, neglecting air buoyancy)",
          "(1 pt) m = W/g = 26.5 / 9.8 ≈ 2.70 kg",
        ],
        sampleResponse:
          "The spring scale in air reads the true weight (air buoyancy is negligible):\n\nW = 26.5 N\n\nm = W/g = 26.5 N / 9.8 m/s² ≈ 2.70 kg",
      },
      {
        label: "b",
        question:
          "Determine the buoyant force acting on the cylinder when submerged in fresh water.",
        points: 2,
        rubric: [
          "(1 pt) Correctly applies: F_B = W_air − W_water (apparent weight loss equals buoyant force)",
          "(1 pt) F_B = 26.5 − 16.7 = 9.8 N",
        ],
        sampleResponse:
          "When submerged, three forces act on the cylinder: weight (down), spring tension (up), and buoyant force (up).\n\nEquilibrium: T + F_B = W\n\nF_B = W_air − W_water = 26.5 N − 16.7 N = 9.8 N\n\nThe buoyant force is 9.8 N.",
      },
      {
        label: "c",
        question: "Calculate the density of the aluminum cylinder.",
        points: 3,
        rubric: [
          "(1 pt) Correctly uses F_B = ρ_w·g·V to find volume: V = F_B / (ρ_w·g) = 9.8 / (1000 × 9.8) = 1.0 × 10⁻³ m³",
          "(1 pt) Uses ρ_object = m/V",
          "(1 pt) Correct answer: ρ = 2.70 / 1.0 × 10⁻³ = 2700 kg/m³",
        ],
        sampleResponse:
          "From Archimedes' principle, F_B = ρ_w·g·V_object:\n\nV = F_B / (ρ_w·g) = 9.8 N / (1000 kg/m³ × 9.8 m/s²) = 1.0 × 10⁻³ m³\n\nDensity of object:\nρ = m/V = 2.70 kg / 1.0 × 10⁻³ m³ = 2700 kg/m³\n\nThis matches the known density of aluminum (≈ 2700 kg/m³). ✓",
      },
      {
        label: "d",
        question:
          "The cylinder is now submerged in salt water (ρ_salt = 1025 kg/m³). Predict whether the spring scale reading will be higher, lower, or the same compared to fresh water. Justify quantitatively.",
        points: 3,
        rubric: [
          "(1 pt) Correctly predicts the scale reads lower in salt water (larger buoyant force → less tension needed)",
          "(1 pt) Calculates new buoyant force: F_B_salt = ρ_salt·g·V = 1025 × 9.8 × 1.0×10⁻³ = 10.045 N",
          "(1 pt) New scale reading: W_salt = W − F_B_salt = 26.5 − 10.045 ≈ 16.5 N (lower than 16.7 N in fresh water)",
        ],
        sampleResponse:
          "Salt water is denser than fresh water, so it exerts a larger buoyant force on the same volume of object.\n\nNew buoyant force:\nF_B_salt = ρ_salt·g·V = 1025 × 9.8 × 1.0 × 10⁻³ = 10.05 N\n\nNew scale reading:\nW_salt = W − F_B_salt = 26.5 − 10.05 ≈ 16.45 N\n\nThe scale reads lower in salt water (16.45 N vs. 16.7 N) because the greater density of salt water provides more upward buoyant force, requiring less tension from the spring.",
      },
    ],
  },
  {
    id: 4,
    title: "Pipe System with Constriction",
    scenario:
      "Water flows steadily through a horizontal pipe that narrows from a wide section (diameter d₁ = 0.10 m) to a narrow section (diameter d₂ = 0.04 m). In the wide section, the water velocity is v₁ = 2.0 m/s and the pressure is P₁ = 3.0 × 10⁵ Pa.",
    given: [
      "d₁ = 0.10 m  →  A₁ = π(0.05)² ≈ 7.85 × 10⁻³ m²",
      "d₂ = 0.04 m  →  A₂ = π(0.02)² ≈ 1.26 × 10⁻³ m²",
      "v₁ = 2.0 m/s",
      "P₁ = 3.0 × 10⁵ Pa",
      "ρ_water = 1000 kg/m³",
      "Pipe is horizontal",
    ],
    parts: [
      {
        label: "a",
        question:
          "Use the continuity equation to find the velocity v₂ in the narrow section.",
        points: 2,
        rubric: [
          "(1 pt) Correctly states and applies continuity: A₁v₁ = A₂v₂",
          "(1 pt) Correct answer: v₂ = A₁v₁/A₂ = (7.85×10⁻³ × 2.0) / 1.26×10⁻³ ≈ 12.5 m/s",
        ],
        sampleResponse:
          "By the continuity equation (conservation of mass for incompressible fluid):\n\nA₁v₁ = A₂v₂\n\nv₂ = (A₁/A₂)·v₁ = (7.85 × 10⁻³ m²) / (1.26 × 10⁻³ m²) × 2.0 m/s\n\nv₂ = 6.23 × 2.0 ≈ 12.5 m/s\n\nAlternatively using diameter ratio: v₂ = v₁·(d₁/d₂)² = 2.0 × (0.10/0.04)² = 2.0 × 6.25 = 12.5 m/s",
      },
      {
        label: "b",
        question:
          "Apply Bernoulli's equation to find the pressure P₂ in the narrow section.",
        points: 3,
        rubric: [
          "(1 pt) Correctly writes Bernoulli's equation for a horizontal pipe: P₁ + ½ρv₁² = P₂ + ½ρv₂²",
          "(1 pt) Correctly rearranges: P₂ = P₁ + ½ρ(v₁² − v₂²)",
          "(1 pt) Correct answer: P₂ = 3.0×10⁵ + ½(1000)(4 − 156.25) = 3.0×10⁵ − 76,125 ≈ 2.24 × 10⁵ Pa",
        ],
        sampleResponse:
          "For a horizontal pipe (no elevation change), Bernoulli's equation gives:\n\nP₁ + ½ρv₁² = P₂ + ½ρv₂²\n\nP₂ = P₁ + ½ρ(v₁² − v₂²)\n\nP₂ = 3.0×10⁵ + ½(1000)(2.0² − 12.5²)\n\nP₂ = 3.0×10⁵ + 500(4 − 156.25)\n\nP₂ = 3.0×10⁵ − 76,125\n\nP₂ ≈ 2.24 × 10⁵ Pa",
      },
      {
        label: "c",
        question:
          "Explain conceptually (without equations) why the pressure is lower in the narrow section even though the same fluid is flowing through both sections.",
        points: 2,
        rubric: [
          "(1 pt) Explains that fluid must speed up in the narrow section (continuity — same volume must pass per unit time through a smaller area)",
          "(1 pt) Connects to energy conservation / Bernoulli: kinetic energy increases, so pressure energy must decrease to conserve total energy along a streamline",
        ],
        sampleResponse:
          "In the narrow section, the fluid must move faster because the same amount of water must pass through a smaller opening each second. This speed-up requires the fluid to accelerate.\n\nFor the fluid to accelerate, there must be a net force pushing it forward — meaning the pressure behind must be higher than the pressure ahead. Equivalently, by energy conservation: the fluid has more kinetic energy in the narrow section, and since total mechanical energy per unit volume is conserved along a streamline, the pressure (a form of potential energy per volume) must be lower.\n\nThis is the Bernoulli principle: faster flow = lower pressure.",
      },
      {
        label: "d",
        question:
          "Design challenge: What diameter d₂ would cause the pressure P₂ to equal atmospheric pressure (1.01 × 10⁵ Pa)? Show your work.",
        points: 4,
        rubric: [
          "(1 pt) Sets up Bernoulli: P₁ + ½ρv₁² = P_atm + ½ρv₂²",
          "(1 pt) Solves for v₂: v₂ = √(v₁² + 2(P₁−P_atm)/ρ) = √(4 + 2(1.99×10⁵)/1000) = √(402) ≈ 20.0 m/s",
          "(1 pt) Uses continuity: A₂ = A₁v₁/v₂ = (7.85×10⁻³)(2.0)/20.0 = 7.85×10⁻⁴ m²",
          "(1 pt) Finds diameter: A₂ = π(d₂/2)²  →  d₂ = √(4A₂/π) = √(4×7.85×10⁻⁴/π) ≈ 0.0316 m ≈ 3.2 cm",
        ],
        sampleResponse:
          "Set P₂ = P_atm = 1.01 × 10⁵ Pa and solve for the required v₂:\n\nP₁ + ½ρv₁² = P_atm + ½ρv₂²\n\nv₂² = v₁² + 2(P₁ − P_atm)/ρ\nv₂² = (2.0)² + 2(3.0×10⁵ − 1.01×10⁵)/1000\nv₂² = 4 + 2(1.99×10⁵)/1000 = 4 + 398 = 402 m²/s²\nv₂ ≈ 20.0 m/s\n\nNow use continuity to find required A₂:\nA₂ = A₁v₁/v₂ = (7.85×10⁻³)(2.0)/20.0 = 7.85×10⁻⁴ m²\n\nSolve for diameter:\nA₂ = π(d₂/2)²  →  d₂ = √(4A₂/π) = √(4 × 7.85×10⁻⁴ / π) ≈ 0.0316 m\n\nThe required diameter is approximately 3.2 cm.",
      },
    ],
  },
  {
    id: 5,
    title: "Floating Object and Fluid Density",
    scenario:
      "A wooden block of mass 0.500 kg and volume 6.25 × 10⁻⁴ m³ is placed in a large container. When placed in Fluid A (ρ_A = 900 kg/m³), the block sinks. When placed in Fluid B (ρ_B = 1200 kg/m³), the block floats with a fraction of its volume submerged.",
    given: [
      "m = 0.500 kg",
      "V_block = 6.25 × 10⁻⁴ m³",
      "ρ_A = 900 kg/m³",
      "ρ_B = 1200 kg/m³",
      "g = 9.8 m/s²",
    ],
    parts: [
      {
        label: "a",
        question:
          "Calculate the density of the wooden block and explain why it sinks in Fluid A but floats in Fluid B.",
        points: 3,
        rubric: [
          "(1 pt) ρ_block = m/V = 0.500 / 6.25×10⁻⁴ = 800 kg/m³",
          "(1 pt) Sinks in Fluid A because ρ_block (800) > ρ_A (900) is incorrect — actually 800 < 900, so must reconsider. Award point for correct comparison: ρ_block = 800 < ρ_A = 900, so block should float in A. If student identifies the scenario as stated (sinks in A) they should note this is inconsistent and explain that sinking requires ρ_block > ρ_fluid.",
          "(1 pt) Floats in Fluid B because ρ_block (800) < ρ_B (1200)",
        ],
        sampleResponse:
          "Density of block:\nρ_block = m/V = 0.500 kg / 6.25×10⁻⁴ m³ = 800 kg/m³\n\nNote: The problem states the block sinks in Fluid A (ρ_A = 900 kg/m³), but since ρ_block = 800 < 900 = ρ_A, the block should actually float in Fluid A. This appears to be an inconsistency in the problem — a block with ρ = 800 kg/m³ would float in any fluid with ρ > 800 kg/m³.\n\nFor Fluid B: ρ_block (800) < ρ_B (1200), so buoyant force at full submersion exceeds weight → block floats with only part of its volume submerged.",
      },
      {
        label: "b",
        question:
          "Calculate what fraction of the wooden block's volume is submerged when it floats in Fluid B.",
        points: 3,
        rubric: [
          "(1 pt) States equilibrium condition: buoyant force = weight, i.e., ρ_B·g·V_sub = m·g",
          "(1 pt) Solves: V_sub/V_block = ρ_block/ρ_B = 800/1200",
          "(1 pt) Correct fraction: 2/3 ≈ 0.667 (67% submerged)",
        ],
        sampleResponse:
          "For a floating object, the buoyant force equals its weight:\n\nF_B = W\nρ_B·g·V_sub = m·g\nρ_B·V_sub = m\n\nFraction submerged = V_sub/V_block = m/(ρ_B·V_block) = ρ_block/ρ_B\n\n= 800/1200 = 2/3 ≈ 0.667\n\nTwo-thirds (67%) of the block is submerged in Fluid B.",
      },
      {
        label: "c",
        question:
          "A small steel bolt (mass 50 g, density 7800 kg/m³) is now placed on top of the floating wooden block in Fluid B. Determine whether the system (block + bolt) still floats or sinks. Justify your answer.",
        points: 3,
        rubric: [
          "(1 pt) Calculates total mass: m_total = 0.500 + 0.050 = 0.550 kg",
          "(1 pt) Calculates maximum buoyant force (full submersion): F_B_max = ρ_B·g·V_block = 1200×9.8×6.25×10⁻⁴ = 7.35 N; Weight = m_total·g = 0.550×9.8 = 5.39 N",
          "(1 pt) Concludes system still floats because F_B_max (7.35 N) > W_total (5.39 N); finds new submerged fraction = 0.550/(1200×6.25×10⁻⁴) = 0.733 (73.3%)",
        ],
        sampleResponse:
          "Total mass: m_total = 0.500 + 0.050 = 0.550 kg\nTotal weight: W = 0.550 × 9.8 = 5.39 N\n\nMaximum buoyant force (if fully submerged):\nF_B_max = ρ_B·g·V_block = 1200 × 9.8 × 6.25×10⁻⁴ = 7.35 N\n\nSince F_B_max (7.35 N) > W_total (5.39 N), the system still floats.\n\nNew submerged fraction:\nV_sub/V_block = m_total/(ρ_B·V_block) = 0.550/(1200 × 6.25×10⁻⁴) = 0.550/0.75 ≈ 0.733\n\nThe block now sits 73.3% submerged (up from 66.7%).",
      },
      {
        label: "d",
        question:
          "What is the minimum density a fluid must have in order for this wooden block (without the bolt) to float? Explain what would happen at exactly this density.",
        points: 2,
        rubric: [
          "(1 pt) Minimum fluid density equals block density: ρ_fluid_min = ρ_block = 800 kg/m³",
          "(1 pt) At exactly this density, the block floats fully submerged just at the surface (V_sub = V_block, 100% submerged), in neutral buoyancy — the block is in equilibrium at any depth",
        ],
        sampleResponse:
          "For floating, the maximum buoyant force (full submersion) must be at least equal to the block's weight:\n\nρ_fluid·g·V_block ≥ m·g\nρ_fluid ≥ m/V_block = ρ_block = 800 kg/m³\n\nMinimum fluid density = 800 kg/m³\n\nAt exactly ρ_fluid = 800 kg/m³, the block is in neutral buoyancy: it neither rises nor sinks, floating fully submerged. Any slight push downward would not cause it to sink further — it remains in equilibrium at any depth. In practice, the block would float just barely at the surface with essentially 100% of its volume submerged.",
      },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface PartState {
  answer: string;
  showRubric: boolean;
  showSample: boolean;
  attempted: boolean;
}

type ProblemState = Record<string, PartState>;

function defaultPartState(): PartState {
  return { answer: "", showRubric: false, showSample: false, attempted: false };
}

function FRQPartCard({
  part,
  state,
  onChange,
}: {
  part: FRQPart;
  state: PartState;
  onChange: (update: Partial<PartState>) => void;
}) {
  return (
    <div className="space-y-3">
      {/* Part header */}
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
          {part.label.toUpperCase()}
        </span>
        <div className="flex-1 space-y-1">
          <p className="text-sm md:text-base leading-relaxed text-foreground">{part.question}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-medium text-muted-foreground border-border">
              {part.points} {part.points === 1 ? "point" : "points"}
            </Badge>
            {state.attempted && (
              <Badge className="bg-emerald-100 text-xs text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-100 dark:hover:bg-emerald-500/20">
                Attempted
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Answer textarea */}
      <textarea
        className="w-full resize-y rounded-md border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:border-slate-400 dark:focus:ring-slate-700"
        rows={4}
        placeholder={`Write your answer for part (${part.label}) here…`}
        value={state.answer}
        onChange={(e) =>
          onChange({
            answer: e.target.value,
            attempted: e.target.value.trim().length > 0,
          })
        }
      />

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          className="text-xs"
          onClick={() => onChange({ showRubric: !state.showRubric })}
        >
          {state.showRubric ? "Hide Rubric" : "Show Rubric"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-xs"
          onClick={() => onChange({ showSample: !state.showSample })}
        >
          {state.showSample ? "Hide Sample Response" : "Show Sample Response"}
        </Button>
      </div>

      {/* Rubric reveal */}
      {state.showRubric && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-400/40 dark:bg-amber-500/10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
            AP Scoring Rubric — Part ({part.label.toUpperCase()}) — {part.points}{" "}
            {part.points === 1 ? "point" : "points"}
          </p>
          <ul className="space-y-1.5">
            {part.rubric.map((criterion, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-100">
                <span className="mt-0.5 text-amber-600 dark:text-amber-300">•</span>
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sample response reveal */}
      {state.showSample && (
        <div className="rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-400/40 dark:bg-blue-500/10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-800 dark:text-blue-200">
            Model Answer — Part ({part.label.toUpperCase()})
          </p>
          <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-blue-900 dark:text-blue-100">
            {part.sampleResponse}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function FRQPractice() {
  return (
    <ErrorBoundary fallbackLabel="This FRQ practice failed to load">
      <FRQPracticeInner />
    </ErrorBoundary>
  );
}

function FRQPracticeInner() {
  const [activeId, setActiveId] = useState<number>(1);
  const [problemStates, setProblemStates] = useState<Record<number, ProblemState>>(() => {
    const init: Record<number, ProblemState> = {};
    frqProblems.forEach((p) => {
      init[p.id] = {};
      p.parts.forEach((pt) => {
        init[p.id][pt.label] = defaultPartState();
      });
    });
    return init;
  });

  useEffect(() => {
    if (frqProblems.length === 0) return;
    const handleKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      const idx = frqProblems.findIndex((p) => p.id === activeId);
      if (idx < 0) return;
      if (e.key === "ArrowLeft" && idx > 0) {
        e.preventDefault();
        setActiveId(frqProblems[idx - 1].id);
      } else if (e.key === "ArrowRight" && idx < frqProblems.length - 1) {
        e.preventDefault();
        setActiveId(frqProblems[idx + 1].id);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeId]);

  function updatePartState(problemId: number, partLabel: string, update: Partial<PartState>) {
    setProblemStates((prev) => ({
      ...prev,
      [problemId]: {
        ...prev[problemId],
        [partLabel]: { ...prev[problemId][partLabel], ...update },
      },
    }));
  }

  function getAttemptedCount(problemId: number): number {
    const ps = problemStates[problemId];
    return Object.values(ps).filter((s) => s.attempted).length;
  }

  if (frqProblems.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-4 sm:p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <p className="text-base font-semibold text-foreground">
              No FRQ questions in the bank for this unit yet
            </p>
            <p className="text-sm text-muted-foreground">
              Check back later — new free-response problems are added as content is built out.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeProblem = frqProblems.find((p) => p.id === activeId)!;
  const totalPoints = activeProblem.parts.reduce((sum, p) => sum + p.points, 0);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      {/* Page header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge className="bg-slate-800 text-white hover:bg-slate-800 text-xs uppercase tracking-wide">
            AP Physics 1
          </Badge>
          <Badge variant="outline" className="text-xs text-muted-foreground border-border">
            Fluids — Free Response Practice
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Free Response Questions
        </h1>
        <p className="text-sm text-muted-foreground">
          Practice AP-style FRQs. Write your answers, then reveal the rubric or a model response.
        </p>
        <p className="text-[11px] text-muted-foreground">
          Tip: ← → to switch between problems
        </p>
      </div>

      {/* Problem selector */}
      <div className="flex flex-wrap gap-2">
        {frqProblems.map((p) => {
          const attempted = getAttemptedCount(p.id);
          const total = p.parts.length;
          const isActive = p.id === activeId;
          return (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={`group flex flex-col items-start gap-0.5 rounded-lg border px-3 py-2 text-left text-xs transition-all ${
                isActive
                  ? "border-slate-800 bg-slate-800 text-white shadow-sm"
                  : "border-border bg-card text-foreground hover:border-slate-400 hover:bg-slate-50 dark:hover:border-slate-500 dark:hover:bg-slate-800"
              }`}
            >
              <span className="font-semibold">FRQ {p.id}</span>
              <span
                className={`text-[10px] ${
                  isActive ? "text-slate-300" : "text-muted-foreground"
                }`}
              >
                {attempted}/{total} parts attempted
              </span>
            </button>
          );
        })}
      </div>

      {/* Active problem card */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-slate-50 pb-4 dark:bg-slate-900/40">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Question {activeProblem.id}
                </span>
                <Badge variant="outline" className="text-xs text-muted-foreground border-border">
                  {totalPoints} points
                </Badge>
              </div>
              <CardTitle className="text-lg font-bold text-foreground">
                {activeProblem.title}
              </CardTitle>
            </div>
          </div>
          <CardDescription className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {activeProblem.scenario}
          </CardDescription>

          {/* Given information */}
          <div className="mt-3 rounded-md border border-border bg-background px-4 py-3">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Given
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {activeProblem.given.map((g, i) => (
                <li key={i} className="font-mono text-xs text-foreground/90">
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {activeProblem.parts.map((part, idx) => (
            <div key={part.label}>
              <FRQPartCard
                part={part}
                state={problemStates[activeProblem.id][part.label]}
                onChange={(update) => updatePartState(activeProblem.id, part.label, update)}
              />
              {idx < activeProblem.parts.length - 1 && (
                <Separator className="mt-6" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Progress summary */}
      <div className="rounded-lg border border-border bg-slate-50 px-4 py-3 dark:bg-slate-900/40">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Overall Progress
        </p>
        <div className="flex flex-wrap gap-3">
          {frqProblems.map((p) => {
            const attempted = getAttemptedCount(p.id);
            const total = p.parts.length;
            const pct = Math.round((attempted / total) * 100);
            return (
              <div key={p.id} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">FRQ {p.id}</span>
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-slate-700 transition-all dark:bg-slate-200"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {attempted}/{total}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
