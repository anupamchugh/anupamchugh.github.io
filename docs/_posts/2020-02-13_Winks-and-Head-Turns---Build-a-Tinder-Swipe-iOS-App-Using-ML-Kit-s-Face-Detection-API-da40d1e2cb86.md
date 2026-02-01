---
title: >-
  Winks and Head Turns — Build a Tinder-Swipe iOS App Using ML Kit’s Face
  Detection API
description: Leverage ML Kit’s Face Detection API to perform touchless swipes
date: '2020-02-13T14:53:19.462Z'
categories: []
keywords: []
slug: >-
  /@anupamchugh/build-a-touchless-swipe-ios-app-using-ml-kits-face-detection-api-da40d1e2cb86
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__vlPWJD3pv2pR80Kx.jpg)

With 3D Motion Sense technology already out on Pixel 4, it looks like our way of interacting with phones is going to change soon. Touchless interactions have a promising future for sure, with Apple’s most ambitious product to date— AR glasses—already under development.

While the True Depth technology on the front iPhone camera does allow you to add eye-tracking features to your applications, it is only available on iPhone X and above. Luckily, we can leverage Firebase’s ML Kit to help us. Specifically, ML Kit’s Face Detection API does a lot more than just face detection on the device. Some of the features that ML Kit’s Face Detection supports are:

*   **Face tracking** — This extends the face detection technology into video sequences to track a face that’s appearing for a period of time, based on the motion and position. In no way does this imply facial recognition, however (identifying the specific face shown).
*   **Face orientations** — The API returns the Euler angles X, Y, and Z to determine the position in real-world space. A face with a positive Euler X angle implies it’s upward-facing; a positive Euler Y angle indicates a face turned left; and a positive Euler Z angle is rotated counter-clockwise relative to the camera.
*   **Face classification** — The face detector possesses the ability to classify a face as a _smiling_ one as well as return the probabilities of the eyes being open or not.

Before we deep dive into the implementation, let’s list our goals for this tutorial.

### Our Goals

*   We’ll start off by creating a Tinder-like swiping card interface in our iOS application using Swift. Left-right swipe is a popular UI design seen in many applications now.
*   Next up, we’ll set up our camera using the AVFoundation framework for frame processing.
*   Finally, we’ll integrate ML Kit and use the above-mentioned face classification/orientation results to handle swiping without touching.

#### Our Final Destination

By the end of this tutorial, you’ll be able to wink or turn your head to perform a swipe. The following illustration is a result of what I was able to achieve after completing this application:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__3sGqBt8KK__1gr9ZV33BAlg.gif)

### Creating a Tinder-Like Swiping Interface

Fire up Xcode to create a new Single View Application using UIKit. I’m not a big fan of storyboards, so I’ll be creating all of the views programmatically.

> Disclosure _:_ During the development of this project, I came across [this excellent piece](https://medium.com/@phillfarrugia/building-a-tinder-esque-card-interface-5afa63c6d3db) that showcases how to build a stack of Tinder-like cards with swiping gesture capabilities and have used it as kickstarter.

To start off, let's create a custom view — `TinderCard.swift`—as shown below:

Besides setting up our `swipeView` on which we’re setting a unique color from the `DataModel`(more on this next), we’ve added the `UIPanGestureRecognizer` to the above custom view with a certain threshold, beyond which the swipe is taken into consideration and the custom delegate function(`swipeDidEnd`) is called to remove that card from the stack.

#### Data Model

The data model currently just holds a color property. You can further customize this by adding images and text to make it similar to actual Tinder cards:

import UIKit

struct DataModel {  
      
    var bgColor: UIColor  
        
    init(bgColor: UIColor) {  
        self.bgColor = bgColor  
    }  
}

#### Custom Protocols

We need to create a couple of protocols. One for the data source, and the other for handling the swipe gesture actions. Both of them are defined below:

import UIKit

protocol SwipeCardsDataSource {  
    func numberOfCardsToShow() -> Int  
    func card(at index: Int) -> TinderCardView  
    func emptyView() -> UIView?  
      
}

protocol SwipeCardsDelegate {  
    func **swipeDidEnd**(on view: TinderCardView)  
}

The `swipeDidEnd` function that’s invoked on the delegate in the custom view we saw earlier triggers the stack container (which holds the stack of swipe cards). Let’s look at the `StackContainerView.swift` class:

The `StackContainerView` class above is responsible for holding the group of `TinderCardViews`. With every swipe, it checks the data source (that’s defined in the `ViewController`) for remaining cards (if there are any), and adds them to the bottom of the stack.

Before we plug in the above container view into our `ViewController`, here’s a glimpse of the Tinder-like card swiping interface in action:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__z0pVCXRU5AlyGaYbexvNXg.gif)

