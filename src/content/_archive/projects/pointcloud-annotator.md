---
title: "Point Cloud Annotation Tool"
description: "Lightweight web-based tool for annotating 3D point clouds. Built for internal use when labeling outdoor driving datasets."
status: Archived
year: "2023"
tags: ["TypeScript", "Three.js", "React"]
order: 6
images:
  - src: "https://placehold.co/800x450/f0ebe3/5c5347?text=Annotation+UI"
    alt: "Annotation interface"
---

A browser-based 3D annotation tool for labeling objects in LiDAR point clouds.

Built with Three.js for rendering and React for the UI. Supports drawing 3D bounding boxes, assigning class labels, and exporting annotations in KITTI format.

Originally built because existing tools were either too slow or required complex local setups. This runs entirely in the browser and handles point clouds with up to 150K points smoothly.
