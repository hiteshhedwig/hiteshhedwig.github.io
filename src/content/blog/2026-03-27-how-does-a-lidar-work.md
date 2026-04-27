---
title: How does a lidar work ?
date: '2024-03-27'
summary: diving deep into lidar intricacies
tags:
  - lidar
  - sensor
  - hardware
  - working
  - theory
draft: false
---
# Introduction 

If you have worked on Lidar involving in data gathering, data processing or anything else. You might know why it is so  highly used in different applications process. But sometimes we dont know how does it even work. It is essential to know what type of Lidar you need for your purpose. If its 2d or 3d lidar you need. Apart from all the reasons, i believe its a good habit to be inquisitive about how does something work. In this blog post, the idea is to understand basics of lidar working and practice some QnA to validate the understanding.


# Types of Lidar 
1. Time-of-Flight (ToF) Lidar 
2. Phase-Shift Lidar
3. Frequency-Modulated Continuous Wave (FMCW) Lidar
4. Geiger-Mode Lidar
5. Flash Lidar
6. Doppler Lidar
7. Topographic Lidar


Although there are plenty of Lidar conforming to different use cases but they all relay on same underlying principles. 


# So, what's going on ?
## Core Principle 
### **Emission of lasers pulses** 
- LiDAR systems work by emitting light in the form of a pulsed laser
- These lasers are typically in the ultraviolet, visible, or near-infrared range.

### **Reflection and Detection**
- the laser pulse hit the target object or surface and further are reflected back to the lidar
- The system has a detector, usually a photodiode, that captures the reflected light pulses
  - (Below how does photodiode works)

### **Time of Flight Measurement**
- LiDAR measures the time it takes for each pulse to travel to the target and back. This is known as the "time of flight."
- Since the speed of light is known, the distance to the object can be calculated using this travel time.   
- By measuring the time it takes for a laser pulse to travel from the emitter to the target and back to the receiver, LiDAR systems can calculate the distance to the target using the speed of light. The distance is determined by the formula: Distance = (Speed of Light × Time of Flight) / 2.

#### Working of Phase Shift LiDAR - 
- **Emission of Continuous Light Beam:** CW LiDAR continuously emits a light beam (usually laser) toward the target.
- **Phase Shift Measurement:** Instead of measuring the time of flight, it measures the phase shift of the reflected light. The phase shift occurs due to the difference in the phase of the outgoing light wave and the phase of the light wave that returns to the sensor.
- **Distance Calculation:** The distance is calculated based on the phase shift, as it is proportional to the round trip distance traveled by the light.

## Components
- **Laser** : The heart of a LiDAR system, used to generate the light pulses
- **Scanner and Optics** : Directs the laser pulses toward the ground and collects the reflected light
- **Detector and Receiver** : Captures the reflected laser pulses, Converts them into electrical signals.
- **Position and Navigation Systems:** GPS (Global Positioning System), IMU (Inertial Measurement Unit).

## Details on types of Laser used 
### UV :
  - **Wavelength** - typically below 300 nm
  - **Application** - UV LiDAR is often used for atmospheric monitoring, including detecting pollutants and aerosols. Its high energy allows for the detection of smaller particles.

### Visible Light LiDAR :
   - **Wavelength**: Ranges from about 400 to 700 nanometers
   - **Applications**: Used in bathymetric LiDAR for shallow water mapping. The visible light can penetrate water, making it suitable for measuring sea or riverbeds.

### Near-Infrared (NIR) :
   - **Wavelength**: Typically around 900 to 1550 nanometers.
   - **Applications**: Most common in terrestrial and airborne LiDAR systems. NIR is safe for human eyes and is effective for measuring distances over various terrains, including vegetation and urban environments.

### Solid-State Lasers, Fiber Lasers, Semiconductor Lasers :
   - Not in the scope of this blog.

## How do lidar differentiate among the pulses ?
- Lidar systems employ various techniques to encode and differentiate the laser pulses they emit and receive.
- Some common methods used for pulse encoding and differentiation :
  - **Time-Division Multiplexing (TDM)**: 
    - the lidar system emits laser pulses at distinct time intervals
    - Each pulse is assigned a unique time slot, and the reflected pulses are expected to arrive back at the lidar within their respective time slots
    - If multiple pulses arrive at the same time slot, lidar systems employ various techniques to differentiate them like Multi-Echo Detection, Pulse Separation, Intelligent Pulse Scheduling.
  - **Wavelength-Division Multiplexing (WDM)** :
    - WDM involves using multiple laser wavelengths or colors to encode different pulses.
    - Each pulse is assigned a specific wavelength, and the lidar system includes filters or wavelength-selective detectors to separate the reflected pulses based on their wavelengths.
  -  **Polarization Encoding** :
     -  Some lidar systems utilize the polarization properties of light to encode pulses.
     -  The emitted laser pulses are polarized in a specific orientation (e.g., linear, circular, or elliptical polarization).
     -  The reflected pulses maintain the polarization state, and the lidar system uses polarization-sensitive detectors to differentiate between pulses based on their polarization.

## Photodiode working as pulse receivers 
- A photodiode is a semiconductor device that converts light into an electrical current. It is commonly used as a detector in LiDAR systems to capture and measure the reflected laser pulses.
- **Photon Absorption** :
  - When light falls on the photodiode, photons (light particles) are absorbed by the semiconductor material, typically silicon
  - The energy of the photons excites electrons within the semiconductor, causing them to move from the valence band to the conduction band.
- **Electron-Hole Pair Generation** :
  - The excited electrons leave behind positively charged holes in the valence band.
  - This process creates electron-hole pairs in the semiconductor material.
- **P-N Junction** :
  - A photodiode consists of a p-n junction, which is formed by two differently doped regions of the semiconductor: the p-type region (positive) and the n-type region (negative).
  - The p-type region has an excess of holes, while the n-type region has an excess of electrons.
  - When the electron-hole pairs are generated by the absorbed photons, they are swept across the p-n junction due to the built-in electric field.
- **Current Generation** :
  - The movement of electrons and holes across the p-n junction creates an electric current, known as the photocurrent.
  - The magnitude of the photocurrent is proportional to the intensity of the incident light.
  - In LiDAR systems, the photocurrent represents the strength and timing of the reflected laser pulses.





