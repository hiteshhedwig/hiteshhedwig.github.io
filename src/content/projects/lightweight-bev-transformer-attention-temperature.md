---
title: Lightweight BEV Transformer – Attention & Temperature
description: >-
  Tiny PyTorch codebase for playing with transformer attention on simple BEV
  (bird’s-eye-view) grids and seeing how the softmax temperature changes
  attention patterns and downstream predictions.
status: Completed
year: '2025'
order: 2
tags:
  - BEV
  - transformer
  - attention
images:
  - src: >-
      /images/projects/screenshot-2026-04-27-at-17-19-15-attention-layer0-png-png-image-4396-2370-pixel-moh4y28b.png
    alt: >-
      Screenshot 2026-04-27 at 17-19-15 attention_layer0.png (PNG Image 4396 ×
      2370 pixels) — Scaled (39%)
links:
  - label: Github
    href: 'https://github.com/hiteshhedwig/bev-temp'
---

- Generates **synthetic BEV grids** (32×32) with rectangles standing in for:
  - cars (5×3)
  - pedestrians (2×2)
- Trains a **small transformer** over BEV patches:
  - patch embedding: 4×4 → 8×8 = 64 patches  
  - 2 encoder layers, 2 heads, 64-dim embeddings
- Uses **object queries + soft-argmax** detection head:
  - predicts object centers (x, y in [0, 1])
  - predicts class (car vs pedestrian)
- Exposes internal **self-attention maps** so you can:
  - overlay them on the BEV grid
  - compare different **temperatures** in the softmax

The whole thing is CPU-friendly and stays under ~100k parameters.
