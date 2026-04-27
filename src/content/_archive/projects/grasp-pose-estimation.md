---
title: "Grasp Pose Estimation"
description: "Deep learning pipeline for predicting stable 6-DOF grasp poses from single RGB-D images. Trained in simulation, transferred to a Franka Panda arm."
status: Completed
year: "2025"
tags: ["Python", "PyTorch", "Isaac Sim", "Sim2Real"]
order: 2
demoVideo: "dQw4w9WgXcQ"
images:
  - src: "https://placehold.co/800x450/f0ebe3/5c5347?text=Grasp+Predictions"
    alt: "Grasp pose predictions"
  - src: "https://placehold.co/800x450/f0ebe3/5c5347?text=Sim+Environment"
    alt: "Isaac Sim training environment"
links:
  - label: GitHub
    href: "https://github.com"
---

Built an end-to-end pipeline that takes a single RGB-D image of a cluttered bin and predicts stable 6-DOF grasp poses for a parallel-jaw gripper.

The model was trained entirely in NVIDIA Isaac Sim using domain randomization — varying textures, lighting, object positions, and camera noise. Transfer to the real Franka Panda arm required careful calibration and a few tricks around depth noise handling.

Achieved 85% grasp success rate on unseen household objects, compared to 72% with a baseline antipodal grasp planner.
