---
title: 'Advancements in Apple’s Vision Framework: 2019 Year-in-Review'
description: >-
  Exploring the new goodies that pushed the Vision framework forward by leaps
  and bounds
date: '2019-12-31T14:59:15.262Z'
categories: []
keywords: []
slug: >-
  /@anupamchugh/advancements-in-apples-vision-framework-2019-year-in-review-4c9d3ad5b138
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__5Y6sYDIcFRxDWBU1__JjtMw.jpeg)

In 2019 Apple introduced some really exciting features and improvements to its Vision framework. Through these changes, Apple showed us that alongside on-device machine learning, computer vision is an equally important part of their arsenal for mobile developers looking to build smart and intelligent applications.

For readers new to the Vision framework, it aims to provide a high-level API for complex computer vision algorithms, as well as act as a catalyst for [Core ML](https://heartbeat.comet.ml/whats-new-in-core-ml-3-d108d352e50a) models.

> _In Apple’s own words:_

> The Vision framework performs face and face landmark detection, text detection, [barcode recognition](https://heartbeat.comet.ml/building-a-barcode-scanner-in-swift-on-ios-9ad550e8f78b), image registration, and general feature tracking. Vision also allows the use of custom Core ML models for tasks like image classification or object detection.

Let’s take a closer look at the enhancements introduced in the Vision framework over the past year. I got a chance to implement some of the new goodies that were introduced at WWDC 2019, so you’ll find relevant links to them attached in each section as you walk through this piece.

### Vision’s Own Document Camera

A small new framework named `VisionKit` was introduced with iOS 13, which allows us to use the system’s document camera. By using the new `VNDocumentCameraViewController`, we can scan documents just like the “Notes” and “Files” apps do. And we can get the results back in our view controller classes using the callbacks received from the `[VNDocumentCameraViewControllerDelegate](https://developer.apple.com/documentation/visionkit/vndocumentcameraviewcontrollerdelegate)` protocol methods.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__ouIIh1XR9sN4RrMc2qr7Hw.png)

### Vision’s New Text Recognition Request

In iOS 12, Vision allowed us to detect rectangles containing text. The actual text characters within those rectangles couldn’t be identified in the Vision request. To identify the actual texts, we had to fall back to custom Core ML models, as done in this [implementation](https://medium.com/flawless-app-stories/ios-vision-and-highlighting-text-with-core-ml-aaca104e9427):

[**iOS Vision And Highlighting Text With Core ML**  
medium.com](https://medium.com/flawless-app-stories/ios-vision-and-highlighting-text-with-core-ml-aaca104e9427 "https://medium.com/flawless-app-stories/ios-vision-and-highlighting-text-with-core-ml-aaca104e9427")[](https://medium.com/flawless-app-stories/ios-vision-and-highlighting-text-with-core-ml-aaca104e9427)

Conveniently, with iOS 13 Apple gifted Vision with the new `VNRecognizeTextRequest`, a subclass of `[VNImageBasedRequest](https://developer.apple.com/documentation/vision/vnimagebasedrequest)` that lets us identify text from images. The request returns an array of `VNRecognizedTextObservation`s from which we can identify the top candidate and the string it contains. The following code snippet represents a gist of how the new text recognition request in vision works:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__9AUut9i3__I5XuISOR7paBA.png)

Additionally, with this new request we can set the accuracy level of optical character recognition (OCR) and pass our own list of custom words—quirky words or brand names that usually aren’t part of dictionaries.

```
request.customWords = ["KFC", "McDonalds", "Fritz"]
```

request.recognitionLevel = .fast //or use .accurate

Here’s a working example that uses the Document Scanner and the Text Recognition Request together to identify text from scanned images:

[**iOS Vision Text Document Scanner**  
_Running through the new feature in iOS 13_medium.com](https://medium.com/better-programming/ios-vision-text-document-scanner-effc0b7f4635 "https://medium.com/better-programming/ios-vision-text-document-scanner-effc0b7f4635")[](https://medium.com/better-programming/ios-vision-text-document-scanner-effc0b7f4635)

### Vision’s Face Technology Bolstered

The Face Detectors saw a number of improvements as well. Let’s breeze through them:

*   The number of landmark points detected on the face has increased from 65 to 76.
*   Instead of a single confidence score for the face, each point gets it’s own confidence/estimation score as well.
*   The pupil detection is much improved.
*   A new animal detector that classifies cats and dogs.
*   A new face capture quality vision request that’ll soon be found in all selfie based apps.

Amongst the newer releases in Vision’s face technology, we have an implementation for two of them that stood out.

#### Built-in Animal Detector

Additionally, Vision received a new Animal Classifier that classifies all kinds of cats and dogs with pretty good accuracy. `VNRecognizeAnimalsRequest` is the new Vision request that lets us to identify cats and dogs in images and videos, returning a bounding box for the identified region as well for object detection use cases.

Classifying and detecting animals using Vision in iOS 13 can be done very quickly, as the following implementation showcases:

[**iOS Build Cat Vs Dog Image Classifier Using Vision In 5 minutes**  
_This article implements Animal Classifier using Vision Request in iOS 13_medium.com](https://medium.com/swlh/ios-vision-cat-vs-dog-image-classifier-in-5-minutes-f9fd6f264762 "https://medium.com/swlh/ios-vision-cat-vs-dog-image-classifier-in-5-minutes-f9fd6f264762")[](https://medium.com/swlh/ios-vision-cat-vs-dog-image-classifier-in-5-minutes-f9fd6f264762)

#### Face Capture Quality Request

For me, the new Face Capture Quality Vision request is near the top of the list among the year’s improvements.

Based on quite a few metrics, such as exposure, pose, blurriness, facial expression, and mood depicted, the `VNDetectFaceCaptureQualityRequest` returns a `VNFaceObservation` instance that holds the `faceCaptureQuality` value. Using this we can create quite a few interesting use cases, such as picking the best portrait photo from a bunch of images.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__RXmYNbvpJknNfTus0ca8Bg.png)

Here’s an implementation of the Face Capture Quality Request that determines the best frame from a Live Photo in iOS:

[**Computer Vision in iOS: Determine the Best Facial Expression in Live Photos**  
_Implementation of Vision Framework’s new face capture quality request_heartbeat.comet.ml](https://heartbeat.comet.ml/computer-vision-in-ios-determine-the-best-facial-expression-in-live-photos-452a2eaf6512 "https://heartbeat.comet.ml/computer-vision-in-ios-determine-the-best-facial-expression-in-live-photos-452a2eaf6512")[](https://heartbeat.comet.ml/computer-vision-in-ios-determine-the-best-facial-expression-in-live-photos-452a2eaf6512)

### Vision Saliency

Vision’s new Saliency request is responsible for highlighting the prominent features in images and videos.

Two new vision requests were introduced: `VNGenerateAttentionBasedSaliencyImageRequest` for attention-based saliency — basically what grabs the human eye’s attention first.

Objectness-based saliency, on the other hand, looks for prominent objects in the frame.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__4M5i0seR__NEglin9BBeZ7A.png)

Saliency has a lot of interesting use cases: photo segmentation, anomaly detection, detecting blurred images (blurred images have less salient features in general), and even generating thumbnail images with automated cropping.

For an in-depth look at saliency and to learn how to crop areas of interests in an image, refer to the following piece:

[**Cropping Areas Of Interest Using Vision in iOS**  
_Extract salient features using the upgraded Vision framework_medium.com](https://medium.com/better-programming/cropping-areas-of-interest-using-vision-in-ios-e83b5e53440b "https://medium.com/better-programming/cropping-areas-of-interest-using-vision-in-ios-e83b5e53440b")[](https://medium.com/better-programming/cropping-areas-of-interest-using-vision-in-ios-e83b5e53440b)

### Vision Image Similarity

Image Similarity uses feature prints — basically vector representations to describe the images.

Feature prints don’t rely on the pixels of the image entirely, rather more emphasis is given to the overall context of the image to get a kind of semantic meaning of the image which the vector presents. Images with similar contexts have closer vector distances(nearest neighbors) and are similar.

Image Similarity can have plenty of use cases from grouping images to identifying duplicate images. The following piece takes an in-depth look with implementation at the new Vision Image Similarity request:

[**Compute Image Similarity Using Computer Vision in iOS**  
_Determine the Euclidean distance between images using their feature prints_heartbeat.comet.ml](https://heartbeat.comet.ml/compute-image-similarity-using-computer-vision-in-ios-75b4dcdd095f "https://heartbeat.comet.ml/compute-image-similarity-using-computer-vision-in-ios-75b4dcdd095f")[](https://heartbeat.comet.ml/compute-image-similarity-using-computer-vision-in-ios-75b4dcdd095f)

### A Built-In Image Classification Request

Creating a diverse image classification model requires a lot of images and hours of training time. Luckily, Apple now provides a built-in multi-label classification model that’s wrapped inside the `VNClassifyImageRequest`. The classification request consists of around 1000 classes. To know the taxonomy of the classifier, simply invoke the following function to get a list of all the classes.

try VNClassifyImageRequest.knownClassifications(forRevision: VNClassifyImageRequestRevision1)

Evaluation of multi-label classifiers is less straightforward, unlike binary classifiers that return a single label as the prediction. Using accuracy as the metric to evaluate a model doesn’t always represent how good or bad the model is. For multi-label classifiers, a false prediction of a target class is not a hard-lined right or wrong. Instead, more emphasis is given to a group of classes that are predicted for the image.

*   **Recall** — A metric is used to evaluate the overall relevancy of the model. When you aren’t too concerned with false predictions, you’d prefer a model with higher recall value.
*   **Precision** —A metric to measure the quality of the model. In cases where false positive isn’t catastrophic, a model with high precision is preferred.

The formulas for precision and recall are illustrated below:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__QXDKPE2w1sqRkc6jlvMLCA.png)

The terms TP and TN are straightforward but it can get tricky to get a hang of their counterparts(FP and FN). We hope the following list clears the terminologies once and for all.

*   TP and TN — A **true positive** occurs when a model predicts a class label for the image and the image has that in real. A **true negative** is just the opposite of a TP. It occurs when a class label is predicted as not a part of the image, and it in fact doesn’t exist in the image.
*   FP — A **false positive** occurs when a model predicts a class label for an image, but the image does not contain that class. For example, labeling an image as a bike when there isn’t one would fall under the FP category.
*   FN — A **false negative** occurs when the class label(s) predicted is not a part of the image and it doesn’t exist in the image as well. For example, predicting a message not as a SPAM when it isn’t in reality falls under the FN category.

The new `VNClassifyImageRequest`’s `VNClassificationObservation` possesses an API to filter the results by precision or recall, whichever suits your use cases.

The following code showcases a way to filter by setting a specific recall value on the precision-recall curve.

let recallFilter = classifications.filter{$0.hasMinimumPrecision(0.0, forRecall: 0.8)}

The equivalent formula for specifying a precision along the recall value is:

classifications.filter{$0.hasMinimumRecall(0.0, forPrecision: 0.8)}

In cases where the minimum recall (or precision, depending on which filter you use) that we specify is greater than zero, the precision value must fall in that valid region on the PR curve for the filter to work.

### What’s Next?

We walked through the improved APIs and changes introduced in Apple’s Vision framework during 2019 and highlighted some example implementations to help you start working with the framework.

From improved face detectors to new features like saliency and a built-in classification request, the Vision framework has (nearly) everything covered to allow mobile developers to easily use machine learning classifier models and other computer vision algorithms easily in their applications.

Moving forward into a new decade, we’d love for a lot more interesting features and improvements in the Vision framework such as:

*   Handling trajectory detection, a really popular computer vision use case.
*   Customizing and extending Vision’s current classifier models with our own data sets.
*   Extending face capture quality requests to a more generalized image quality Vision request.
*   Movement tracking. Matching and comparing the movements of two people would be really interesting.
*   Enhanced object detection that detects movements and determines the distance of the objects from the camera could be really useful, especially in the automotive industry (pedestrian detection).

Hoping for some of these wishes to come true in 2020. Please do post your wishlists in the comment sections below. That’s a wrap for this one. I hope you enjoyed reading.

_Editor’s Note:_ [_Heartbeat_](https://heartbeat.comet.ml/) _is a contributor-driven online publication and community dedicated to providing premier educational resources for data science, machine learning, and deep learning practitioners. We’re committed to supporting and inspiring developers and engineers from all walks of life._

_Editorially independent, Heartbeat is sponsored and published by_ [_Comet_](http://comet.ml/?utm_campaign=heartbeat-statement&utm_source=blog&utm_medium=medium)_, an MLOps platform that enables data scientists & ML teams to track, compare, explain, & optimize their experiments. We pay our contributors, and we don’t sell ads._

_If you’d like to contribute, head on over to our_ [_call for contributors_](https://heartbeat.fritz.ai/call-for-contributors-october-2018-update-fee7f5b80f3e)_. You can also sign up to receive our weekly newsletters (_[_Deep Learning Weekly_](https://www.deeplearningweekly.com/) _and the_ [_Comet Newsletter_](https://info.comet.ml/newsletter-signup/)_), join us on_ [](https://join.slack.com/t/fritz-ai-community/shared_invite/enQtNTY5NDM2MTQwMTgwLWU4ZDEwNTAxYWE2YjIxZDllMTcxMWE4MGFhNDk5Y2QwNTcxYzEyNWZmZWEwMzE4NTFkOWY2NTM0OGQwYjM5Y2U)[_Slack_](https://join.slack.com/t/cometml/shared_invite/zt-49v4zxxz-qHcTeyrMEzqZc5lQb9hgvw)_, and follow Comet on_ [_Twitter_](https://twitter.com/Cometml) _and_ [_LinkedIn_](https://www.linkedin.com/company/comet-ml/) _for resources, events, and much more that will help you build better ML models, faster._