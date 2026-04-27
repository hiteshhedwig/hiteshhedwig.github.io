---
title: "LiDAR Object Tracker"
description: "Multi-object tracking using 3D LiDAR point clouds with Kalman filtering and Hungarian assignment. Runs at 20Hz on an Ouster OS1."
status: Completed
year: "2024"
tags: ["Python", "PCL", "ROS", "NumPy"]
order: 3
images:
  - src: "https://placehold.co/800x450/f0ebe3/5c5347?text=Tracking+Output"
    alt: "Tracking visualization"
  - src: "https://placehold.co/800x450/f0ebe3/5c5347?text=Point+Cloud+View"
    alt: "Raw point cloud"
links:
  - label: GitHub
    href: "https://github.com"
---

A real-time multi-object tracking system that processes 3D LiDAR point clouds from an Ouster OS1-64 sensor.

The pipeline performs ground plane removal, Euclidean clustering for object segmentation, and tracks detected objects across frames using an extended Kalman filter with a constant velocity model. Data association is handled by the Hungarian algorithm on a 3D IoU cost matrix.

Tested in outdoor urban environments, tracking pedestrians, cyclists, and vehicles at 20Hz with consistent ID assignment.
