---
title: My Predictions for WWDC 2020
date: '2020-06-15T17:14:29.182Z'
categories: []
keywords: []
slug: /an-ios-developers-predictions-for-wwdc-2020
---

WWDC 2020 is almost here, and it’s Apple’s first online-only developer event given the current health situation. We’ll surely miss the applause from a live audience, and it’ll be interesting to see how Apple recreates that experience in its keynote and videos.

But what’s more exciting is the new goodies and updates that Apple will present to the developer community and world this year.

WWDC 2019 was unarguably the biggest Apple event in recent years, as it unveiled groundbreaking changes: system-level dark mode; a new iPadOS 13 with multiwindow implementation support; Project Catalyst, which allows porting iOS apps to macOS in a single click; or SwiftUI, Apple’s shiny new declarative UI framework.

This ensures the bar is set high for “Dub Dub” 2020, and at a general level, one would expect enhancements and improvements in the developer ecosystem and not so many massive new features.

I am excited and have a wish list of improvements and features I’d like to see at the Apple conference.

CoreML, CreateML, and Vision Framework were bolstered with huge updates last year while the RealityKit, SwiftUI, and Combine frameworks made their debuts and stole the show. I’d expect these six frameworks to be the key players this time around as well, with others revolving around them.

### CoreML: A Support for More Layers

CoreML introduced on-device transfer learning in WWDC 19 that allows us to retrain models on our iOS devices. Currently, it supports only k-nearest neighbor and CNN classifiers. One would expect Apple to expand the set of layers by including recurrent neural network (RNN) layers, such as LSTM; providing more built-in optimizers (currently there’s Adam and SGD), and unleashing a way to create custom loss functions.

The ability to train RNN models should help developers build interesting mobile machine learning apps, like price predictions for stocks (though, only for educational/entertainment purposes — don’t use them for investment advice) easily.

### CreateML: Training Custom Image-Segmentation Models and More

CreateML finally got its separate application outside of Playgrounds last time. It now allows nonmachine-learning developers to quickly train models with an amazing drag-and-drop interface, which boasts of built-in model trainers for image classifiers, object detection, and recommendation systems, among the many others.

Expanding the training possibilities by including image segmentation and pose estimation is on the top of my wish list. Having a built-in annotation tool, possibly one that lets you select objects from a video, would make training object detections a whole lot easier and possible to be done completely in-house — today you need to add your `annotation.json` file from the outside.

### A More Powerful Vision Framework

Vision is Apple’s deep-learning framework that provides out-of-the-box implementation for complex computer-vision algorithms. It also helps drive CoreML models. WWDC 19 introduced new pet-animal classifiers, a built-in image-classification tool, computing-image similarity, and bolstering face technology with capture-quality requests.

This year, Apple could push the computer-vision envelope even further by:

*   Expanding face capture quality to a more generic image-quality Vision request
*   Introducing movement tracking and providing a built-in ability to determine the distance of the objects from the camera to open possibilities for smarter applications
*   Bringing image registration and a built-in image-segmentation request would enable better digital-image processing that could be useful for medical use cases

These are some of the things I’d wish to see in the Vision framework updates this year.

### Huge Updates in RealityKit and Reality Composer

With the introduction of RealityKit, a 3D engine, Apple rebooted its augmented-reality (AR) strategy, which was earlier using SceneKit.

But it suffered from scarce documentation. Apple would surely look to work on that in order to bring developers onto the AR train. A new AR app with iOS 14, possibly to showcase object occlusion should be a good start. Out-of-the-box support for hand-gestures tracking will help open the door for exciting AR apps.

Reality Composer is an AR scene editor that lets you create, import, and customize 3D content. More flexibility in blending shapes with pivots and a way to import GLTF and other model file types to USDZ should help.

RealityKit will play a huge role in the coming years given Apple’s big aspirations with AR glasses. We can expect huge updates this year, and it could just be curtains for SceneKit in AR.

### More Combine Publishers

Combine, Apple’s own declarative-reactive-programming framework, was possibly the most polished framework on debut last year. Several Foundation types could expose their publisher’s functionality through it.

This year, Apple could introduce more built-in publishers for MapKit, PencilKit, CoreLocation, and CoreML and provide new merging operators.

### Machine Learning–Powered PencilKit

The PencilKit framework also made a debut last year, but the reception it got was fairly low key, as others stole the limelight. Currently, it lets you integrate the canvas and ink tools only.

Apple could propel it this year by allowing seamless integration of images and assets in the `PKCanvas`. Boosting the drawing framework with machine learning, either by incorporating built-in text recognition for handwriting or by having point detections, could create a stir and allow developers to build even more exciting machine learning applications.

### SwiftUI Might Be the Show Stealer Once Again

SwiftUI created a storm last time around, and this year may be no different. The state-driven framework is still a little rough around the edges, and the lack of good documentation coupled with missing UIKit functionalities has already set high expectations for SwiftUI 2.0. No wonder it’ll be the most talked about feature during and after the WWDC 2020 week.

With lots riding on its shoulders, here’s my SwiftUI wish list and improvements I’d like to see.

#### Collection views in SwiftUI

Collection views got an interesting update with the new compositional layouts, but they were altogether missed from SwiftUI. The declarative nature of compositional layouts should bring some kind of collection view in SwiftUI this year. In doing so, developers can build complex grid-based user interfaces.

#### Bring the missing UI views

The first version of SwiftUI was devoid of activity indicators, search bars, multiline text views, and refresh controls. We had to leverage either the `UIViewRepresentable` protocol and UIKit interoperability or use `GeometryReader` and shapes (for the progress bar) to build the equivalent SwiftUI wrapper views.

#### Improvements in tab views and navigation views

While the basic tab view and navigation view seem to work, there have been some grave underlying issues. For instance, SwiftUI’s tab view has been a cause of concern when switching tabs. Neither the scroll nor the navigation position is preserved, and you’d have to fall back on `UITabBarController`.

On the navigation front, the biggest issue was the handling of destination views in `NavigationLinks` — they were created before you tapped the navigation link. We’d expect a consistent lazy loading of destination views (Apple fixed it in Xcode 11.4.1, but it’s still inconsistent).

We’d expect Apple to fix these issues and probably come up with a better means of navigation for SwiftUI.

#### Scroll view’s current position

The ability to access the current scroll-view position in SwiftUI is missing. We can expect Apple to introduce a binding property for the position offset.

#### Easier integration with other frameworks

The `WKWebView`, `MapKit`, `PencilKit`, `ARKit` views and `ShareSheet` currently all require `UIViewRepresentable`. Having better interoperability with SwiftUI would accelerate the workflow and reduce boilerplate code.

#### Rehaul CoreData

Just like SwiftUI changed the way we construct user interfaces, it’s high time, Apple introduced something like SwiftData that’s constructed in Swift only, rather than Objective-C.

#### SwiftUI storyboards

While SwiftUI presents real-time canvas previews, having an app-level view that shows how the different SwiftUI views are connected — like a storyboard — would be a good addition and would help developers use SwiftUI in production.

### Closing Thoughts

While this comprises my primary wish list, having an Xcode for iPad would be a dream wish, considering we had Playgrounds introduced last time.

A TestFlight for macOS and Xcode visual `po`\-like debugging can’t be ruled out of the cards as well.

One can expect considerable changes in the `AVFoundation` API (considering we now have triple cameras or more) and `Location` and `Bluetooth` APIs too.

Like the last time, SwiftUI and RealityKit would be the front runners during WWDC 20 unless Apple surprises us, once again.

Thanks for reading. I’m looking forward to WWDC 2020 and beyond!