---
title: >-
  Anomaly Detection in iOS — Compute Image Differences Using Core Image in
  SwiftUI
description: ''
date: '2020-08-03T13:57:58.134Z'
categories: []
keywords: []
slug: /@anupamchugh/image-difference-using-computer-vision-in-ios-14-7753b8d61e82
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__sWgu__IXyOnGZ1P59.jpg)

Human eyes are very receptive to visual representations. Similarly, computer vision enables systems to understand and process images.

Core Image and Vision are the two main pillars of Computer Vision in iOS. During WWDC 2020 Apple pushed the envelope for both of them.

Core Image in iOS 14 now includes a few new built-in filters for image processing. Specifically, we have a `CIColorThreshold` filter to convert an image into just black and white by setting a threshold value as well as another `CIColorThresholdOtsu` which determines the appropriate threshold from the image’s histogram.

More importantly, we can now compare two images using the new `CIColorAbsoluteDifference` filter — our main focus in this article.

In the following sections, we’ll explore the use cases that can be achieved by analyzing the difference between images.

### Absolute Image Difference

This image processing task involves computing the absolute difference of each pixel across two images and adding them up.

In doing so, we get a new transformed image that shows the variations across the two images.

In the new Core Image filter, if the two images are exactly, the same, our output image would be black.

By comparing color differences across images we can:

*   Analyze video frames. For example, we can determine if the frames are consistent or there’s some shadow in any of the frames.
*   Anamoly detection to find outliers that can be missed by the naked eye. This is useful for spotting differences between images such as if a credit card or currency note has missing symbols.

Next up, we’ll explore a few examples of comparing two images.

### Core Image Filter: CIColorAbsoluteDifference

Let’s create a new SwiftUI application that performs image processing.

Core Image requires setting the input `CIImage`(which we’ll convert from UIImage) onto the `CIFilter`. Subsequently, we can set thresholds if any, and retrieve the `outputImage` instance from the filter. That `outputImage` instance is basically a copy of the `inputImage` which is then passed into CIContext’s function `createCGImage` to perform the transformation.

`CIContext` is where all the image processing takes place.

#### Spot The Difference Between Images in SwiftUI

The following example shows the classic “spot the difference in images” puzzle. But with computer vision.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__BkGClDLFYB3Le8qWzKTIow.png)

`CIFilter.colorAbsoluteDifference()` creates the CIFilter and we passed the two images on it.

We can also transform the two images into grayscale before comparing them.

#### Watermark Detection/Extraction

It’s common to come across a task where you need to ensure that a watermark or logo overlay is set over the image. Again, using the `CIColorAbsoluteDifference` we can determine that as shown below:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__pi6QDr__J7EjqagB9fBJJDQ.png)

#### Credit Card Anomaly Detection

Scanning credit cards in our mobile applications and extracting the digits is a fairly common computer vision task.

We can further leverage the power of the above Core Image Filter to determine if the credit card’s image hasn’t tampered. Moreover, we can keep a reference credit card image that’s blank and compare it with a scanned image to only extract the digits.

The following example shows how to do both of these things:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__DoSQ5xyYlMAeR9Vg3Xfkfg.png)

In the left-hand side image, to fully detect if outlier/anomaly is present using computer vision, we can extend the above example by comparing the output image with an opaque black image.

Here’s the complete code for computing image differences:

The full source code of the above SwiftUI + CoreImage application is available in my [GitHub Repository](https://github.com/anupamchugh/CoreImageAbsoluteColorDiff).

Apple’s image processing framework CoreImage is handy for image transformations and augmentations when preparing datasets.

We discussed a new filter `CIColorAbsoluteDifference` available in iOS 14 that compares two images by the color of each pixel(without the need of OpenCV).

This is useful in spotting blemishes across images, determining and removing duplicate images from a video or dataset.

That’s it for this one. Thanks for reading.