---
title: "Robot Arm Calibration Toolkit"
description: "Hand-eye calibration tool for industrial robot arms. Supports both eye-in-hand and eye-to-hand configurations with automatic data collection."
status: "Open Source"
year: "2023"
tags: ["Python", "OpenCV", "NumPy"]
order: 5
images:
  - src: "https://placehold.co/800x450/f0ebe3/5c5347?text=Calibration+Setup"
    alt: "Calibration setup"
links:
  - label: GitHub
    href: "https://github.com"
  - label: PyPI
    href: "#"
---

A Python toolkit that automates hand-eye calibration for industrial robot arms.

Supports both eye-in-hand (camera mounted on end-effector) and eye-to-hand (camera fixed in workspace) configurations. The robot automatically moves to a set of predefined poses, captures checkerboard images, and solves the AX=XB problem using Tsai's method.

Used internally for calibrating UR5 and Franka arms. Open-sourced after several people asked about our calibration workflow.
