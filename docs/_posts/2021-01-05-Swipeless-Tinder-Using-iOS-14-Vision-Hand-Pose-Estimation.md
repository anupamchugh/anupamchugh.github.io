---
title: Swipeless Tinder Using iOS 14 Vision Hand Pose Estimation
date: '2021-01-05T14:20:05.335Z'
categories: []
keywords: []
slug: /swipeless-tinder-using-ios-14-vision-hand-pose-estimation
---

#### Let’s use the power of computer vision to detect hand gestures in iOS

-----

The introduction of iOS 14 brought in a slew of enhancements and interesting new features in Apple’s computer vision framework.

Vision framework was released in 2017 in a bid to allow mobile application developers to leverage complex computer vision algorithms with ease. Specifically, the framework incorporates a host of pre-trained deep learning models whilst also acting as a wrapper to quickly run your own custom Core ML models.

After the introduction of Text Recognition and VisionKit in iOS 13 to boost OCR, Apple shifted its focus towards sports and action classification in iOS 14’s Vision framework.

Primarily, the Vision framework now lets you do [Contour Detection](https://anupamchugh.github.io/2020/06/27/new-in-ios-14-vision-contour-detection.html), Optical Flow Request and includes a bunch of new utilities for offline video processing. But more importantly, we can now do Hand and Body Pose Estimation — which certainly opens the door for new possibilities in augmented reality and computer vision.

In this article, we’re focusing on Hand Pose estimation to build an iOS app that lets you perform touchless finger gestures.

If you’ve been following my pieces, I’ve already demonstrated how to Build a Touchless Swipe iOS App Using ML Kit’s Face Detection API. I felt that prototype was cool to integrate into dating apps like Tinder, Bumble, and more. But at the same time, it could cause eye strains and headaches due to the blinks and turns.

So, we’ll simply extend that use case by using hand pose gestures instead to swipe left or right — because in 2020, it's OK to be lazy and practice social distancing with our phones. Before we dive into the deep-end, let’s look at how to create a Vision Hand Pose Request in iOS 14.

### Vision Hand Pose Estimation

The new `VNDetectHumanHandPoseRequest` is an image-based vision request that detects a human hand pose. It returns 21 landmark points on each hand in an instance of the type:`VNHumanHandPoseObservation`. We can set the `maximumHandCount` to be detected in each frame during the Vision processing.

To get the points array of each finger, we’ll simply invoke the enum on the instance in the following way:

```
try observation.recognizedPoints(.thumb)  
try observation.recognizedPoints(.indexFinger)  
try observation.recognizedPoints(.middleFinger)  
try observation.recognizedPoints(.ringFinger)  
try observation.recognizedPoints(.littleFinger)
```

There’s also a wrist landmark that’s located on the center of the wrist and is not part of any of the above groups. Instead, it falls in the `all` group and can be retrieved in the following way:

```
let wristPoints = try observation.recognizedPoints(.all)
```

Once we’ve got the above points array, we can extract the individual points in the following way:

```
guard 

let thumbTipPoint = thumbPoints\[.thumbTip\],  
let indexTipPoint = indexFingerPoints\[.indexTip\],  
let middleTipPoint = middleFingerPoints\[.middleTip\],  
let ringTipPoint = ringFingerPoints\[.ringTip\],  
let littleTipPoint = littleFingerPoints\[.littleTip\],  
let wristPoint = wristPoints\[.wrist\]

else {return}
```

`thumbIP`, `thumbMP`, `thumbCMC` are the other individual points that you can retrieve from the thumb’s point group (and so on for the other fingers).

Each of the individual point objects contains the location in an `AVFoundation` coordinate-system along with their `confidence` threshold.

Subsequently, we can find distances or angles between points to create certain gesture processors. For instance, in [Apple’s demo application](https://developer.apple.com/documentation/vision/detecting_hand_poses_with_vision), they’ve created a pinch gesture by calculating the distance between thumb and index tip points.

### Getting Started

Now that we’re done with the basics of Vision Hand Pose Request, let's dive into the implementation.

Launch your Xcode and create a new UIKit application. Make sure you’ve selected the deployment target as iOS 14 and have set the `NSCameraUsageDescription` string in the `Info.plist`.

Since we’ve already covered how to create Tinder-esque cards with animation, here’s the [final code for that class](https://gist.github.com/anupamchugh/6a7f8941dc097d2e9c467cf791d94c91).

Similarly, here’s the code for the [StackContainerView.swift](https://gist.github.com/anupamchugh/03b08b2f3dac25eb1a78f6e00987a425) class that holds the bunch of Tinder cards.

### Setting Up Our Camera Using AVFoundation

Next up, let’s create our own custom camera using Apple’s `AVFoundation` framework.

Here’s the code for the ViewController.swift file:

{% gist 7092de8a70d5c52bbae52866cb1ba494 %}

There’s a lot happening in the above code. Let’s break it down.

*   `CameraView` is a custom UIView class that displays the camera contents on the screen. We’ll come to it shortly.
*   `setupAVSession()` is where we’re setting up the front-facing camera and adding it as the input to the `AVCaptureSession`.
*   Subsequently, we’ve invoked the `setSampleBufferDelegate` on the `AVCaptureVideoDataOutput`.

The `ViewController` class conforms to `HandSwiperDelegate` protocol:

```
protocol HandSwiperDelegate {  
  func thumbsDown()  
  func thumbsUp()  
}
```

We’ll trigger the respective method when the hand gesture is detected. Now, let’s look at how to run a Vision request on the captured frames.

### Running Vision Hand Pose Request On Captured Frames

In the following code, we’ve created an extension of our above `ViewController` which conforms to `AVCaptureVideoDataOutputSampleBufferDelegate`:

{% gist 46af4561f4fc252fe550d879af55961e %}

It’s worth noting that the points returned by the `VNObservation` belong to the Vision coordinate system. We need to convert them to the UIKit coordination to eventually draw them on the screen.

So, we’ve converted them into the AVFoundation coordinate system in the following way:

```
wrist = CGPoint(x: wristPoint.location.x, y: 1 - wristPoint.location.y)
```

Subsequently, we’ll pass these points in the `processPoints` function. For the sake of simplicity, we’re using just two landmarks — thumb tip and wrist — to detect the hand gestures.

Here’s the code for the `processPoints` function:

{% gist 733947e4f85320aed3c4103fda71f606 %}

The following line of code converts the `AVFoundation` coordinate system to the UIKit coordinates:

```
previewLayer.layerPointConverted(fromCaptureDevicePoint: point!)
```

Finally, based on the absolute threshold distance between the two points, we trigger the respective left swipe or right swipe action on the stack of cards.

`cameraView.showPoints(pointsConverted)` draws a line between the two points on the `CameraView` sublayer.

Here’s the full code of the `CameraView` class:

{% gist 95bc40d05507e155ccf4452f41a68f2f %}

### Final Output

The output of the application in action is given below:

![Gif](/assets/screenshots/swipeless-tinder-vision-ios14.gif)

### Conclusion

From gesture-based selfie clicks to drawing signatures to finding the different hand gestures people make in videos, there are so many ways you can take advantage of Vision’s new Hand Pose Estimation request.

One could also chain this Vision request with, say, a body pose request, to build complex gestures.

The full source code of the above project is available in my [GitHub Repository](https://github.com/anupamchugh/iOS14-Resources/tree/master/iOS14VisionHandPoseSwipe).