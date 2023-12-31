---
title: 'Exploring Core Image: Apple’s First Computer Vision Framework'
description: >-
  A journey from being the preferred computer vision framework to an image
  filtering tool
date: '2020-04-29T13:47:15.745Z'
categories: []
keywords: []
slug: >-
  /@anupamchugh/exploring-core-image-apples-first-computer-vision-framework-160f4a589413
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__kb4xMY5du__9pffoo.jpg)

Over the years, Apple has released some breakthrough features at its annual WWDC conference. In addition to the iOS community, developers all over the world keenly look forward to Apple’s annual conferences. It’s no wonder that figuring out which WWDC conference stood out from the rest is always a dilemma.

Some say WWDC 2019 was the best developer conference in years, due to the slew of new features and significant tools introduced. SwiftUI, a powerful new framework for building user interfaces, and major upgrades in the Core ML and Vision framework make it tricky to downplay Apple’s achievements in 2019 — and I won’t do that either.

So, without drawing comparisons between the past WWDC conferences, I’ll take you three years back (WWDC 2017), when Apple released two powerful frameworks, thereby giving a significant boost to AI-powered applications.

For the uninitiated, Core ML is Apple’s machine learning framework, which lets you integrate pre-trained and custom models into your app and run inference with just a few lines of code.

On the other hand, Vision is a powerful, easy-to-use framework built on top of Core ML that provides solutions to various computer vision tasks — face and landmark detection, text recognition, barcode recognition, image similarity, and saliency.

But a lot of these solutions—specifically face, rectangle, barcode detection and saliency—were already available in the pre-Vision era. Apple had actually first released its Face Detection API with the Core Image framework.

