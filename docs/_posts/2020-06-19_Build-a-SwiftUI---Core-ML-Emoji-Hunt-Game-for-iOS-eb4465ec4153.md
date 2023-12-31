---
title: Build a SwiftUI + Core ML Emoji Hunt Game for iOS
description: "Let’s create a fun machine-learning iOS camera app that lets you search for things in your house that are similar to\_emojis"
date: '2020-06-19T12:42:03.633Z'
categories: []
keywords: []
slug: /@anupamchugh/build-a-swiftui-core-ml-emoji-hunt-game-for-ios-eb4465ec4153
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__9EtVukiTNijhgWKM.jpg)

The advent of machine learning on mobile has opened doors for a bunch of new opportunities. While it has allowed ML experts to tap into the mobile space, the other end of that equation is actually the show-stealer. Letting mobile application developers dabble in machine learning has actually made its with mobile application development so exciting.

The best thing is, that you needn’t be a machine learning expert in order to train or run models. Core ML, Apple’s machine learning framework, provides an easy-to-use API that lets you run inference (model predictions), fine-tune models, or re-train _on the device_.

Create ML, on the other hand, lets you create and train custom machine learning models (currently supported for images, objects, text, recommender systems, and linear regression) with a drag-and-drop macOS tool or in Swift Playgrounds.

