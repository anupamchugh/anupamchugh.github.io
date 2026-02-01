---
title: 'New in iOS 15: Vision Person Segmentation'
description: Separate people from backgrounds in images and videos
date: '2021-06-29T18:17:29.907Z'
categories: []
keywords: []
slug: /@anupamchugh/new-in-ios-15-vision-person-segmentation-5c031a2f3822
---

Vision is Apple’s framework that provides out-of-the-box solutions for complex computer vision challenges. It also abstracts the Core ML request by handling the pre-processing of images during classification.

With iOS 14, we got half a dozen [new Vision features](https://heartbeat.fritz.ai/whats-new-in-the-vision-framework-in-ios-14-73d22a942ba5), including contour detection, optical flow, trajectory detection, offline video processing, and hand and body pose estimation.

At WWDC 2021, Apple announced two new Vision requests: person and document segmentation.

In this article, I’ll be focusing on the new [Person Segmentation Vision request](https://developer.apple.com/documentation/vision/vngeneratepersonsegmentationrequest) introduced with iOS 15.

### Vision Person Segmentation Request

Semantic segmentation is a technique used to classify each pixel in an image. It’s commonly used to separate foreground objects from the background.

Autonomous driving and virtual backgrounds in video calls are two popular use cases where you might’ve observed semantic segmentation in some form.

[DeepLabV3](https://developer.apple.com/machine-learning/models/) is a popular machine learning model for performing image segmentation. In case you’re looking to go the Core ML way, check out [this tutorial](https://betterprogramming.pub/coreml-image-segmentation-background-remove-ca11e6f6a083) that shows you how to modify backgrounds in images.

Coming back to the Vision framework, the new `[VNGeneratePersonSegmentationRequest](https://developer.apple.com/documentation/vision/vngeneratepersonsegmentationrequest)` class facilitates person segmentation and returns a segmentation mask for people in a frame.

Here’s how to set it up:

let request = VNGeneratePersonSegmentationRequest()  
request.qualityLevel = .accurate  
request.outputPixelFormat = kCVPixelFormatType\_OneComponent8

The three quality levels are `accurate`, `balanced`, and `fast` — the latter ones are recommended in video processing tasks.

In the next section, we’ll see how to perform person segmentation on images in a SwiftUI app. Subsequently, we’ll see how to do the same using the new Core Image filter.

### Setting Up Our SwiftUI View

Here’s a simple SwiftUI interface that contains three images in a vertical stack:

`task` is the all-new SwiftUI modifier to execute asynchronous stuff. In it, we’ve invoked our `runVisionRequest` method.

### Running the Vision Request

The following method runs the Vision Person Segmentation Request and returns the masked output result:

Here’s how the original and masked images look:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__S9RFlBNQn__F0iC5RiuJX0Q.png)
![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__3rP4J__IrZViIUEOthjTnhg.png)

While the above segmentation mask uses the `accurate` quality level, here’s a look at `fast` and `balanced` results:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__BErCgiRI1jLOwOIrWKH__5Q.png)

To add a new background, we pass the segmentation mask into the `maskInputImage` function.

This function uses a `CoreImage` blend filter to crop out the masked image on the original and then blend it with a new background image.

It returns the following result:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__KGL__Y__JJwduHyPIi9JmFfA.png)
![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__L3Ff0675rA7a__OPS0OFIXQ.png)

### Running Core Image Filter

Core Image is Apple’s image processing framework that’s widely used in simple computer vision tasks.

In iOS 15, Core Image gets the following new filter:

CIFilter.personSegmentation()

We can apply it to our earlier SwiftUI view in the following way:

Here’s how it looks on the simulator:

To blend the above segmentation in a new background, you’d need to transform the red color into white for the [blend filter](https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIBlendWithMask) to work as intended.

### Conclusion

That sums up Vision’s new Person Segmentation request. It’ll be interesting to see the results on a real-time video player.

You can download the full source from the [GitHub Repository](https://github.com/iosdevie/iOS15-Resources/tree/main/iOS15VisionPersonSegmentation).

We can also run sequenced Vision requests. For instance, you could combine the above Person Segmentation with a face pose request to build creative AI applications.

[Philipp Gehrke](https://medium.com/u/144ed0020011) shows how to implement [Vision Body Pose Estimation](https://betterprogramming.pub/ios-14-vision-body-pose-detection-count-squat-reps-in-a-workout-c88991f7cad4). It might be a great place to start integrating the above Person Segmentation Request and detect human poses more accurately.

That’s it for this one. Thanks for reading.

### References

*   [WWDC 21 Session](https://developer.apple.com/videos/play/wwdc2021/10040/)