[Core Image](https://developer.apple.com/documentation/coreimage), in Apple’s own words, is _an image processing and analysis technology that provides high-performance processing for still and video images_. Given the significant enhancements that were added to Core Image over the years, it suffices to say that the framework was a frontrunner for the future of on-device vision tasks, with Apple investing a lot in it to push the envelope in the field of computer vision.

So what caused this shift from Core Image being the preferred framework, to the sudden emergence and eventual dominance of the Vision framework?

> **Two words: Deep Learning.**

The advent of deep learning has not just led to significantly better state-of-the-art accuracy for tasks like face detection and image recognition, but it’s also made solving other computer vision problems a lot easier.

For instance, face detection in Core Image is based on OpenCV’s [Viola-Jones Algorithm](https://en.wikipedia.org/wiki/Viola%E2%80%93Jones_object_detection_framework). The algorithm does a Haar-like feature selection, which is similar to kernels in a CNN— a small matrix used to apply transformations and effects.

Unlike a CNN, where kernel values are easily determined by training, Haar features require manual calculations (a lot of math), thereby posing scalability and customization issues.

For example, performing facial recognition (or any custom image classification task for that matter) in Core Image would require identifying Haar for specific faces, which would easily run into accuracy issues if the face was partially covered or the orientation (head tilt) changed.

On the other hand, training a dataset of images and integrating the model via the Vision API makes recognition a lot more accurate and efficient.

Hence, despite the higher execution speed (due to less computation) and relatively smaller datasets, the applications of Core Image in the field of computer vision are limited. The emergence of powerful edge devices only led to the shift towards the Vision framework, which alleviates the problem of choosing and extracting features manually.

The Core Image framework is now predominantly used for applying transformations and visual effects (filters) to images and videos.

Let’s dig into the Core Image API and see how it lets us create and apply these filters.

### Key Classes Of The Core Image Framework

#### CIDetector

The `CIDetector` class is used for processing images to detect faces, rectangles, barcodes, and text. For example, detecting faces is done using the following:

let faceDetector = CIDetector(ofType: CIDetectorTypeFace, context: nil, options: \[CIDetectorAccuracy: CIDetectorAccuracyHigh\])

let faces = faceDetector?.features(in: **CIImage**(image: inputImage)!) as! \[CIFaceFeature\]

for face in faces{  
print(faces.hasSmile)  
print(faces.leftEyeClosed)  
print(faces.hasMouthPosition)  
}

Using the face detector, we can determine smile probability, head pose, perform blink detection, and more. Moreover, we can filter the `CIDetector` to return only faces with certain attributes, as shown below:

let faceDetector = CIDetector(ofType: CIDetectorTypeFace, **context**: nil, options: \[CIDetectorSmile: true\])

Let’s look at `CIImage` next.

#### CIImage

`CIImage` is Core Image’s own data type, which contains all an image’s information. Contrary to what it sounds like, a `CIImage` is not a substitute for an image. It’s more like a “recipe” capable of producing an image.

`CIImages` can be created from a `UIImage`, from an image file, or pixel data. Creating a `CIImage` from a `UIImage` is really straightforward, as shown in the code snippet below:

let inputImage = CIImage(image: uiImage)

A `CIImage` is a lightweight object, in the sense that applying any filters to it doesn’t render any image. It just adds the filter to the recipe of instructions for how the final image will be generated.

#### **CIContext**

`CIContext` is a processing environment where image rendering and analysis actually take place. It’s a drawing destination where the filters are compiled in order to generate the output image.

Instantiating a `CIContext` is an expensive operation—as such, reusing instances is a good idea — especially since they’re immutable and thread-safe.

A `CIContext` takes the `CIImage` with the applied filters and creates the output image. Here’s a simple way to create a `CIContext`:

let ciContext = CIContext(options: nil)

We pass the `CIContextOptions` dictionary with properties like `allowLowPower`,`outputColorSpace` (it accepts the default RGB color space by default, but you can change it to Quartz2D or any other color space), `highQualityDownsample` , and [more](https://developer.apple.com/documentation/coreimage/cicontextoption).

```
let cgimg = context.createCGImage(filter.image, from: filter.image.extent)
```

From the `CIContext`, `CGImage` (another image data type) is created by passing in the image and its `extent` — which means the complete image.

#### CIFilter

`CIFilter` is a mutable object that’s responsible for creating the final `CIImage` based on the input image and the range of `attributes` specified.

`CIFilters` cannot be shared safely among threads, unlike a `CIContext`. We can create our own custom filters using the `CIKernel`, or chain multiple `CIFilters` together to build a composite filter.

Additionally, the `CIFilter` class provides methods for querying built-in filters by categories and returning a list of `inputKeys` and `outputKeys` available for the given filter.

The following code snippet shows how to query the built-in filters of Core Image:

//All filters  
CIFilter.filterNames(inCategories: nil)

CIFilter.filterNames(inCategory: kCICategoryBlur)

//The blur category consists of filters like gaussian, zoom blur etc.

Here’s an example of how to create a saliency filter for an image (highlighting areas of interest):

guard let inputImage = UIImage(named: image\_name\_here)   
else { return }

let beginImage = CIImage(image: inputImage)  
let context = CIContext()  
let currentFilter = CIFilter.saliencyMap()

currentFilter.inputImage = beginImage  
          
guard let outputImage = currentFilter.outputImage   
else {return }

if let cgimg = context.createCGImage(outputImage, from: outputImage.extent) {

let uiImage = UIImage(cgImage: cgimg)

}

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__t87lG6wRsjSjF9QWlkx77w.png)

#### CIKernel

At the heart of every Core Image filter is a kernel function that’s managed by the `CIKernel` class. The kernel function tells the filter how to transform each pixel of the input image.

Essentially, there are three different types of kernels: color kernels, warp kernels, and blend kernels. A custom color kernel requires either creating an instance of `CIColorKernel` and passing the kernel code, or leveraging the [Metal Shader library](https://developer.apple.com/documentation/metal/mtllibrary).

#### Creating A Custom Filter

Let’s look at a custom filter that transforms the gray color into black and white depending upon the shades (darker shades would be transformed to white and vice-versa):

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__HN2seXeuzQncgIDvUiQjcg.png)

### Conclusion

We saw how, despite representing a robust and near-real-time processing framework, Core Image eventually paved the way for Apple’s deep learning-powered Vision framework, due to the level of customization it supports. Nevertheless, Core Image is still an important framework for photo and video-based filtering apps.

iOS 13 not only introduced a bunch of new filters in Core Image, but also made their use more type-safe. We’ll explore a range of Core Image filters and see how using the Metal Shader language makes it easier to create and compose our own custom filters in the next piece.

That’s it for this one. Thanks for reading.