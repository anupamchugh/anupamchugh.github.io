---
title: iOS Vision Text Document Scanner
description: Running through the new feature in iOS 13
date: '2019-09-20T07:16:33.000Z'
categories: []
keywords: []
slug: /@anupamchugh/ios-vision-text-document-scanner-effc0b7f4635
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__5337r916cJYl2eebzNWfCA.jpeg)

Now that iOS 13 is here, the [Vision API](https://cloud.google.com/vision/) has vastly improved. Additionally, the [VisionKit](https://developer.apple.com/documentation/visionkit) framework has been introduced, allowing us to scan documents using the new document camera.

### Vision and VisionKit

Vision API came out with iOS 11. Up to now, it could only detect text and not return actual content, hence we had to bring in [Core ML](https://developer.apple.com/documentation/coreml) for the recognition part.

Now that the Vision API is upgraded with iOS 13, the `VNRecognizedTextObservation` returns the text, its confidence level, as well as the bounding box coordinates. Furthermore, VisionKit allows us to access the system’s document camera to scan pages.

`VNDocumentCameraViewController` is the view controller and `VNDocumentCameraViewControllerDelegate` is used to handle the delegate callbacks.

### Launching a Document Camera

The following code is used to present the document camera on the screen.

let scannerViewController = VNDocumentCameraViewController() scannerViewController.delegate = self.present(scannerViewController, animated: true)

Once the scan is done and you just click _Save_ and the following delegate method gets triggered:

```
func documentCameraViewController(_ controller: VNDocumentCameraViewController, didFinishWith scan: VNDocumentCameraScan)
```

To get a particular scanned image among the multiple images, pass the index of the page in the method:`scan.imageOfPage(at: index)`.

We can then process that image and detect the texts using the Vision API.

To process multiple images, we can loop through the scans in the delegate method like this:

for i in 0 ..< scan.pageCount   
{   
   let img = scan.imageOfPage(at: i)   
   processImage(img)   
}

### Creating VNTextRecognitionRequest

let request = VNRecognizeTextRequest(completionHandler: nil) request.recognitionLevel = .accurate request.recognitionLanguages = \["en\_US"\]

The `recognitionLevel` could also be set to `` fast` ``, but then we'd have to deal with less accuracy.

`recognitionLanguages` is an array of languages passed in a priority order from left to right. We can also pass custom words that are _not_ a part of the dictionary for Vision to recognize.

request.customWords = \["IOC", "COS"\]

In the following section, let’s create a simple [Xcode](https://developer.apple.com/xcode/) project in which we’ll recognize texts from the captured images using the Vision Request Handler. We’re setting our deployment target to iOS 13.

### Our Storyboard

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__Ijsm8oJZKmr8F0xm.png)

### Code

The code for `ViewController.swift` is given below:

import UIKit  
import Vision  
import VisionKit  
  
class ViewController: UIViewController, VNDocumentCameraViewControllerDelegate {  
  
    @IBOutlet weak var imageView: UIImageView!  
    @IBOutlet weak var textView: UITextView!  
      
    var textRecognitionRequest = VNRecognizeTextRequest(completionHandler: nil)  
    private let textRecognitionWorkQueue = DispatchQueue(label: "MyVisionScannerQueue", qos: .userInitiated, attributes: \[\], autoreleaseFrequency: .workItem)  
      
    override func viewDidLoad() {  
        super.viewDidLoad()  
        textView.isEditable = false  
        setupVision()  
    }  
  
    @IBAction func btnTakePicture(\_ sender: Any) {  
          
        let scannerViewController = VNDocumentCameraViewController()  
        scannerViewController.delegate = self  
        present(scannerViewController, animated: true)  
    }  
      
    private func setupVision() {  
        textRecognitionRequest = VNRecognizeTextRequest { (request, error) in  
            guard let observations = request.results as? \[VNRecognizedTextObservation\] else { return }  
              
            var detectedText = ""  
            for observation in observations {  
                guard let topCandidate = observation.topCandidates(1).first else { return }  
                print("text \\(topCandidate.string) has confidence \\(topCandidate.confidence)")  
      
                detectedText += topCandidate.string  
                detectedText += "\\n"  
                  
              
            }  
              
            DispatchQueue.main.async {  
                self.textView.text = detectedText  
                self.textView.flashScrollIndicators()  
  
            }  
        }  
  
        textRecognitionRequest.recognitionLevel = .accurate  
    }  
      
    private func processImage(\_ image: UIImage) {  
        imageView.image = image  
        recognizeTextInImage(image)  
    }  
      
    private func recognizeTextInImage(\_ image: UIImage) {  
        guard let cgImage = image.cgImage else { return }  
          
        textView.text = ""  
        textRecognitionWorkQueue.async {  
            let requestHandler = VNImageRequestHandler(cgImage: cgImage, options: \[:\])  
            do {  
                try requestHandler.perform(\[self.textRecognitionRequest\])  
            } catch {  
                print(error)  
            }  
        }  
    }  
      
    func documentCameraViewController(\_ controller: VNDocumentCameraViewController, didFinishWith scan: VNDocumentCameraScan) {  
        guard scan.pageCount >= 1 else {  
            controller.dismiss(animated: true)  
            return  
        }  
          
        let originalImage = scan.imageOfPage(at: 0)  
        let newImage = compressedImage(originalImage)  
        controller.dismiss(animated: true)  
          
        processImage(newImage)  
    }  
      
    func documentCameraViewController(\_ controller: VNDocumentCameraViewController, didFailWithError error: Error) {  
        print(error)  
        controller.dismiss(animated: true)  
    }  
      
    func documentCameraViewControllerDidCancel(\_ controller: VNDocumentCameraViewController) {  
        controller.dismiss(animated: true)  
    }  
  
    func compressedImage(\_ originalImage: UIImage) -> UIImage {  
        guard let imageData = originalImage.jpegData(compressionQuality: 1),  
            let reloadedImage = UIImage(data: imageData) else {  
                return originalImage  
        }  
        return reloadedImage  
    }  
}

We’re doing quite a number of things in the above code. Let’s list them down.

The `textRecognitionWorkQueue` is a `DispatchQueue` used to run the vision request handler outside the main thread.

In the `processImage` function, we pass the image to a request handler which performs the text recognition.

`VNRecognizedTextObservation` is returned for each of the request's `results`.  
From the `VNRecognizedTextObservation`, we can look up up to ten candidates. Typically, the top candidate gives us the most accurate result.

`topCandidate.string` returns the text and `topCandidate.confidenceLevel` returns us the confidence of the recognized text. To get the bounding box for the string in the image we can use this function:

topCandidate.boundingBox(for: topCandidate.string.startIndex..< topCandidate.string.endIndex)

This gives us `CGRect`, which we can draw over the image.

Vision uses a different coordinate space than UIKit, hence, when drawing the bounding boxes, you need to flip the y-axis.

Let’s look at the output of the application in action.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__liZ9WlGjIf3XO3Tm.gif)

So, we just captured the cover of a bestselling novel and we were able to recognize to display the texts in a `TextView` on our screen. That sums up Vision text recognizer for iOS 13.

[**anupamchugh/iowncode**  
_You can't perform that action at this time. You signed in with another tab or window. You signed out in another tab or…_github.com](https://github.com/anupamchugh/iowncode/tree/master/iOS13VisionTextRecogniser "https://github.com/anupamchugh/iowncode/tree/master/iOS13VisionTextRecogniser")[](https://github.com/anupamchugh/iowncode/tree/master/iOS13VisionTextRecogniser)