---
title: Advancements in Artificial Intelligence in iOS 14
description: >-
  Explore the latest features in Core ML, Create ML, ML Compute, Vision, Natural
  Language, and PencilKit frameworks
date: '2020-08-17T13:47:59.726Z'
categories: []
keywords: []
slug: /@anupamchugh/advancements-in-artificial-intelligence-in-ios-14-c1602f5d4951
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__Aygp__Nv6gzFLTVHxJD5vNA.jpeg)

Apple has recently been pushing the envelope with regards to Artificial Intelligence, and WWDC 2020 was no different.

From machine and deep learning to computer vision and natural language processing, Apple’s introduced a slew of enhancements and improvements across their built-in frameworks that help mobile application developers build better AI-powered iOS apps.

[**Here's why Apple believes it's an AI leader-and why it says critics have it all wrong**  
_Machine learning (ML) and artificial intelligence (AI) now permeate nearly every feature on the iPhone, but Apple…_arstechnica.com](https://arstechnica.com/gadgets/2020/08/apple-explains-how-it-uses-machine-learning-across-ios-and-soon-macos/ "https://arstechnica.com/gadgets/2020/08/apple-explains-how-it-uses-machine-learning-across-ios-and-soon-macos/")[](https://arstechnica.com/gadgets/2020/08/apple-explains-how-it-uses-machine-learning-across-ios-and-soon-macos/)

PencilKit, a drawing framework that was introduced in iOS 13, was also powered with machine learning this year.

In the next few sections, we’ll discuss the latest offerings and what’s new in Apple’s AI technologies for iOS 14.

### Core ML

Core ML, Apple’s primary model framework, got a big boost with the inclusion of on-device model training last year. While the hopes for the introduction of on-device training for recurrent neural networks (RNNs) this year were dashed, there were still some pretty interesting announcements.

The Core ML model viewer in Xcode 12 has now been revamped with more information:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__I__c2IKYfCCoQnNadq8__QpA.gif)

As you can see, we have a new metadata tab that shows the layer distribution for the Core ML model. Most notably, the utility section consists of two new features — Model Encryption and Model Deployment.

#### Core ML Model Deployment

Until now, updating models in production apps has been a headache. Developers would have to either push new app updates or use on-device training, which is limited to a few neural network layer types only.

