---
title: Sound Classification on iOS Using Core ML 3 and Create ML
description: >-
  Recognize gender by voice in a live audio stream using the SoundAnalysis
  framework with your own Core ML model built using Create ML
date: '2019-11-12T16:06:01.951Z'
categories: []
keywords: []
slug: /@anupamchugh/sound-classification-using-core-ml-3-and-create-ml-fc73ca20aff5
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__oPLA12jzwZEcDahh.jpg)

During WWDC 2019, Create ML [got its own independent identity](https://developer.apple.com/videos/play/wwdc2019/430/). It’s like an origin story of some sort, giving way to a whole new range of capabilities. Create ML is now a separate application that’s shipped with Xcode 11.

Apple once again, through Create ML, showcases how serious they are about machine learning on mobile. Their recent advancements with the Create ML framework are a big boon for mobile machine learning developers, given that these improvements allow them to easily create their own models without much machine learning expertise.

Currently, Create ML provides support for the following type of models:

*   Image Classifiers
*   Object Detection
*   **Sound Classification**
*   Text Classification and Word Taggers
*   Activity Classifiers — Used for predicting physical actions like walking, jumping, swinging, etc. from motion sensor inputs.
*   Recommendation Systems

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__rJjMM745X0UIZXlAvYc6Pw.png)

Create ML, with it’s easy to use visual interface, makes it possible for non-data scientists to quickly build their own machine learning models as well.

#### Plan of action

*   Collecting a labeled dataset of audio files
*   Training a Create ML model
*   Sound classification using the Core ML 3 model by using the `SoundAnalysis` and `AVKit` frameworks

> To build a sound classification model using Create ML, you need Mac Catalina and Xcode 11. For deploying the generated Core ML 3 Model, you need iOS 13 or above operating system.

### Gathering our dataset

For male-female voice classification, we’ve extracted some audio (`.wav`) files from the [VoxCelebs](http://www.robots.ox.ac.uk/~vgg/data/voxceleb/) dataset and mixed it with a few recordings from [Wav Source](http://wavsource.com/).

The sound classifier model operates at 16 kHz audio. So it’s encouraged to use data sets in the same range to ensure optimal performance of your model.

It’s a good idea to pass single-channel audio files for training since the `MLSoundClassifier` model structure of Create ML uses the first channel only and discards the rest.

For demonstration purposes, we’ll be using a small dataset without putting too much emphasis on accuracy in this article.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__NfNi4qKK__KjInrvpHOopwg.png)

### Building our model with Create ML

Next, we’ll create a new Create ML sound classifier project and add the training folder in the input. You can choose to add validation data or set it to automatic.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__xRqdDqjz5JoNSLq3Vkalug.png)

Create ML automatically identifies the classes and audio files from the training folder. For classifiers, you need at least two classes.

Now just press the **_Train_** button and let Create ML do the feature extraction, preprocessing, training, and validation. Once it’s done, you can drag-and-drop or select the testing data folder to evaluate the model. The test dataset should be something that the model hasn’t seen before.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__LHq1aY__38e5y6rdHNfZdxw.gif)

From collecting the dataset to building the Core ML 3 model, it took me about 30 minutes, so the above accuracy is fine for that duration.

Our model is now ready to deploy. Create ML allows you to run predictions using your Mac’s built-in microphones.

In the next section, we’ll be deploying the above Core ML 3 model in an iOS application that recognizes the male-female voice from a live audio stream.

### Deploying our Core ML 3 model in an iOS Application

Now it’s time to perform voice-based audio classification using the previously-built Core ML 3 model in our iOS/macOS application in Xcode 11.

#### Approach

*   Capture live audio streams using AudioEngine
*   Observe audio buffer results using the SoundAnalysis framework
*   Run `[SNClassifySoundRequest](https://developer.apple.com/documentation/soundanalysis/snclassifysoundrequest)` to classify the observed audio streams

#### Getting Started

To start, let’s drag-and-drop the Core ML 3 model in a new Xcode 11 project:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__Tg5ivpH0TZsdzH0AajA1Vw.png)

#### Privacy usage descriptions

We need to add the privacy usage description for the microphone in the `info.plist` file in order to listen to the audio stream. The following illustration showcases how that’s done:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__EmvTcQH9etJbp__a__HfLuHQ.png)

#### Initializations

