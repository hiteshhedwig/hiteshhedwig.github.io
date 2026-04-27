---
title: Implementation of MobileNet Model
date: '2021-04-27'
summary: >-
  Explains how MobileNet uses depthwise separable convolutions to drastically
  reduce model size and compute while keeping strong accuracy, with a PyTorch
  implementation.
tags:
  - code
  - researchpaper
  - intuition
  - deeplearning
  - computervision
draft: false
---

![xception](data:image/png;base64,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)

# Abstract allows us to understand paper:

We present a class of efficient models called MobileNets
for mobile and embedded vision applications. MobileNets
are based on a streamlined architecture that uses depth-
wise separable convolutions to build light weight deep
neural networks. We introduce two simple global hyper-
parameters that efficiently trade off between latency and
accuracy. These hyper-parameters allow the model builder
to choose the right sized model for their application based
on the constraints of the problem. 

We present extensive
experiments on resource and accuracy tradeoffs and show
strong performance compared to other popular models on
ImageNet classification. We then demonstrate the effective-
ness of MobileNets across a wide range of applications and
use cases including object detection, finegrain classification, face attributes and large scale geo-localization.

#  In a nutshell:
The mobilenet paper is inspired from Xception paper ([my implementation](https://hiteshhedwig.github.io/hedwig_explains/2020/10/28/intutition-behind-xception-model/)). While in xception network. Author used depthwise convolutions followed by pointwise convolutions. This helped decreasing computational cost of the entire model quite much. Entire aim of mobilenet paper was to deliver state of the art model whose size is significantly less than previous SOTA(state-of-the-art) models like: VGG19, ResNet(34,50 etc), Inception etc. 

[![mb1.png](https://i.postimg.cc/x8gvDJGz/mb1.png)](https://postimg.cc/0KMM7NBk)

As you can see above, MobileNet model got 4.2 million parameters. Comparison to GoogleNet (6.8 million), VGG16 (128 million). That's what is helpful. And suggested by this paper.  MobileNet is nearly as accurate as VGG16 while being 32 times smaller and  27 times less compute intensive. It is more accurate than
GoogleNet while being smaller and more than 2.5 times less
computation.

> Note: MobileNet comparison is not only limited to GoogleNet or VGG but also applicable to PlaNet, CoCo object detection etc.

[![mb2.png](https://i.postimg.cc/FRNkrFHg/mb2.png)](https://postimg.cc/zL2GprWV)

# MobileNet Main Discussion:

For MobileNets the depthwise convolution applies a single filter to each input channel. The pointwise convolution then applies a 1 × 1 convolution to combine the
outputs the depthwise convolution. 

[![mb3.png](https://i.postimg.cc/SQtR5fCG/mb3.png)](https://postimg.cc/fkmMSXH3)

As you can see above. Instead of Standard Convolution strategy, we are using 3x3 depthwise convolution followed by Batch Normalization and ReLU. Later 1x1 pointwise convolution to complete our depthwise separable convolution layer.
- Depthwise separable convolution layer :
    -  3x3 depthwise convolution
    -  1x1 pointwise convolution

This factorization has the effect of
drastically reducing computation and model size. Depthwise separable convolution are made up of two
layers: depthwise convolutions and pointwise convolutions.
We use depthwise convolutions to apply a single filter per
each input channel (input depth). Pointwise convolution, a
simple 1×1 convolution, is then used to create a linear combination of the output of the depthwise layer. MobileNets
use both batchnorm and ReLU nonlinearities for both layers.

# Architecture:

- Conv dw -> Depthwise convolution
- s ->  stride

Counting depthwise and pointwise convolutions as separate layers, MobileNet has 28 layers. All layers are followed by a batchnorm and ReLU nonlinearity with the exception of the final fully connected layer which has no nonlinearity and feeds into a softmax layer for classification.

[![mb4.png](https://i.postimg.cc/cJ2ZhXVK/mb4.png)](https://postimg.cc/rd1vFCyc)

> Important: As you can see above image got one 'typo' word. I was reading the paper. And i think, stride should be 1 (s1) not s2. So incase you are implementing paper on your own. Make sure you don't miss this.

# Code

Implementing depthwise separable convolution.

```
import torch
import torch.nn as nn

class depthwise_pointwise(nn.Module):
    def __init__(self, channels, stride=1):
        super(depthwise_pointwise, self).__init__()
        self.depthwise_layer= nn.Sequential(
            nn.Conv2d(channels[0], channels[0],3,
                      groups=channels[0], padding=1, stride=stride),
            nn.BatchNorm2d(channels[0]),
            nn.ReLU(),
            nn.Conv2d(channels[0],channels[1],1),
            nn.BatchNorm2d(channels[1]),
            nn.ReLU(),
        )
    
    def forward(self,x):
        return self.depthwise_layer(x)
```
Main Mobilenet structure:
```
class Mobilenet(nn.Module):
    def __init__(self,depthwise_pointwise):
        super(Mobilenet, self).__init__()
        self.conv1= nn.Conv2d(3,32, 3, stride=2, padding=1)
        self.bn1= nn.BatchNorm2d(32)
        self.relu= nn.ReLU()
        #depthwise sep
        self.dw_s1= depthwise_pointwise([32,64], stride=1)
        self.dw_s2= depthwise_pointwise([64,128], stride=2)
        self.dw_s3= depthwise_pointwise([128,128])
        self.dw_s4= depthwise_pointwise([128,256], stride=2)
        self.dw_s5= depthwise_pointwise([256,256])
        self.dw_s6= depthwise_pointwise([256,512], stride=2)
        # x5 layer stack
        self.dw_x5= depthwise_pointwise([512,512])
        # dw layer
        self.dw_s7= depthwise_pointwise([512,1024], stride=2)
        self.dw_s8= depthwise_pointwise([1024,1024])
        #avg pool
        self.avgpool= nn.AdaptiveAvgPool2d((1,1))
        self.fc= nn.Linear(1024,1000)


    def forward(self,x):
        x= self.relu(self.bn1(self.conv1(x)))
        print(x.size())
        x= self.dw_s1(x)
        print(x.size())
        x= self.dw_s2(x)
        print(x.size())
        x= self.dw_s3(x)
        print(x.size())
        x= self.dw_s4(x)
        print(x.size())
        x= self.dw_s5(x)
        print(x.size())
        x= self.dw_s6(x)
        print(x.size())
        for i in range(5):
            x= self.dw_x5(x)
        print(x.size())
        x= self.dw_s7(x)
        print(x.size())
        x= self.dw_s8(x)
        print(x.size())
        x= self.avgpool(x)
        print(x.size())
        x=x.view(x.shape[0],-1)
        x= self.fc(x)
        print(x.size())

        return x
```
```
mb= Mobilenet(depthwise_pointwise)
img= torch.randn(1,3,224,224)
k=mb(img)

> Output:
torch.Size([1, 32, 112, 112])
torch.Size([1, 64, 112, 112])
torch.Size([1, 128, 56, 56])
torch.Size([1, 128, 56, 56])
torch.Size([1, 256, 28, 28])
torch.Size([1, 256, 28, 28])
torch.Size([1, 512, 14, 14])
torch.Size([1, 512, 14, 14])
torch.Size([1, 1024, 7, 7])
torch.Size([1, 1024, 7, 7])
torch.Size([1, 1024, 1, 1])
torch.Size([1, 1000])
```

# MobileNet Architecture :

```
Mobilenet(
  (conv1): Conv2d(3, 32, kernel_size=(3, 3), stride=(2, 2), padding=(1, 1))
  (bn1): BatchNorm2d(32, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
  (relu): ReLU()
  (dw_s1): depthwise_pointwise(
    (depthwise_layer): Sequential(
      (0): Conv2d(32, 32, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1), groups=32)
      (1): BatchNorm2d(32, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
      (2): ReLU()
      (3): Conv2d(32, 64, kernel_size=(1, 1), stride=(1, 1))
      (4): BatchNorm2d(64, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
      (5): ReLU()
    )
  )
  (dw_s2): depthwise_pointwise(
    (depthwise_layer): Sequential(
      (0): Conv2d(64, 64, kernel_size=(3, 3), stride=(2, 2), padding=(1, 1), groups=64)
      (1): BatchNorm2d(64, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
      (2): ReLU()
      (3): Conv2d(64, 128, kernel_size=(1, 1), stride=(1, 1))
      (4): BatchNorm2d(128, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
      (5): ReLU()
    )
  )
  (dw_s3): depthwise_pointwise(
    (depthwise_layer): Sequential(
      (0): Conv2d(128, 128, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1), groups=128)
      (1): BatchNorm2d(128, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
      (2): ReLU()
      (3): Conv2d(128, 128, kernel_size=(1, 1), stride=(1, 1))
      (4): BatchNorm2d(128, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
      (5): ReLU()
    )
  )
  (dw_s4): depthwise_pointwise(
    (depthwise_layer): Sequential(
      (0): Conv2d(128, 128, kernel_size=(3, 3), stride=(2, 2), padding=(1, 1), groups=128)
      (1): BatchNorm2d(128, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
      (2): ReLU()
      (3): Conv2d(128, 256, kernel_size=(1, 1), stride=(1, 1))
      (4): BatchNorm2d(256, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
      (5): ReLU()
    )
  )
  (dw_s5): depthwise_pointwise(
    (depthwise_layer): Sequential(
      (0): Conv2d(256, 256, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1), groups=256)
      (1): BatchNorm2d(256, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
      (2): ReLU()
      (3): Conv2d(256, 256, kernel_size=(1, 1), stride=(1, 1))
      (4): BatchNorm2d(256, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
      (5): ReLU()
    )
  )
  (dw_s6): depthwise_pointwise(
    (depthwise_layer): Sequential(
      (0): Conv2d(256, 256, kernel_size=(3, 3), stride=(2, 2), padding=(1, 1), groups=256)
      (1): BatchNorm2d(256, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
      (2): ReLU()
      (3): Conv2d(256, 512, kernel_size=(1, 1), stride=(1, 1))
      (4): BatchNorm2d(512, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
      (5): ReLU()
    )
  )
  (dw_x5): depthwise_pointwise(
    (depthwise_layer): Sequential(
      (0): Conv2d(512, 512, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1), groups=512)
      (1): BatchNorm2d(512, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
      (2): ReLU()
      (3): Conv2d(512, 512, kernel_size=(1, 1), stride=(1, 1))
      (4): BatchNorm2d(512, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
      (5): ReLU()
    )
  )
  (dw_s7): depthwise_pointwise(
    (depthwise_layer): Sequential(
      (0): Conv2d(512, 512, kernel_size=(3, 3), stride=(2, 2), padding=(1, 1), groups=512)
      (1): BatchNorm2d(512, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
      (2): ReLU()
      (3): Conv2d(512, 1024, kernel_size=(1, 1), stride=(1, 1))
      (4): BatchNorm2d(1024, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
      (5): ReLU()
    )
  )
  (dw_s8): depthwise_pointwise(
    (depthwise_layer): Sequential(
      (0): Conv2d(1024, 1024, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1), groups=1024)
      (1): BatchNorm2d(1024, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
      (2): ReLU()
      (3): Conv2d(1024, 1024, kernel_size=(1, 1), stride=(1, 1))
      (4): BatchNorm2d(1024, eps=1e-05, momentum=0.1, affine=True, track_running_stats=True)
      (5): ReLU()
    )
  )
  (avgpool): AdaptiveAvgPool2d(output_size=(1, 1))
  (fc): Linear(in_features=1024, out_features=1000, bias=True)
)
```







