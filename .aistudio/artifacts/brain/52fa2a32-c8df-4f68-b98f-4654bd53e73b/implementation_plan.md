# Implementation Plan - Intense Chromatic Aberration & Liquid Ripple Glass Refraction

Implement high-impact chromatic aberration, liquid ripple refraction warping, and dynamic specular edge shimmer for bottom navigation lenses and segmented control pills.

## Proposed Changes

### 1. Liquid Chromatic Aberration & SVG Distortion Engine
- Create an RGB-split chromatic aberration glass filter (red/cyan spatial offset with spectral dispersion).
- Add dynamic liquid ripple SVG noise using animated `feTurbulence` and `feDisplacementMap` tuned for dramatic underlying visual bending.
- Ensure cross-browser resilience with combined CSS lens magnification (`scale(1.08)` bulge), backdrop distortion, and edge chromatic refractions.

### 2. Glass Lens Styling & Edge Shimmer (`src/index.css`)
- Update `.glass-lens` and `.glass-edge` with iridescent chromatic spectrum rim borders (`conic-gradient` / `linear-gradient` highlights).
- Add CSS variables for real-time cursor/drag specular highlights and liquid ripple pulses.
- Ensure liquid motion easing curves (`cubic-bezier(0.25, 1, 0.3, 1)`) apply smoothly across all lens state transitions.

### 3. Component Enhancements (`BottomNav.tsx` & `Glass.tsx`)
- Enhance `BottomNav` glass lens slider with real-time chromatic aberration displacement overlays and liquid ripple animation on tab selection/drag.
- Upgrade `GlassSegmented` control pill with matching chromatic refraction warping, liquid magnification bulge, and edge shimmer.

## User Verification Strategy
- Drag or switch tabs on the bottom navigation bar to observe underlying content warp with chromatic red/cyan edge dispersion and liquid ripple distortion.
- Toggle options on the segmented control pill to verify smooth liquid motion and chromatic spectrum edge shimmer.
