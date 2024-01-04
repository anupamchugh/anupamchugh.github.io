---
title: 'PyTorch Mobile: Image Classification on iOS'
description: PyTorch joins the mobile ML party alongside Core ML and TFlite
date: '2019-10-29T13:55:44.831Z'
categories: []
keywords: []
slug: /@anupamchugh/pytorch-mobile-image-classification-on-ios-c822a36ecfa9
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__rcDmQER45lyxG69nF3XUNQ.jpeg)

PyTorch is one of the most sought-after deep learning frameworks. It has its own advantages over the other widely used frameworks like TensorFlow (here’s [a great comparison of these two frameworks](https://thegradient.pub/state-of-ml-frameworks-2019-pytorch-dominates-research-tensorflow-dominates-industry/)). Facebook recently released PyTorch 1.3 and plugged the missing piece of the pie in their framework—which is, **mobile support for Android and iOS.**

Up until now, the two most used mobile machine learning frameworks were Apple’s [Core ML](https://heartbeat.comet.ml/whats-new-in-core-ml-3-d108d352e50a) and Google’s [TensorFlow Lite](https://heartbeat.comet.ml/how-tensorflow-lite-optimizes-neural-networks-for-mobile-machine-learning-e6ffa7f8ee12). So PyTorch’s entry into the mobile domain should be an interesting one. It’ll get a tough challenge from Core ML, but considering the cross-platform support, PyTorch will likely carve out its own space.

PyTorch has already created its own niche thanks to its _pythonic_ ways of building models and its easier learning curve. Moreover, it allows developers to build dynamic computational graphs and makes model debugging even easier, thanks to the Python debugging tools that are readily available.

### What’s New In PyTorch 1.3

*   **PyTorch Mobile**— From Python to providing mobile support across both platforms, this experimental feature is exciting for mobile developers.
*   **Named Tensors** — By adding associative names for tensor dimensions, PyTorch aims to help developers write readable and maintainable code.
*   **Quantization Support** — Space is always a blocker on mobile devices. By using [FBGEMM](https://github.com/pytorch/FBGEMM?fbclid=IwAR0-stiL8UABWKEbCxUFXLu-ah9K5_L3dNmHj8HarXKKEYYn4uhh-zePMC8) and [QNNPACK](https://github.com/pytorch/QNNPACK?fbclid=IwAR3Qh6B20bntQj-CAadXyWpEhlFtlgBOAoggX4FoPeZjM_5nOo74ws-Udqw), PyTorch strives to support [quantization](https://heartbeat.comet.ml/8-bit-quantization-and-tensorflow-lite-speeding-up-mobile-inference-with-low-precision-a882dfcafbbd), for x86 and ARM CPUs.

#### Plan Of Action

Running a PyTorch model on iOS Devices requires ticking the following checkboxes:

*   Converting the model to TorchScript format (.pt) using a Python script.
*   Integrating the PyTorch C++ pod framework to our Xcode project.
*   Using Objective C++ as the bridge header file to run PyTorch inferences from the Swift codebase.

In the next few sections, we’ll be running image classification on images captured from the camera or selected from the photos library using a PyTorch model on iOS Devices.

For Android developers looking to implement PyTorch, just hop on over to this [link](https://heartbeat.fritz.ai/pytorch-mobile-image-classification-on-android-5c0cfb774c5b) for a look at working with image classification on that platform.

### Setup

To start off, you need a Mac, Xcode 11, and a device with iOS 12 or above as a deployment target.

You need to install `torchvision` from `pip` using the command line, as shown below:

pip install torchvision

#### Converting Our Model

We need to use the [TorchScript](https://pytorch.org/docs/stable/jit.html) format in order to convert a model to PyTorch Mobile. Any CNN or ResNet model can be ported to PyTorch Mobile. Since I love my iPhone, I’ll be using a [MobileNetV2](https://heartbeat.comet.ml/building-an-image-recognition-model-for-mobile-using-depthwise-convolutions-643d70e0f7e2) model that’s highly optimized and provides great accuracy.

Running `python convert_pytorch_model.py` will generate your “mobilenet-v2.pt” model. It’s ready to ship into Xcode!

### Building Our PyTorch Mobile iOS Application

In this section, we’ll be creating our iOS Application that runs the PyTorch model on images taken from the camera or photos library and displays the label with the highest confidence on the screen.

#### Installing Dependencies

Create a new Xcode Project. A Single View iOS Application template would do the job. Once that’s done, install the following pod dependency in your Podfile (you need to do a `pod init` in your project directory to create a Podfile):

\# platform :ios, '12.0'  
target 'PyTorchMobileiOS' do  
     pod 'LibTorch', '~> 1.3.0'  
end

Doing this `pod install` creates a `xcworkspace` file in your project. Close all current Xcode sessions and relaunch using that file.

Now you should be able to add the framework from the Project Navigator -> General Tab, as shown below:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__gRVjFH8G8cYGOnWaHZ32IA.png)

#### Adding Labels For Our PyTorch Mobile Model

Our labels file is a text file with 1000s of words. You can view the contents of the file from the link below:

[**anupamchugh/PyTorchMobileiOS**  
_You can't perform that action at this time. You signed in with another tab or window. You signed out in another tab or…_github.com](https://github.com/anupamchugh/PyTorchMobileiOS/blob/master/PyTorchMobileiOS/model/labels.txt "https://github.com/anupamchugh/PyTorchMobileiOS/blob/master/PyTorchMobileiOS/model/labels.txt")[](https://github.com/anupamchugh/PyTorchMobileiOS/blob/master/PyTorchMobileiOS/model/labels.txt)

In the next sections, we’ll be using both Objective-C and Swift in our codebase. Objective-C is required to communicate with C++. Here’s an illustration of how the codes interact with each other:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__FfFON3iSH__A52m922Tju5Q.jpeg)

### Objective-C Code

Currently, PyTorch Mobile is a C++ library. Hence, it cannot directly communicate with Swift. So we need to use Objective-C to communicate with the C++ code.

Swift and Objective-C languages can communicate with each other using a bridging header file.

#### Creating an Objective-C Bridging Header File

A bridging header file basically exposes Objective-C header files to Swift.

In order to generate a bridging header file, simply drag and drop or create a new Objective-C header file in your project. Xcode automatically prompts you to create a bridging header file. The file name format is <**ProjectName>-Bridging-Header.h**

We’ve added `#import “TorchModule.h”` in our bridging header file. The code for the `TorchModule.h` file is given below:

In the above code, `NS_SWIFT_NAME` and `NS_UNAVAILABLE` are macros.

*   `NS_SWIFT_NAME` allows us to provide full Swift names for their Objective-C counterparts. So now, we can execute the Objective-C methods using the Swift functions assigned in the macros.
*   `NS_UNAVAILABLE` macro basically tells the compiler not to export that class, function or instance to Swift.

Such macros improve the Swift <> Objective-C interoperability tremendously.

#### Loading Our Model And Running Inference in Objective-C++

The above Objective-C++ code is where we’re loading the model after quantization, and then we’ll run the inference on the image. The TorchModule instance is initialized from the Swift codebase that we’ll see shortly.

The `initWithFileAtPath` method is called from the Swift counterpart method. It passes the location of the model file.

The `predictImage` gets the `CVPixelBuffer` of the image and converts it into an input tensor of the required shape. We then iterate through the scores of each label and return the index having the highest score back to Swift as the predicted output.

> Note: Setting `AutoGradMode` to `false` indicates we wish to run inference with our model only (no training).

Now that the Objective-C part is done, let’s jump back to the Swift code—the easier one!

### Swift Code

Let’s first build the UI programmatically. But first, embed the ViewController inside a Navigation Controller.

#### Building the UI Programmatically

There’s nothing fancy in the UI here. We just need to set up a `UIButton`, `UIImageView`, and `UILabel` in our `ViewController` class.

#### Configuring Button Action

Now, we need to set an action when the button is tapped. The idea is to show an ImagePicker that allows the user to pick images from the camera or gallery. For this, we’ll create a `UIAlertController` that has the `actionSheet` style.

You need to add the Privacy Usage Descriptions in the `info.plist` for the Camera and Photos Library each, as shown below:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__D__vf3__oaGdrffYTrQalVoQ.png)

> Note: Your ViewController class needs to conform to the `UIImagePickerControllerDelegate` and `UINavigationControllerDelegate` protocols in order to receive the image from the camera/photos library.

Now that we’ve set the UI for our application, it’s time to process the image to fit into the model input constraints and subsequently run the classifier. Let’s do that in the next section.

#### Preprocessing the Image

The following utility extension contains the code for resizing and normalizing the input image.

The image is `resized` as per the model input size which is (224x244). The normalized function converts the resized image into a `Float32` tensor. Now our input is ready to get inferred by the model.

#### Predicting Image

Now we just need to call the Objective-C prediction function with the processed input image from the Swift code, as shown below:

The `predictImage` function is where we resize and normalize the image and pass the tensor to the TorchModule Objective-C wrapper class we saw earlier.

In return, we display the predicted label on the screen, as shown in the illustration below:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__P1ni01yZT52jJ7694__mbsA.gif)

#### What’s Next

Moving forward, GPU support for PyTorch Mobile would be a major boost.

Also, Swift wrapper APIs will be something developers would keenly wait for to avoid bridging header files in their codebases.

That’s it for this one. I hope you enjoyed.

_Editor’s Note:_ [_Heartbeat_](https://heartbeat.comet.ml/) _is a contributor-driven online publication and community dedicated to providing premier educational resources for data science, machine learning, and deep learning practitioners. We’re committed to supporting and inspiring developers and engineers from all walks of life._

_Editorially independent, Heartbeat is sponsored and published by_ [_Comet_](http://comet.ml/?utm_campaign=heartbeat-statement&utm_source=blog&utm_medium=medium)_, an MLOps platform that enables data scientists & ML teams to track, compare, explain, & optimize their experiments. We pay our contributors, and we don’t sell ads._

_If you’d like to contribute, head on over to our_ [_call for contributors_](https://heartbeat.fritz.ai/call-for-contributors-october-2018-update-fee7f5b80f3e)_. You can also sign up to receive our weekly newsletters (_[_Deep Learning Weekly_](https://www.deeplearningweekly.com/) _and the_ [_Comet Newsletter_](https://info.comet.ml/newsletter-signup/)_), join us on_ [](https://join.slack.com/t/fritz-ai-community/shared_invite/enQtNTY5NDM2MTQwMTgwLWU4ZDEwNTAxYWE2YjIxZDllMTcxMWE4MGFhNDk5Y2QwNTcxYzEyNWZmZWEwMzE4NTFkOWY2NTM0OGQwYjM5Y2U)[_Slack_](https://join.slack.com/t/cometml/shared_invite/zt-49v4zxxz-qHcTeyrMEzqZc5lQb9hgvw)_, and follow Comet on_ [_Twitter_](https://twitter.com/Cometml) _and_ [_LinkedIn_](https://www.linkedin.com/company/comet-ml/) _for resources, events, and much more that will help you build better ML models, faster._