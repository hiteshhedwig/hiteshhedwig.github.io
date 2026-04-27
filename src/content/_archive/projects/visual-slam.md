---
title: Visual SLAM for Indoor Robots
description: >-
  Real-time visual odometry and mapping system for mobile robots navigating
  cluttered indoor environments. Uses ORB features with a custom loop closure
  module.
status: Active
year: 2025–present
order: 1
tags:
  - C++
  - ROS2
  - OpenCV
  - g2o
demoVideo: dQw4w9WgXcQ
images:
  - src: 'https://placehold.co/800x450/f0ebe3/5c5347?text=SLAM+Map+Output'
    alt: SLAM map visualization
  - src: 'https://placehold.co/800x450/f0ebe3/5c5347?text=Robot+Platform'
    alt: Robot platform
  - src: 'https://placehold.co/800x450/f0ebe3/5c5347?text=Feature+Matching'
    alt: Feature matching visualization
links:
  - label: GitHub
    href: 'https://github.com'
  - label: Paper
    href: '#'
---

This project implements a monocular visual SLAM pipeline designed for mobile robots operating in cluttered indoor environments like warehouses and homes.

The system extracts ORB features from each frame, matches them against a local map, and estimates the camera pose using PnP with RANSAC. A custom loop closure module uses bag-of-words for place recognition and triggers pose graph optimization via g2o.

The pipeline runs at 30fps on an NVIDIA Jetson Orin and has been tested on a custom differential-drive robot navigating a 200m² office space.