If this didn’t amaze you, consider [SwiftUI](https://developer.apple.com/xcode/swiftui/), the new declarative UI framework that caused a storm when it was announced to the iOS community during WWDC 2019. It alone has led to an influx of developers learning Swift and iOS dev, given how easy it is to quickly build user interfaces.

Only together would SwiftUI, Core ML, and [Vision](https://developer.apple.com/documentation/vision) (Apple’s computer vision framework that preceded Core ML)give rise to smart AI-based applications. But that’s not all...you can leverage the power of machine learning to build fun games as well.

In the next few sections, we’ll build a camera-based iOS application that lets you hunt down the emojis in your house — something like a treasure hunt, which has to be among the popular indoor games we’re playing right now, as we find ourselves in quarantine.

### Plan of Action

*   We’ll use a `[MobileNet](https://github.com/tensorflow/models/blob/master/research/slim/nets/mobilenet_v1.md)` Core ML model to classify objects from the camera frames. If you want to read more about the MobileNet architecture, hop on over to this [article](https://machinethink.net/blog/googles-mobile-net-architecture-on-iphone/) for a detailed overview.
*   For setting up the camera, we’ll use AVFoundation, Apple’s own audio-video framework. With the help of `UIViewRepresentable`, we’ll integrate it into our SwiftUI view.
*   We’ll drive our Core ML model with the Vision framework, matching the model’s inference with the correct emoji (because every emoticon has a meaning).
*   Our game will consist of a timer, against which the user points the camera at different objects around a given area to find the one that matches the emoji.

### Getting Started

Launch Xcode and select SwiftUI as the UI template for the iOS application. Next, go to the `info.plist` file and add the camera privacy permissions with description.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__N3fLz3FEV2nufO1jK__I9rA.png)

### Create a Custom Camera View with AVFoundation

SwiftUI doesn’t provide native support for AVFoundation. Luckily, we can leverage SwiftUI interoperability with UIKit. Before we do that, let’s set up a custom camera view controller first. We’ll eventually wrap this in a SwiftUI `struct`.

At large, the above code does four things:

*   Creates a capture session.
*   Obtains and configures the necessary capture devices. We’ll use the back camera.
*   Sets up the inputs using the capture devices.
*   Configures the output object which displays the camera frames.

Also, we’ve added a custom protocol: `EmojiFoundDelegate`, which’ll eventually inform the SwiftUI view when the emoji equivalent image is found. Here’s the code for the protocol:

protocol EmojiFoundDelegate{  
func emojiWasFound(result: Bool)  
}

You’ll also notice the protocol defined in the class declaration: `AVCaptureVideoDataOutputSampleBufferDelegate`. To conform to this, we need to implement the `captureOutput(_:didOutputSampleBuffer:from)` function wherein we can access the extracted frame buffers and pass them onto the Vision-Core ML request.

### Process Camera Frames With Vision And CoreML

Now that our camera is set up, let’s extract the frames and process them in realtime. We’ll pass on the frames to the Vision request that runs the Core ML model.

Add the following piece of code in the `CameraVC` class that we defined above:

*   We wrap our `CoreML` model (download the [MobileNet version](https://developer.apple.com/machine-learning/models/) from here or you can find it in GitHub Repository at the end of the article) in a `VNCoreMLRequest`.
*   The `captureOutput` the function converts the `CGSampleBuffer` retrieved from real-time camera frame into a `CVPixelBuffer`, which eventually gets passed onto the `updateClassification` function.
*   The `VNImageRequestHandler` takes care of converting the input image into the constrains that the Core ML model requires — thereby freeing us of some boilerplate code.
*   Inside the `processClassifications` function, we compare the image identified by the Core ML model with the `emojiString` (this is passed from the SwiftUI body interface that we’ll see shortly). Once there’s a match, we call the delegate to update the SwiftUI view.

Now that the tough part is over, let’s hop over to SwiftUI.

### Building our SwiftUI Game

Our game consists of four states: `emoji found`, `not found`, `emoji search`, and `game over`. Since SwiftUI is a state-driven framework, we’ll create a `@State` enum type that switches between the aforementioned states and updates the user interface accordingly. Here’s the code for the `enum` and the `struct` that holds emoji data:

enum EmojiSearch{  
    case found  
    case notFound  
    case searching  
    case gameOver  
}

struct EmojiModel{  
    var emoji: String  
    var emojiName: String  
}

In the following code, we’ve set up a `Timer` for a given number of seconds (say 10 in our case), during which the user needs to hunt an image that resembles the emoji. Depending on whether user manages to do it or not, the UI is updated accordingly:

The following two functions are invoked to reset the timer at each level:

func instantiateTimer() {

self.timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()  
}

func cancelTimer() {  
  self.timer.upstream.connect().cancel()  
}

Now, SwiftUI doesn’t really work the best with switch statements in the `body` — unless you wrap them in a generic parameter `AnyView`. Instead, we put the switch statement in a function `emojiResultText`, as shown below:

Lastly, we need to create a wrapper struct for the `CameraVC` we created initially. The following code does that and passes the `emojiString`, which is eventually matched with the ML model’s classification results:

The `@Binding` property wrapper defined in the `Coordinator` class lets you update the SwiftUI State from the `CustomCameraRepresentable` struct. Basically the `Coordinator` class acts as a bridge between UIKit and SwiftUI — letting you update one from the other by using delegates and binding property wrapper(s).

Let’s look at some of the outputs from our SwiftUI game in action:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__Xvh6FXG2s3Z6__mkwHkVUnw.png)

Here’s a screengrab of the application running on a bunch of different objects:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__OUeWRE6Ikk7EN05DR5vVaQ.gif)

### Conclusion

We were quickly able to build a small Emoji Hunter Game using SwiftUI, Core ML, and Vision. You can further improve on this experience by adding audio when the emoji-equivalent image is found. Also, by using this amazing library [Smile](https://github.com/onmyway133/Smile), you can quickly search the keyword name of an emoji and vice-versa.

With WWDC 2020 just around the corner, it’ll be interesting to see how Apple surprises Core ML and SwiftUI developers. A simpler integration of AVFoundation with SwiftUI and expanding the set of Core ML model layers would help train more kinds of ML models on on-device.

For instance, RNN’s layers such as LSTM would open up possibilities for the stock market prediction-based applications (perhaps for entertainment purposes only right now. — don’t use them when making investment decisions). This is something the iOS community would keenly look forward to.

You can download the full project from this [GitHub Repository](https://github.com/anupamchugh/iowncode/tree/master/SwiftUIVisionEmojiHunt).

That’s it for this one. I hope you enjoyed 😎