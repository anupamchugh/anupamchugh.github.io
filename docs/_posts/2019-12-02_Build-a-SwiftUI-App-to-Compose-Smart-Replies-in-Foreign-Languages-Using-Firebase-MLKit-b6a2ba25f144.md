---
title: >-
  Build a SwiftUI App to Compose Smart Replies in Foreign Languages Using
  Firebase MLKit
description: "Language identification, translation, and smart reply in iOS with Firebase ML\_Kit"
date: '2019-12-02T14:55:32.084Z'
categories: []
keywords: []
slug: >-
  /@anupamchugh/language-identification-translation-and-smart-reply-in-ios-with-firebase-ml-kit-b6a2ba25f144
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__kohyltaWMty7hS5V.jpg)

[Firebase ML Kit](https://firebase.google.com/products/ml-kit) is Google’s ambitious platform for bridging the gap between machine learning and mobile application development. It provides easy-to-use APIs to run powerful frameworks such as [Vision](https://developers.google.com/ml-kit/vision) and [Language](https://firebase.googleblog.com/2019/04/ml-kit-expands-into-nlp.html) on-device or using the cloud.

Additionally, with the introduction of on-device language translation and [Auto ML Vision Edge](https://firebase.google.com/docs/ml-kit/automl-image-labeling) this year(late 2019, time of writing), Google’s plans to boost machine learning-powered mobile application development so far seems to be on the right track. Firebase ML Kit framework boasts of cross-platform support which makes it easier to develop exciting machine learning-based applications that are consistent across Android and iOS devices.

ML Kit’s Language framework is our primary focus in this article. The recently introduced on-device translation API leverages Google’s ever-evolving Translation API by providing support across 58 languages, with models that can be downloaded and used locally on the device. With additional natural language processing capabilities such as language identification and smart replies, this MLKit’s framework as a whole is on the right path for AI-powered devices.

Meanwhile, Apple’s Natural Language framework has made vast improvements as well by incorporating sentiment analysis and providing tools for deploying text classification and word tagging models on Apple devices. These different capabilities currently offered by both tech giants are a big boon for Apple developers, as they can combine and mix the best of both worlds to come up with exciting AI applications.

With Firebase ML Kit still in beta, its natural language capabilities such as smart replies support the English language only for now.

The goal of this article is to mix and match on-device translation and identification with smart replies and explore how smart replies work across other languages.

### Plan of Action

We’ll be exploring the natural language processing capabilities of ML Kit in a SwiftUI-based iOS application. Here’s the blueprint for what’s in store for the rest of this article:

*   Setting up Firebase in your iOS project
*   Working through identification, smart reply, and translation on the input text
*   Merging the three to see how smart replies work with different languages.
*   Discussing the future scope of the Language framework.

### Setting Up Firebase In Your iOS Project

The [Firebase documentation](https://firebase.google.com/docs/ios/setup) has a pretty nice walkthrough for integrating Firebase in iOS applications. The following is a checklist of essentials you need when setting up Firebase in your app:

*   Create a new Firebase project and register your app’s bundle ID.
*   Download the **GoogleService-Info.plist** file and put it in your Xcode project.
*   Add the relevant Firebase dependencies using Cocoapods or Swift Package Manager.
*   Initialize Firebase in your `AppDelegate` using `Firebase.configure()`.

### Language Identification

The language identification feature is capable of determining the language of input text from around 110 currently-supported languages. All it requires is a few words to identify and it returns the language codes along with their confidence threshold levels. It returns `und` if it cannot determine the language.

In order to add language identification into your application, add the following dependencies in your project:

pod 'Firebase/MLNaturalLanguage'  
pod 'Firebase/MLNLLanguageID'

Next, just import the dependency in your class and call the identification API over the input text, as shown below:

By default, all possible languages with a threshold above 0.01 are returned. We can customize the minimum threshold value, as shown below:

```
let options = LanguageIdentificationOptions(confidenceThreshold: 0.4)let languageId = NaturalLanguage.naturalLanguage().languageIdentification(options: options)
```

The following illustration depicts language identification results across a few languages:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__qP4Wl6RL8ZGw3CYoY5C1Mg.png)

The language identification feature is smart enough to detect the language from the context of the text, as well—as is evident in the above illustration. For foreign languages typed in English, the language codes typically are different from the native foreign language code (it gets appended with `Latn`).

### Smart Reply

Smart replies are quickly gaining popularity in messaging applications. Apps like Gmail and LinkedIn are already supporting this capability now. The API determines possible replies to a conversation based on the latest ten messages (though it works with a single message also).

In order to integrate ML Kit’s Smart Reply, add the following ML Kit libraries in your project:

pod 'Firebase/MLCommon'  
pod 'Firebase/MLNLSmartReply'

The following code demonstrates a Smart Reply example on an input text:

The Smart Reply API requires a `TextMessage` array with the conversations sorted such that the latest is at the end of the array. Each `TextMessage` consists of a `isLocalUser` boolean argument. The local user is for whom the Smart Reply API would suggest replies.

In the above case, since the conversation consists of a single text message only, we’ve set `isLocalUser` to `false` .

The API returns back three suggested replies. If the context of the text was offensive or the language wasn’t supported, currently Smart Reply doesn’t return anything.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__J__w3__zyqF5ceYF__ZsAUWxQ.png)

Currently, the Smart Reply API is in early stages and needs a bit of fine-tuning to determine what’s offensive and what’s not, as you can see above in the third illustration.

### On-Device Translation

Offline language translation is the latest addition to the ML Kit. With support across 58 languages, it’s pretty accurate in some cases. Let’s test its accuracy on some different cases as well. Add the following dependencies in your project:

pod 'Firebase/MLNLTranslate'

The following code showcases the use of the Translation API:

The `Translator` instance is used to define the source and target language. We can set conditions on which the language model is downloaded onto the device. Finally, the `translator.translate(text)` is the line that does the translation and returns the results in the completion handler.

Language models are downloaded to be used on-device in offline mode. Typically models are around 30 MB each, so be careful when handling multilingual translations.

The following code is used to delete a downloaded model:

```
let deModel = TranslateRemoteModel.translateRemoteModel(language: .fr)ModelManager.modelManager().deleteDownloadedModel(deModel) { error in    guard error == nil else { return }    // Model deleted.}
```

Here’s an illustration of the translation outcome when done across a few different languages (Chinese, Hindi, and French).

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1____2a2fXjOCTJTCvpwO7YgdA.png)