Moving forward, we need to set up our `ViewController` with the above `StackContainer` and Buttons that could simulate the swiping gesture animation when pressed. Let’s do that in the next section.

### Simulate a Swiping Gesture Programmatically

To simulate a swiping gesture upon a button click, we need to animate our Tinder card views horizontally, with an affine transformation to bring about the angle to mimic the action of swiping right or left in real life.

In the following `ViewController.swift` code, we’ll set up our like and dislike buttons and plug the data source onto the stack container custom view.

To pass the `modelData` from the `ViewController` to the `StackContainerView`, we’ve conformed to the protocol by:

stackContainer.dataSource = self

Subsequently, we need to implement the methods of the `SwipeCardsDataSource` protocol, as shown below:

extension ViewController : SwipeCardsDataSource {  
      
    func numberOfCardsToShow() -> Int {  
        return modelData.count  
    }  
      
    func card(at index: Int) -> TinderCardView {  
        let card = TinderCardView()  
        card.dataSource = modelData\[index\]  
        return card  
    }  
      
    func emptyView() -> UIView? {  
        return nil  
    }  
}

#### Creating our Custom Buttons

The implementation of the `addButtons` function that’s invoked in the `viewDidLoad` method is as follows:

The `onButtonPress` selector function is where we’ll simulate our swipe left and right gestures, as shown below:

[@objc](http://twitter.com/objc "Twitter profile for @objc") func onButtonPress(sender: UIButton){  
          
        if let firstView = stackContainer.subviews.last as? TinderCardView{  
            if sender.tag == 0{  
                firstView.leftSwipeClicked(stackContainerView: stackContainer)  
            }  
            else{  
                firstView.rightSwipeClicked(stackContainerView: stackContainer)  
            }  
        }  
}

The `leftSwipeClicked` and `rightSwipeClicked` functions are implemented in the `TinderCardView` class. The code for the `leftSwipeClicked` function is given below:

func leftSwipeClicked(stackContainerView: StackContainerView)  
{  
    let finishPoint = CGPoint(x: **center.x - frame.size.width \* 2**, y: center.y)  
    UIView.animate(withDuration: 0.4, animations: {() -> Void in

self.center = finishPoint  
        self.transform = CGAffineTransform(rotationAngle: **\-1**)

}, completion: {(\_ complete: Bool) -> Void in  
        stackContainerView.swipeDidEnd(on: self)  
        self.removeFromSuperview()

})  
}

The right swipe is analogous to the above code. Instead of doing an affine transformation with the rotation angle set as -1, you need to do the same with the rotation angle set to + 1 to show the tilt towards the right side.

Let’s look at what we’ve achieved so far:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__TlNdmYNUutaIjE66GvrH1A.gif)

Now that our Tinder-like card swiping prototype is done, let’s move on to the camera section. If you’ve noticed from the previous section, we need to set up our `CameraView` class. We’ll do this at the bottom of the screen.

### Setting Up the Camera Using AVFoundation

Before you set up your camera, add the `NSCameraUsageDescription` in the `info.plist` file to avoid a runtime crash later on.

Apple’s **AVFoundation** framework helps us do the following things:

*   Set up our camera’s input device. We’ll use the front camera for this use case.
*   Initialize the camera session.
*   Capture a sample buffer from the output. We’ll pass the sample buffer from the live frames to ML Kit’s vision instance to detect faces and, subsequently, blinks and face positioning.

The code for the `CameraView.swift` class is given below:

The `beginSession` function will be invoked from the `ViewController` when the Navigation Bar button is pressed.

Let’s add the `CameraView` we’ve just created into our `ViewController`’s view programmatically, as shown below:

func addCameraView()  
{  
    cameraView = CameraView()  
    **cameraView.blinkDelegate = self**  
    view.addSubview(cameraView)

cameraView.translatesAutoresizingMaskIntoConstraints = false  
    cameraView.bottomAnchor.constraint(equalTo: view.bottomAnchor).isActive = true  
    cameraView.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true  
    cameraView.widthAnchor.constraint(equalToConstant: 150).isActive = true  
    cameraView.heightAnchor.constraint(equalToConstant: 150).isActive = true  
}

Take note of the `blinkDelegate` delegate set on the `CameraView`. Let’s define the custom protocol `BlinkSwiperDelegate`, which consists of two methods:

protocol BlinkSwiperDelegate {

func leftBlink()  
func rightBlink()

}

We’ll invoke these methods whenever the respective blink is detected in order to perform a swipe on the `TinderCardView`.

Let’s move on to the last leg of this tutorial and integrate ML Kit in our iOS application and leverage its Face Detection API.

### Integrating ML Kit in our IOS Application