Luckily, Apple has introduced a new Deployment API that lets us update Core ML models on the fly, independent of app updates. To enable Model Deployment, we need to opt-in to Core ML model archiving (from the utility pane shown above) and [perform a few steps in Apple’s model deployment dashboard.](https://heartbeat.fritz.ai/evolving-your-apps-intelligence-with-core-ml-model-deployment-165579ba0546)

There’s also a new class `[MLModelCollection](https://developer.apple.com/documentation/coreml/mlmodelcollection?changes=latest_minor&language=objc)` that lets you access a group of models from Core ML Model Deployment. You can use this class for accessing a Core ML collection for a specific feature set in your app.

#### Core ML Model Encryption

Previously, `.mlmodelc` Core ML model files embedded in our apps weren’t encrypted, meaning sensitive IP could fairly easily be extracted and exploited. To help address this issue, Apple has introduced an optional model encryption feature that lets you secure the model. It works in pretty much the same way as you’d sign applications (using your particular Apple Team ID).

Now you can safely encrypt and bundle your model files, and Core ML will automatically decrypt and load them in your app’s memory.

The first time you load the model in-app, the decryption key is automatically fetched from the Apple server.

#### A new async load function for Core ML models

iOS 14 now brings a new asynchronous `load` function for initializing Core ML models. This is handy for loading models from `MLModelCollection` and for handling encrypted Core ML models.

MyStylizedModel.apply{  
    
  switch result {  
    
    case .success(let model):  
        currentModel = model  
          
    case .failure(let error):  
        handleFailure(for: error)

  }  
}

Do note that the old `init()` function for loading Core ML models will be deprecated in the future.

Besides security and deployment, a bunch of new layer types have been introduced as well. `coremltools` now provides out-of-the-box support for converting trained TensorFlow and PyTorch models to Core ML while taking advantage of the CPU, GPU, or Neural Engine.

### Create ML

Create ML is a model-building framework that lets us train custom machine learning models on macOS with “no-code” by providing drag-and-drop and visual design tools.

It became an independent macOS app last year, and provides a variety of model types for training Image, Object, Sound, Text Classifiers, and Recommender Systems.

Apple announced a number of improvements to Create ML at WWDC2020. Support for [video and image style transfer](https://www.fritz.ai/style-transfer/) model training was perhaps the biggest update this year. Coming from Apple, we can safely assume that it’s highly-optimized. Style transfer models would be extremely useful when used with ARKit to build immersive augmented reality experiences.

Also, we now have support for training activity classification models that’ll find use cases in tracking body movements.

Aside from new model training support, Create ML now offers more degrees of customization:

*   You can now pause and resume training.
*   Create ML allows you to set checkpoints that you can leverage to build intermediate snapshot models at various stages of training. Using these snapshots, you can compare model results from various stages of training.

### ML Compute: A New Machine Learning Framework

While Core ML is the most sought after machine learning framework by Apple today, it isn’t (and wasn’t) the only one available.

Interestingly, there’s a low-level primitive framework [Accelerate](https://developer.apple.com/documentation/accelerate), which is used to build neural networks to run on the CPU. At the same time, Apple also provides MPS (Metal Performance Shaders), designed to run on the GPU. Core ML is simply an abstraction built on top of these frameworks to run inference with an easier-to-use API.

Alongside the introduction of Core ML in iOS 11, a new MPS graph API (which is used underneath Core ML) was also released. The MPS graph API offered more precision during model training by letting us specify the exact layers and inputs.

Now, with iOS 14, we have another new machine learning framework: ML Compute. This one is specifically used for accelerating the training and validation of neural networks by using high-performance BNNs for the `Accelerate` framework on the CPU, and Metal Performance Shader for the GPU.

It’s important to note that the ML Compute framework’s API isn’t used for building Core ML models and is only introduced for boosting low-level machine learning frameworks.

### Natural Language Processing

The Natural Language and Vision frameworks are built on top of Core ML. The Natural Language framework helps, broadly speaking, in the semantic meaning and understanding of texts.

Last year, the framework received a host of new features, such as sentiment analysis, word tagging and embedding, language identification, tokenization, and entity recognition.

iOS 14 now introduces sentence embedding. Building accurate on-device FAQs and chatbots would get a whole lot easier with this new technology.

Analyzing sentences through word embeddings had its own limitations. Simply put, taking the average of vectors of every word could easily lead to loss of the compositional information of the sentence. Also, word embeddings work with only a finite vocabulary set and cannot accurately process semantic meaning when the word in a sentence isn’t present in the lookup table.

The new Sentence Embedding API helps overcome these shortcomings by letting you analyze an entire sentence. You can encode a complete sentence’s information into a finite-dimensional vector, which can then be compared with other sentences in the vector space to determine similarities and differences.

The Natural Language framework is also closely linked with the Create ML framework. This year, Apple has introduced transfer learning for word tagging models by using dynamic embedding. You can specify model parameters in the following way:

let modelParameters = MLWordTagger.ModelParameters(algorithm: .transferLearning(.dynamicEmbedding, revision: 1))

iOS 14 also provides a new `tagHypotheses` function that lets you find multiple possible tags for a given word or substring in the text. In doing so, you can now find the confidence threshold of each of the predicted tags.

### Computer Vision

Apple once again showed its computer vision ambitions during WWDC2020. The Core Image framework was greeted with the addition of a few more built-in filters. `CIColorThreshold` lets us quickly convert an image to black and white. The new `CIColorAbsoluteDifference` filter lets us compare color across two images.

[Apple’s Vision framework](https://heartbeat.fritz.ai/whats-new-in-the-vision-framework-in-ios-14-73d22a942ba5), on the other hand, stole the show from the other AI-based frameworks this year. It received about half a dozen new updates, including support for:

*   Hand and Body Pose Estimation
*   [Contour Detection](https://heartbeat.fritz.ai/new-in-ios-14-vision-contour-detection-68fd5849816e)
*   Optical Flow
*   Trajectory Detection
*   Offline Video Processing

There’s also a new stateful vision request, which takes into account the previous `VNObservation` results and is useful in trajectory detection and optical flow requests.

For a detailed look at what’s new in Vision framework with iOS 14, check out the article below:

[**What’s New in the Vision Framework in iOS 14**  
_Optical flow, pose estimation, and contour detection requests-and a bunch of new utilities to power up your computer…_heartbeat.comet.ml](https://heartbeat.comet.ml/whats-new-in-the-vision-framework-in-ios-14-73d22a942ba5 "https://heartbeat.comet.ml/whats-new-in-the-vision-framework-in-ios-14-73d22a942ba5")[](https://heartbeat.comet.ml/whats-new-in-the-vision-framework-in-ios-14-73d22a942ba5)

### PencilKit

PencilKit made its debut in iOS 13 and was perceived as a mere drawing framework.

This year, Apple has introduced Scribble for iPadOS — a new built-in, machine learning-powered text field. It automatically detects text written using Apple Pencil and can transcribe it as a string on the fly.

To enable or disable transcription of handwritten text, we can toggle the `UIScribbleInteraction.isHandlingWriting` boolean property.

With iOS 14, the PencilKit framework does a lot more than just set up the canvas for drawing and painting.

It now provides us with access to the stroke properties of the `PKDrawing` object. This means we can inspect the current point, path, and speed of a user’s drawing.

In doing so, we can analyze attributes such as force and the time it takes the PencilKit framework to perform gesture recognition and pattern matching from the user’s touch input.

Signature verification, anomaly detection, and shape auto-correction are a few things that you can do in iOS 14 to build AI-powered drawing applications. Additionally, the PencilKit framework can be used in conjunction with ARKit to move objects around in an augmented reality scene.

It’s worth noting that the `allowsFingerDrawing` property has been deprecated in favor of `PKCanvasViewDrawingPolicy` — which is an enum of types `anyInput` and `pencilInput`.

### Conclusion

We explored the enhancements introduced across the different AI-based frameworks this year. Strangely, there weren’t any updates in Apple’s speech analysis frameworks this year.

Training models with Create ML requires macOS Big Sur and above, but you can play around with the other frameworks in Xcode 12 itself on macOS Catalina.

That’s it for this one. Thanks for reading!

_Editor’s Note:_ [_Heartbeat_](https://heartbeat.comet.ml/) _is a contributor-driven online publication and community dedicated to providing premier educational resources for data science, machine learning, and deep learning practitioners. We’re committed to supporting and inspiring developers and engineers from all walks of life._

_Editorially independent, Heartbeat is sponsored and published by_ [_Comet_](http://comet.ml/?utm_campaign=heartbeat-statement&utm_source=blog&utm_medium=medium)_, an MLOps platform that enables data scientists & ML teams to track, compare, explain, & optimize their experiments. We pay our contributors, and we don’t sell ads._

_If you’d like to contribute, head on over to our_ [_call for contributors_](https://heartbeat.fritz.ai/call-for-contributors-october-2018-update-fee7f5b80f3e)_. You can also sign up to receive our weekly newsletters (_[_Deep Learning Weekly_](https://www.deeplearningweekly.com/) _and the_ [_Comet Newsletter_](https://info.comet.ml/newsletter-signup/)_), join us on_ [](https://join.slack.com/t/fritz-ai-community/shared_invite/enQtNTY5NDM2MTQwMTgwLWU4ZDEwNTAxYWE2YjIxZDllMTcxMWE4MGFhNDk5Y2QwNTcxYzEyNWZmZWEwMzE4NTFkOWY2NTM0OGQwYjM5Y2U)[_Slack_](https://join.slack.com/t/cometml/shared_invite/zt-49v4zxxz-qHcTeyrMEzqZc5lQb9hgvw)_, and follow Comet on_ [_Twitter_](https://twitter.com/Cometml) _and_ [_LinkedIn_](https://www.linkedin.com/company/comet-ml/) _for resources, events, and much more that will help you build better ML models, faster._