We need to import the SoundAnalysis And AVKit frameworks and initialize the model and certain properties, as shown below:

import AVKit  
import SoundAnalysis

private let audioEngine = AVAudioEngine()  
private var soundClassifier = GenderSoundClassification()  
var inputFormat: AVAudioFormat!  
var analyzer: SNAudioStreamAnalyzer!  
var resultsObserver = ResultsObserver()  
let analysisQueue = DispatchQueue(label: "com.apple.AnalysisQueue")

If some of the initializations in the above code don’t make sense, don’t fret—we’ll be discussing each of them in the following sections.

#### Start audio capture

We need to use the `AudioEngine` framework, which is a part of `AVFoundation`, to start capturing audio streams from the microphone.

By accessing the `inputNode` from the `audioEngine`, we can install an audio tap on the bus to observe the audio stream outputs from the node.

private func startAudioEngine() {

//create stream analyzer request with the Sound Classifier

do{  
try audioEngine.start()  
}  
catch( \_){  
print("error in starting the Audio Engine")  
}

}

In the above code, we’ll be adding the sound classification request and sound analyzers on the input node bus.

#### Create a sound stream analyzer

Next, we need to create an audio stream analyzer using the SoundAnalysis framework. It captures the audio engine’s streams in the native format, as shown below:

inputFormat = audioEngine.inputNode.inputFormat(forBus: 0)  
`analyzer = SNAudioStreamAnalyzer(format: inputFormat)`

#### Create a sound classifier request

Now, we need to create a sound classifier request by passing the Core ML `model` instance in the `SNClassifySoundRequest` .

Add the following code at the start of your `startAudioEngine` function:

do {  
let request = try SNClassifySoundRequest(mlModel: soundClassifier.model)  
try analyzer.add(request, withObserver: resultsObserver)  
} catch {  
print("Unable to prepare request: \\(error.localizedDescription)")  
return  
}  
}

In the above code, we’ve added the sound classification request instance to the `SNAudioStreamAnalyzer`. The classifier ultimately returns the results to the observer object `resultsObserver`.

This class’s instance implements the `SNResultsObserving` protocol method, which gets triggered for every sound classification result, as shown below:

`GenderClassifierDelegate` is a custom protocol that’s used to display the final predictions in a UILabel:

protocol GenderClassifierDelegate {  
    func displayPredictionResult(identifier: String, confidence: Double)  
}

extension ViewController: GenderClassifierDelegate {  
    func displayPredictionResult(identifier: String, confidence: Double) {  
        DispatchQueue.main.async {  
            self.transcribedText.text = ("Recognition: \\(identifier)\\nConfidence \\(confidence)")  
        }  
    }  
}

#### Analyzing audio streams

Finally, we can start analyzing the audio streams by setting up a separate serial dispatch queue that analyzes the audio buffer from the `inputNode`, as shown in the code below:

#### Run audio engine and make predictions

Finally, we can run our audio capture method and analyze and classify the audio buffer streams to either of the gender class labels.

Just add the following code snippets in your `viewDidLoad` and `viewDidAppear` methods:

override func viewDidLoad() {  
        super.viewDidLoad()  
          
        resultsObserver.delegate = self  
        inputFormat = audioEngine.inputNode.inputFormat(forBus: 0)  
        analyzer = SNAudioStreamAnalyzer(format: inputFormat)  
        buildUI()  
}  
override func viewDidAppear(\_ animated: Bool) {  
        startAudioEngine()  
}

In order to test this application, I’ve used two videos, a WWDC one(for the male voice) along with a video from youtube(to recognize female voice). Here’s the result we’ve got:

Based on the small dataset of 100 odd files in our model the above result is quite accurate. Our sound classification model by default returns “male” for miscellaneous sounds. You can try adding more sound class labels for different categories(environments, bots, birds) and build your own dataset.

The full source code of the Xcode project along with the dataset which contains a few `wav` files are available in this [GitHub Repository](https://github.com/anupamchugh/iowncode/tree/master/CoreML3SoundClassifier).

### Conclusion

By using the new `MLSoundClassifier` model and the `SoundAnalysis` framework, we quickly were able to classify voice from a live audio stream, even with a small dataset.

Create ML allows mobile machine learning developers to quickly train and test their own models without digging too deeply into machine learning.

That wraps up this piece. I hope you enjoyed reading.