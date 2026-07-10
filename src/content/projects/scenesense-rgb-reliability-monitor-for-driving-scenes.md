---
title: 'SceneSense: RGB Reliability Monitor for Driving Scenes'
description: >-
  Weakly supervised RGB camera reliability scoring for driving scenes using
  OctoSense captions, ResNet18, visual-statistics baselines, depth-error
  validation, video diagnostics, and Grad-CAM.
status: Completed
year: '2026'
order: 1
tags:
  - Computer Vision
  - Robotics
  - Autonomous Driving
  - Sensor Reliability
  - Grad-CAM
demoVideo: OLcpbdt5jZs
images:
  - src: /images/projects/cases-stats-right-resnet-wrong-001-mrej4ui9.jpg
    alt: cases_stats_right_resnet_wrong_001
  - src: /images/projects/cases-stats-wrong-resnet-right-004-mrej53bv.jpg
    alt: cases_stats_wrong_resnet_right_004
  - src: /images/projects/clip-1-mrej5n3j.jpg
    alt: clip-1
  - src: /images/projects/clip-2-mrej5pwt.jpg
    alt: clip-2
links:
  - label: GitHub
    href: 'https://github.com/hiteshhedwig/scenesense-rgb-reliability'
---
SceneSense is a weakly supervised RGB reliability monitor for driving scenes. The goal is to estimate when an RGB camera frame may be visually challenging for downstream perception.

The project uses OctoSense driving videos and caption-derived weak labels. OctoSense captions are generated using Gemini, so they are useful for broad scene context such as day, night, snow, tunnel, or general low-light conditions, but they are not perfect frame-level labels. They are less reliable for fine visual details like whether the road is actually wet, whether rain drops are visible, whether fog is severe in the RGB image, or whether glare truly affects visibility.

Because of this, SceneSense is framed as a weakly supervised model. It is not trained on perfect manually verified RGB failure labels. Instead, it learns a useful RGB-challenge signal from noisy caption-derived supervision.

The final RGB-challenge target focuses on conditions that are more likely to affect RGB perception:

RGB challenged = night OR strict low-light OR fog/haze OR tunnel

I intentionally treated some labels conservatively. Snow and dawn/dusk are used as scene context, not automatic RGB failure. Glare and rain/wet-road captions were not used as automatic challenge labels because they were too noisy in the captions.

The model uses a ResNet18 backbone with two heads: a scene multi-label head and an RGB reliability head. At inference time, the model only sees a single RGB image. It does not use captions, LiDAR, radar, or video history.

A major part of the project was not just training the model, but testing whether it actually adds value over simple image statistics. I built a handcrafted visual-statistics baseline using features like luminance, contrast, dark-pixel ratio, entropy, saturation, and edge density. This baseline was intentionally strong because many visibility problems are illumination-driven.

Main results:

SceneSense v4-LS achieved 0.952 F1 and 0.963 balanced accuracy on the weakly supervised test split.

The handcrafted visual-statistics baseline achieved 0.899 F1. SceneSense reduced test errors from 126 to 59, about a 53 percent error reduction over the handcrafted baseline.

On the middle 40 percent luminance subset, where obvious brightness thresholding is less useful, SceneSense improved F1 from 0.617 to 0.757.

I also validated the reliability score against RGB-only depth estimation error. Depth Anything V2 was run on RGB frames and compared against OctoSense LiDAR-derived sparse depth. The label-smoothed SceneSense score showed a stronger matched correlation with RGB-only depth error than the baseline model.

Finally, I tested SceneSense on unseen video clips. In obvious night scenes, both handcrafted statistics and SceneSense agree. In ambiguous fog, haze, and evening clips, handcrafted statistics frequently fluctuate around the threshold, while SceneSense produces a smoother reliability signal.

I also generated Grad-CAM visualizations to inspect which regions influence the RGB-challenge score. These qualitative examples show attention around scene regions such as road visibility, tunnel structure, sky and illumination regions, dark road areas, and vehicle-light context.

Tech stack:
PyTorch, Torchvision, OpenCV, Pandas, NumPy, scikit-learn, Grad-CAM, OctoSense, Depth Anything V2.

This project connects computer vision, robotics perception, weak supervision, model interpretability, and sensor reliability.