ML Kit’s on-device translation is more or less the same as the Google Translator API. It’s proven in the above cases that when the language isn’t determined, it returns the source text as the result.

Now that we’ve discussed the three natural language capabilities separately, it’s time to mix them. In the next section, we’ll explore Smart Reply on languages other than English and see how ML Kit fares.

### Smart Reply in Non-English Languages

As aforementioned, Smart Reply currently works only in English. By knowing the language from the text using the Identification API, however, we can translate it to English, follow that by generating a Smart Reply, and finally translating it back to the original language.

Using this four-step process, we can compose smart replies in foreign languages. Let’s get started with the implementation.

#### Setting up the UI

Add the following code in your SwiftUI `ContentView.swift` structure:

    @State var inputText: String = ""  
    @State var languageIdentified: String = ""  
    @State var smartReplyInOriginalLanguage: String = ""

var body: some View {  
          
        VStack(alignment: .center, spacing: 20){  
            TextField("Enter some text", text: $inputText)  
                .font(.system(size: 20))  
                .multilineTextAlignment(.center)  
            Text(smartReplyInOriginalLanguage)

Button(action: identifyLanguage, label: {  
                Text("Smart Reply").foregroundColor(.blue)  
            })  
        }  
    }

#### Identify Language

The following code is used to identify the language from the input text:

#### Identifying Language Code for Translation

Next, we’ll see how to determine the language from the language code. In the following code, we’ll iterate over the set of languages supported and retrieve the code of our identified language for translation:

#### Translation and Smart Reply Generator

Now that we’ve got our code, we’ll pass it to the `Translator` instance in order to convert it to English and subsequently generate the smart reply.

In the above code, the result returned by the completion handler of the `generateEnSmartReply` function is fed into a translator again—this time, to get back the final results (smart reply) in the original language:

Here’s a look at our final results in two foreign languages, along with their actual versions in English.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__djtT704Puo9Ozp5cJrtFXw.png)

As we can see from the actual Google Translator results blended in the image above, the results of the ML Kit Smart Reply API are pretty accurate for foreign languages.

### Conclusion

In this tutorial, we saw the three primary features of ML Kit’s Language Framework in an iOS application. The Language Identification capability works perfectly. However, there are some chinks in the armor of Smart Reply.

In the last section, we created our own custom Smart Reply system that works across all languages that support translation and got a pretty decent result. You can download the full source code from [this GitHub Repository](https://github.com/anupamchugh/iowncode/tree/master/iOSMLKitNLP). Please make sure that you add your own `GoogleService-Info.plist` file from Firebase.

Firebase ML Kit is still in beta but looks promising already. Along with Apple’s Natural Language framework, it can be used to build exciting applications such as text classification bolstered by translation—and much more.

That’s it for this one. I hope you enjoyed reading.