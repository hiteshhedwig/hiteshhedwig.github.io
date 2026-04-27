---
title: >-
  [Paper review] Single-image camera calibration with model-free distortion
  correction
date: '2024-03-27'
summary: >-
  Explains a single-image camera calibration method that outperforms Zhang’s
  method by estimating distortion and intrinsics more accurately using dense
  image data.
tags:
  - paper
  - review
  - calibration
draft: false
---

# Description -

Camera calibration is important in the variety of task from image stitching to 3d to 2d point projection. So having accurate intrinsic matrix and distortion co-efficients is crucial. Generally, Zhang's method of camera calibration is widely used process thoughout the industry and research setup. This paper introduces a unique approach in contrast with Zhang's method to achieve highly accurate camera calibration with the help of single dense image. 


_Disclaimer - No, this is not ChatGPT generated post. I truly want to learn and understand things. However, i have used chatgpt to comprehend some equations and graphs presented in the paper._


CHECK OUT THE PAPER - [Arxiv Link](https://arxiv.org/abs/2403.01263)

## Technical abbreviation - 
1. **DIC** - Digital Image Correlation
2. **SIC** - Single Image Calibration
3. **FOV** - Field of View
4. **CMT** - Calibration Matlab Toolbox
5. **COD** - Center of Distortion
6. **RPE** - Reprojection Error
7. **ZM** - Zhang's Method
8. **ROI** - Region of Interest
9. **MB**  - Model-Based
10. **MF** - Model-Free

# Paper discussion

## Issue observed in standard calibration  
- **Image distortion** : incorrect distortion is a source of systematic errors.
- **Number of images** : Zhang's method uses min 3 images to calibrate, max over 10 to reduce uncertainity of results. 
- **Precision in Feature detection** : Errors in feature detection can propagate through the calibration process.
- **Planar Surface Requirement** : The calibration pattern must be perfectly planar.

## Solution suggested 
- Introduce Novel SIC method model based and model free which is robust to noise and other errors.
![photo](/hedwig_explains/img/sic/assets/Pasted%20image%2020240325012113.png)


## Highlights 

- It is accepted that the radial component of the distortion is dominant over the other components. So the incorrect distortion coefficient calculation can pile up the error calculation.
- Generally, the center of distortion is assumed to coincide with the principal point _e_. In this work, accurate location of COD is being computed.
- An accurate estimation of the center of distortion and of the focal length is performed separately from the other design variables, thus avoiding coupling errors.
- Image distortion can be densely and uniformly mapped over the entire sensor area up to its boundaries. This map can either be used as a model-free pointwise warping function or interpolated with an analytical model deemed appropriate for the current lens/camera system.
    ![photo](/hedwig_explains/img/sic/assets/Pasted%20image%2020240324183756.png)




### Steps required for SIC : 
- **First : Evaluation of the center of distortion** :  
     ![photo1](/hedwig_explains/img/sic/assets/Pasted%20image%2020240324190008.png)
    -   COD - where distortion is assumed to be zero. This step determines COD because it affects the estimation of other calibration parameters. 
    - $p_p$ have an aspect ratio (AR) != 1 and The computed optimal position of the 𝐶𝑂𝐷 differs from the ground truth by less than 1 𝑝𝑖𝑥𝑒𝑙. 
        ![photo2](/hedwig_explains/img/sic/assets/Pasted%20image%2020240324194310.png)
    - As we can see in above table the COD differs by 1 pixel from the ground truth.
    - evaluating the 𝐶𝑂𝐷 strictly requires a highly dense grid of points distributed over the image
    
- **Second : Initialization of focal length & extrinsic parameters**
	- refine the homography (h) computation by considering the subset p_d of the distorted points. 
	- The equation exploits the relationships between the elements of the homography matrix to isolate the focal length. The formula is derived under the assumption that there is no skew and that the pixel aspect ratio is 1 (square pixels), which simplifies the intrinsic matrix.
		- this means -  aspect ratio of the pixels is the ratio of the physical size of the pixels in one dimension compared to the other. For most digital cameras, this is 1, meaning the pixels are square. No skew and pixel axes are perpendicular. Which means the $f_x$ and $f_y$  are the same. The initial intrinsic matrix looks like -
![Matrix K](https://latex.codecogs.com/svg.latex?K%20=%20\begin{bmatrix}f%20&%200%20&%20c_x%20\\%200%20&%20f%20&%20c_y%20\\%200%20&%200%20&%201\end{bmatrix})

        ![photo3](/hedwig_explains/img/sic/assets/Pasted%20image%2020240324201000.png)
	- In this context, the homography relates points in the image plane (affected by distortion) to points on the planar calibration pattern.
	- To refine this computation, the paper suggests using a subset of the distorted image points p_d that are within the maximum circle centered around the estimated COD.
	- By doing this, they ensure that the subset of points considered for further computation is affected by distortion more uniformly.
	- The paper acknowledges that h_{31} and h_{32}​ are proportional to the rotation matrix components r_{31} ​ and r_{32} ​, and thus, ill-posed configurations (such as placing the calibration target parallel to the sensor) should be avoided.

- **Third**. 1. Model-based optimization (SIC-MB).
	- common to most calibration methods. 
	- the parameters obtained in the previous step are refined together with the parameters of a prescribed distortion function by minimizing reprojection error.
	- initial guess of distortion params ![k1, k2, k3](https://latex.codecogs.com/svg.latex?(k_1,%20k_2,%20k_3)) is set to zero. 
	- The non-linear optimization problem is solved here using the Sequential Quadratic Programming algorithm implemented in Matlab.
- **Third** 2. Model-free optimization (SIC-MF)
	- The highly dense and uniform grid of image points considered.
	- The optimization is performed by first sorting the distorted radii 𝑟ₐ in ascending order, then rearranging the undistorted radii 𝑟 accordingly, and finally minimizing the function in Equation (8). ![M(u_0, v_0, FR, \theta_x, \theta_y, \theta_z, t_x, t_y, t_z)](https://latex.codecogs.com/svg.latex?M(u_0,%20v_0,%20FR,%20\theta_x,%20\theta_y,%20\theta_z,%20t_x,%20t_y,%20t_z))

		- This function measures the sum of squared differences between consecutive undistorted radii, which should be minimized to maintain monotonicity.
	- There is a known ambiguity between the scale of the distortion and the homography scale. The paper addresses this by keeping the focal length <img src="https://latex.codecogs.com/svg.latex?f_x" alt="f_x" style="height: 1em; vertical-align: -0.4em;" /> constant at the value found in Step #2 and by introducing ![FR=f_y/f_x](https://latex.codecogs.com/svg.latex?FR=\frac{f_y}{f_x})
 as a design variable.
	- The paper notes that the **assumption of a constant distortion function** within the camera's working volume may not be valid for real images, suggesting that distortion could vary with factors like depth.


### Some interesting findings !

- SIC-MB(model based) found to be superior when it comes to superior robustness. 

    ![photo4](/hedwig_explains/img/sic/assets/Pasted%20image%2020240324214657.png)
    

-  The $f_x$ and $f_y$ found to be more reliable in SIC-MB and MF than CMT based methods. 
    ![photo5](/hedwig_explains/img/sic/assets/Pasted%20image%2020240324214941.png)


- Similarly in distortion coefficient, the error rate found to be quite controlled in SIC based solutions. 
    ![photo6](/hedwig_explains/img/sic/assets/Pasted%20image%2020240324215132.png)

- Both **SIC-MB and SIC-MF can achieve high accuracy in calibration**. For noise-free data, the final radial distortion curve obtained by SIC-MF matches the ideal curve observed in SIC-MB with no significant difference.
- When it comes to real images, the assumption of a constant distortion function within the working volume is questioned. This suggests that for **real-world applications**, where distortion can vary, **the flexibility of SIC-MF might be preferable.**
- While SIC-MB is **computationally efficient** due to a good initial parameter guess and strict optimization bounds, SIC-MF, although computationally more demanding, offers a model-free calibration that could be more suitable for cameras with complex or non-standard distortions.

### Experiment  (lets keep this brief)
- The synthetic speckle image is displayed on a flat digital monitor (1280x1024 𝑝𝑖𝑥𝑒𝑙𝑠 resolution) with known characteristics, such as resolution and pixel size.
![photo9](/hedwig_explains/img/sic/assets/Pasted%20image%2020240325012239.png)
- The camera (5 - 50 𝑚𝑚 varifocal lens) is fixed in position facing the monitor.
- The camera's magnification is adjusted so that the speckle pattern displayed on the monitor fills the entire field of view (FOV) of the camera sensor
- The speckle image is resized to achieve a target average speckle size (like 3x3 pixels), and then the image is cropped and smoothed to match the monitor's dimensions.
- The captured speckle image is used as the reference image for the DIC process.
- The reference and current point grid coordinates obtained from DIC are used to calculate the camera calibration parameters, starting with the estimation of the center of distortion and following through to other intrinsic and extrinsic parameters
- Each individual speckle image is processed using the proposed SIC method, which includes the steps of estimating the distortion center, refining the homography, and calculating the complete set of calibration parameters.

Interesting comparison below when it comes to evaluating CMT and SIC method of calibration. 

![photo7](/hedwig_explains/img/sic/assets/Pasted%20image%2020240324221514.png)


### Some SIC based results !

![photo8](/hedwig_explains/img/sic/assets/Pasted%20image%2020240324221652.png)


## Conclusion :

1. The SIC method demonstrates superior flexibility, robustness to noise, and an ability to account for variations in distortion across different depths. 
2. While the SIC method is effective, it is computationally demanding and requires the implementation of advanced Digital Image Correlation (DIC) techniques capable of large deformation analysis
3. its application is currently limited to close-range measurements due to the necessity of filling the camera's field of view (FOV) entirely with the calibration pattern.
4. The paper suggests exploring the use of phase speckle patterns as a potential way to extend the applicability of the SIC method to larger FOV measurements. 




