---
title: Activation Function Ablation Study for 3D Point Cloud Classification
description: >-
  ReLU vs Leaky ReLU vs GELU in a PointNet baseline — accuracy, stability, and
  latency under a fair, single-switch setup
status: Completed
year: '2025'
order: 2
tags:
  - activations
  - deeplearning
  - ablationstudy
images:
  - src: /images/projects/speed-vs-accuracy-moh57xef.png
    alt: speed_vs_accuracy
links:
  - label: github
    href: 'https://github.com/hiteshhedwig/activations-ablation'
---
- Leaky ReLU and GELU tied for best accuracy (89.98%) on ModelNet10 in this setup.
- ReLU delivered the fastest inference (2.4× faster than GELU) and is the most deployment/INT8-friendly.
- GELU trained stably but was significantly slower on this backbone.