In order to get started with the ML Kit integration, [Firebase’s documentation](https://firebase.google.com/docs/ios/setup) is a good place to start. The following are the highlights of what you need to do when integrating Firebase in your application:

*   Create a new Firebase project and register your app’s bundle ID.
*   Download the `GoogleService-Info.plist` file and put it in your Xcode project.
*   Add the relevant Firebase dependencies using Cocoapods or Swift Package Manager. In our case they are:

pod 'Firebase/MLVision'  
pod 'Firebase/MLVisionFaceModel'

*   Finally, initialize Firebase in your `AppDelegate` using `FirebaseApp.configure()`.

Now that we’re done with the Firebase setup, `import FirebaseMLVision` into your `CameraView.swift` class. It’s time to perform face detection on live frames from the camera.

Initialize the following properties in your `CameraView.swift` class:

private lazy var vision = Vision.vision()

lazy var options : VisionFaceDetectorOptions = {  
        let o = VisionFaceDetectorOptions()  
        o.performanceMode = .accurate  
        o.landmarkMode = .none  
        **o.classificationMode = .all**  
        o.isTrackingEnabled = false  
        o.contourMode = .none  
          
        return o  
    }()

> Note: We’ve disabled landmarks, contours, and face tracking detection in order to speed up the blink detection.

In order to detect the probabilities of eyes being open, and face orientations, it’s important that you set the `classificationMode` to `all` on the Vision face detector options.

In order to run the face detection, we need to pass the options in the `faceDetector` method. The image that’s passed to this `faceDetector` should be of the type `VisionImage`. The following code snippet shows the gist of ML Kit’s Face Detection in iOS.

let faceDetector = vision.faceDetector(options: options)  
faceDetector.process(image, completion : {})

Let’s retrieve the sample buffer from our AVFoundation’s `captureOutput` delegate method and pass it for face detection now:

func captureOutput(\_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {  
          
        guard let imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else {  
            print("Failed to get image buffer from sample buffer.")  
            return  
        }  
        **let visionImage = VisionImage(buffer: sampleBuffer)**  
        let metadata = VisionImageMetadata()  
        let visionOrientation = **visionImageOrientation**(from: **imageOrientation**())  
        metadata.orientation = visionOrientation  
        visionImage.metadata = metadata  
        let imageWidth = CGFloat(CVPixelBufferGetWidth(imageBuffer))  
        let imageHeight = CGFloat(CVPixelBufferGetHeight(imageBuffer))  
          
        DispatchQueue.global().async {  
            self.detectFacesOnDevice(in: visionImage, width: imageWidth, height: imageHeight)  
        }  
}

`imageOrientation` and `visionImageOrientation` are two utility functions (available with the source code at the end) to determine the orientation of the image retrieved from the camera and to set it up in the metadata before invoking the face detector.

#### Performing Face Detection for Blinking and Face Orientation

The `detectFacesOnDevice` does the face detection for us on the `VisionImage` and returns the list of `VisionFace`s detected. Using these, we can find the bounding box of the face, `leftEyeOpenProbability`, `rightEyeOpenProbability`, and more. The following code snippet contains the full implementation of the function:

In the above code, when a blink is detected, we trigger the relevant delegate function. Take note of the `restingFace` boolean property. It’s used to prevent triggering the delegate functions multiple times and lets the user return to the normal state (non-blinking) for the next swipe by a wink.

Alternatively, you can use the face position using `headEulerAngleZ` to perform a swipe by gesture— a positive value occurs when you tilt your head towards the left and should trigger swipe left. You can set a threshold value for the angle. The following snippet shows a condition that handles both a wink and a head pose:

if headPose > 25 || (rightEyeOpenProbability > 0.95 && leftEyeOpenProbability < 0.1){

swipeLeft()  
}

The delegate functions `rightBlink` and `leftBlink` invoke the respective swipes programmatically as we saw in the previous section on simulating a swipe gesture.

That’s it! You should achieve a result similar to what you saw in the beginning.

The full source code for this application is available in this [GitHub Repository](https://github.com/anupamchugh/iowncode/tree/master/BlinkPoseAndSwipeiOSMLKit). Just integrate Firebase, copy the `GoogleService-Info.plist` file into the project, and you should be good to go**.**

### Where‘s Next?

Touchless gesture interaction using motion sensing has a promising future, and with augmented reality-powered glasses already in the works, the technology should continue to see a lot of investment.

Moving on from here, you can create your own gesture detection Core ML models to perform touchless swiping in your applications_._ Or you can re-use one of the already-made models available [here](https://github.com/hanleyweng/Gesture-Recognition-101-CoreML-ARKit)_._

That’s it for this one. Thanks for reading.