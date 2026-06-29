---
title: 'LiftDepth Risk: Road-Aware Monocular BEV Occupancy and Object Risk'
description: >-
  A camera-only perception pipeline that turns KITTI driving video into metric
  depth, road-aware BEV occupancy, tracked object footprints, and object-aware
  risk heatmaps.
status: Completed
year: '2026'
order: 0
tags:
  - Computer Vision
  - Robotics
  - Autonomous Driving
  - Monocular Depth
  - Object Tracking
  - Occupancy Grid
demoVideo: dD1qV-_x_DE
demoPath: demo-assets/liftdepth-risk-road-aware-monocular-bev-occupancy-and-object-risk
images:
  - src: /images/projects/da2metricdepth-mqzna3r7.png
    alt: DA2MetricDepth
  - src: /images/projects/object-occupancy-grid-mqzna58a.png
    alt: object_occupancy_grid
  - src: /images/projects/projected-road-bev-mqznaa8z.png
    alt: projected_road_bev
  - src: /images/projects/rgb-input-live-tracks-mqznabys.png
    alt: rgb_input_live_tracks
  - src: /images/projects/risk-map-mqznadc3.png
    alt: risk_map
  - src: /images/projects/segmentation-rgb-mqznaei9.png
    alt: segmentation_rgb
links:
  - label: GitHub
    href: 'https://github.com/hiteshhedwig/liftdepth-risk'
---
LiftDepth Risk is a camera-only perception demo that converts KITTI driving video into road-aware BEV occupancy and object-level risk maps.

The pipeline combines Depth Anything V2 for metric depth, SegFormer for road/sidewalk segmentation, and YOLO for road-user tracking. Detected vehicles and pedestrians are filtered using the road mask, projected into bird’s-eye view with KITTI camera intrinsics, and represented as compact object footprints instead of noisy dense-depth blobs.

The final output is an interactive HTML demo showing synchronized RGB tracks, depth, segmentation, projected road BEV, object occupancy, and risk heatmaps. The goal is to make monocular scene understanding easier to inspect for robotics and autonomous-driving perception workflows.
