---
title: 'IPT: Infrastructure Perception, Tracking, and Event Analytics'
description: >-
  Infrastructure-based 3D perception stack for roadside autonomy, BEV tracking,
  multi-camera projection, and traffic risk analytics
status: Active
year: '2026'
order: 0
tags:
  - Computer Vision
  - Autonomous Driving
  - 3D Perception
  - BEV Tracking
  - V2X
  - Cooperative Perception
  - Traffic Analytics
  - Python
  - Research
demoVideo: FQSDuurayAg
demoPath: demos/ipt-infrastructure-perception-tracking-and-event-analytics
images:
  - src: /images/projects/infra-image-mqwlhdup.png
    alt: infra-image
  - src: /images/projects/bev-image-mqwlhfj0.png
    alt: bev-image
links:
  - label: GitHub
    href: 'https://github.com/hiteshhedwig/infrastructure-perception-tracking'
---
IPT is an infrastructure-based 3D perception, tracking, and event analytics project for roadside autonomy research.

The project demonstrates a full perception workflow using TUMTraf-V2X roadside / cooperative sensor data, CoopDet3D 3D detections, online BEV tracking, multi-camera 3D box projection, interactive visualization, and traffic event analytics.

The current checkpoint focuses on two clean demo scenes. The flagship scene includes group-crossing risk analytics, while the second scene demonstrates stable full-scene tracking and event visualization.

Pipeline:

TUMTraf-V2X roadside / cooperative sensor data
→ CoopDet3D 3D detection
→ Raw prediction export
→ Online BEV tracking
→ Multi-camera 3D box projection
→ Interactive HTML visualization
→ Traffic event and risk analytics
→ Final demo packaging

Key features:

- Infrastructure-based 3D perception stack
- CoopDet3D-based detection pipeline
- Online BEV object tracking
- Multi-camera 3D bounding box projection
- Interactive HTML viewer export
- Traffic event and group-crossing risk analytics
- Reproducible scripts and documentation for future research

The repository is designed to stay small enough for GitHub while still being useful for future research work such as custom training, ablation studies, new model checkpoints, improved risk logic, and production-style visualization.

This project depends on external research tools and datasets including TUMTraf-V2X, CoopDet3D, MMDetection3D, MMDetection, MMCV, and TorchSparse.
