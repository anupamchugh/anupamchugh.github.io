---
title: iOS Vision And Highlighting Text With Core ML
description: Find and highlight keywords from images
date: '2019-10-15T21:35:54.473Z'
categories: []
keywords: []
slug: /@anupamchugh/ios-vision-and-highlighting-text-with-core-ml-aaca104e9427
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__EWkB5qe2iaDmriso.jpg)

Vision and Core ML frameworks were the highlights of WWDC 2017. Vision is a powerful framework used to implement computer vision features without much prior knowledge of algorithms.

Things such as barcode, face, object, and text detection can be easily done using Vision.  
At the same time, Core ML allows us to integrate and run pre-trained models in our iOS Applications without digging too deep into Machine Learning.

### Our Goal

Our goal for today is to build an iOS Application that identifies texts in a still image.

Just like when you search for keywords using, `cmd + F` all the matching strings get highlighted on the screen, we’ll be highlighting a few selected strings in an image.

Before getting down to the business end, let’s for once breeze through the things we’ll gonna cover.

### Topics Covered

*   Capturing Image Using Camera or Gallery
*   Text Detection Using Vision
*   Text Recognition Using Core ML
*   Drawing Bounding Boxes on certain keywords

### What we want to achieve

We wish to highlight some of the detected texts after recognizing their names in an image captured from camera/gallery as shown below:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__1bTs3Rfp639__HOsC.png)

> We’ll call this application as **FindMyText**. Inspired from the name FindMyIphone!

Without wasting any more time, let’s get started. Launch up your Xcode and create a Single View Application.

### Image Picker Controller

We won’t be focusing on the Storyboard since it’s pretty basic (just a UIImage and a Button). The idea is to upload images containing texts from the photos library.

guard UIImagePickerController.isSourceTypeAvailable(.camera) else {  
            presentPhotoPicker(sourceType: .photoLibrary)  
            return  
        }  
        let photoSourcePicker = UIAlertController()  
        let takePhoto = UIAlertAction(title: "Camera", style: .default) { \[unowned self\] \_ in  
            self.presentPhotoPicker(sourceType: .camera)  
        }  
        let choosePhoto = UIAlertAction(title: "Photos Library", style: .default) { \[unowned self\] \_ in  
            self.presentPhotoPicker(sourceType: .photoLibrary)  
        }  
        photoSourcePicker.addAction(takePhoto)  
        photoSourcePicker.addAction(choosePhoto)  
        photoSourcePicker.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))  
          
        present(photoSourcePicker, animated: true)

`presentPhotoPicker` is used to launch the appropriate application. Once the image gets clicked we start the `Vision Request`.

extension ViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {  
      
    func imagePickerController(\_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: \[UIImagePickerController.InfoKey: Any\]) {  
        picker.dismiss(animated: true)  
          
        guard let uiImage = info\[UIImagePickerController.InfoKey.originalImage\] as? UIImage else {  
            fatalError("Error!")  
        }  
        imageView.image = uiImage  
        createVisionRequest(image: uiImage)  
    }  
      
    private func presentPhotoPicker(sourceType: UIImagePickerController.SourceType) {  
        let picker = UIImagePickerController()  
        picker.delegate = self  
        picker.sourceType = sourceType  
        present(picker, animated: true)  
    }  
}

It’s time for some insights into the Vision Framework!

### Vision Framework

Vision Framework had come up with iOS 11. It brings algorithms for image recognition and analysis which as per Apple, are more accurate that the CoreImage Framework. A significant contributor to this is the underlying use of Machine Learning, Deep Learning, and Computer Vision.

Implementing the framework consists of three important use cases:

*   `Request` - Create a request to detect the type of object. You can set more than one types to be detected.
*   `Request Handler` - This is used to process the results obtained from the request.
*   `Observation` - The results are stored in the form of observation.

Some important classes which are a part of the Vision framework are:

*   `VNRequest` - It consists of an array of requests which are used for image processing.
*   `VNObservation` - This gives us the output of the result.
*   `VNImageRequestHandler` - processes one or more `VNRequest` on a given image.

The following snippet shows how to create a **Vision Image Request Handler**.

func createVisionRequest(image: UIImage){  
          
        currentImage = image  
        guard let cgImage = image.cgImage else {  
            return  
        }  
        let requestHandler = VNImageRequestHandler(cgImage: cgImage, orientation: image.cgImageOrientation, options: \[:\])  
        let vnRequests = \[vnTextDetectionRequest\]  
          
        DispatchQueue.global(qos: .background).async {  
            do{  
                try requestHandler.perform(vnRequests)  
            }catch let error as NSError {  
                print("Error in performing Image request: \\(error)")  
            }  
        }  
          
}

We could have passed multiple requests, but the goal of this article is text detection and recognition.

The `vnTextDetectionRequest` is defined in the below code:

There’s plenty of stuff going in the above code snippet.  
Let’s break it down.

*   The observations are the results returned by the request.
*   Our goal is to highlight the detected texts with bounding boxes, hence we’ve typecasted the observations to  
    `VNTextObservation`.
*   We crop the detected text part of the image. These cropped images act as micro-inputs for our ML model.
*   We feed these images to the Core ML model for classification after resizing them to the required input size.

The codes for the cropping and preprocessing are available in the `ImageUtils.swift` file attached at the end of this project.

Let’s take a look at Core ML and how it is relevant at how it’s relevant to us at this stage.

### CORE ML Framework

Core ML is a framework that lets developers use ML Models easily in their applications.  
With the help of this framework, the input data can be processed to return the desired output.

In this project, we’re using an `alphanum_28X28` ml model.  
This model requires input images of size 28\*28 and returns the detected text.

Resizing the images happens in the preprocess function we just saw earlier.  
`observationStringLookup` is a lookup dictionary that binds each Observation to its text predicted by the Core ML model.

To determine the text, we have our own Image Classifier that runs on the resized image input:

`textMetadata` is used to store all the predicted words.  
Now that the `observationStringLookup` is created, we can highlight the selected observations(the words vision, core ml were highlighted in the final output as we saw at the start of this article).

#### Vision And Bounding Boxes

Now we know the texts detected by Vision in `VNTextObservations`. Each observation has a bounding box property.

The labels of each of those observations were predicted by the Core ML Image classifier from the previous section.

So we can simply draw the rectangles on the texts.

The below method does that implementation for us and highlights the words “Vision” and “Core ML” in the image.

> Note: Core ML model may not give correct results on texts with different fonts.

> With iOS 13, the newly upgraded Vision Framework now stores the recognized text in the Observation instance itself.

That’s a wrap for now. The full source code of this article is available below.

[**anupamchugh/iowncode**  
_You can’t perform that action at this time. You signed in with another tab or window. You signed out in another tab or…_github.com](https://github.com/anupamchugh/iowncode/tree/master/iOSFindMyText "https://github.com/anupamchugh/iowncode/tree/master/iOSFindMyText")[](https://github.com/anupamchugh/iowncode/tree/master/iOSFindMyText)

#### Resources

[**Text recognition using Vision and Core ML**  
_Introduction Machine Learning allows computers to learn and make decisions without being explicitly programmed how to…_martinmitrevski.com](https://martinmitrevski.com/2017/10/19/text-recognition-using-vision-and-coreml/ "https://martinmitrevski.com/2017/10/19/text-recognition-using-vision-and-coreml/")[](https://martinmitrevski.com/2017/10/19/text-recognition-using-vision-and-coreml/)