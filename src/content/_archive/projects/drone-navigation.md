---
title: "Autonomous Drone Navigation"
description: "End-to-end pipeline for GPS-denied drone navigation using monocular depth estimation and a lightweight path planner."
status: Archived
year: "2024"
tags: ["Python", "PX4", "MiDaS", "ROS2"]
order: 4
images:
  - src: "https://placehold.co/800x450/f0ebe3/5c5347?text=Drone+Platform"
    alt: "Drone platform"
  - src: "https://placehold.co/800x450/f0ebe3/5c5347?text=Depth+Map"
    alt: "Monocular depth output"
---

Developed an autonomous navigation stack for a quadrotor operating in GPS-denied indoor environments.

The system uses MiDaS for monocular depth estimation from a forward-facing camera, converts depth maps into a local occupancy grid, and runs a lightweight D* Lite planner for obstacle avoidance.

Flight tested in a gymnasium with various obstacles. The drone successfully navigated waypoint missions without GPS, though the depth estimation struggled with reflective surfaces.
