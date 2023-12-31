---
title: From Swift Import Python
description: Build a macOS app to run Python scripts from your SwiftUI codebases
date: '2020-08-24T22:30:23.409Z'
categories: []
keywords: []
slug: /@anupamchugh/from-swift-import-python-f2fc2a997d4
---

Python for long has established itself as the undisputed leader of data science. But as the size of data continues to increase, Python’s shortcomings are getting noticed. Slow speed, limitations in parallelism, and lack of type safety all act as a roadblock in large scale applications.

Google is clearly putting its bets on Swift as the future of deep learning. No wonder, they’ve heavily invested in Swift for Tensorflow.

While Python boasts of a huge collection of libraries and shifting away from it won’t be a cakewalk, but still we can leverage its interoperability with Swift.

Yes, you can run python code from Swift by using the PythonKit, a framework based on the `Python` module from the [Swift for TensorFlow](https://github.com/tensorflow/swift) project.

It’s important to note that Python is not available on iOS. But you can build pretty awesome utility apps for macOS and Linux.

### Advantages of PythonKit

*   Your Swift codebase gets direct access to the rich set of Python modules and packages.
*   Python developers can easily build macOS apps to run automation scripts and perform numeric computations.
*   Instead of bundling large OpenCV and Tensorflow frameworks in Swift, you can simply install the Python counterparts on your system and use it across all macOS applications that involve PythonKit.

In the next few sections, we’ll see how to setup PythonKit in a SwiftUI macOS application and perform a few interesting tasks.

### Adding PythonKit in Your macOS Application

To get started create a new Xcode project with macOS as the target and add the following package dependency using Swift Package Manager:

.package(url: "https://github.com/pvieito/PythonKit.git", .branch("master")),

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__NFUMnB2B6rq7pcWGyceycg.png)

Now, you can `import PythonKit` in your Swift views and get started. To check the current python version and update it use the following lines:

print(Python.version)  
PythonLibrary.useVersion(2)  
//or   
PythonLibrary.useVersion(3, 8)

Note: `PythonLibrary.useVersion` needs to be put just below the import statement. You cannot change Python version number dynamically at run-time.

Next, ensure that you’ve removed App sandbox from the Signing and Capabilities section, as we’ll use Python programs from our mac directly:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__SeHM6td7yAIVs__cDPuMLSA.png)

### Run Your First Python Script In Swift

Let’s write a hello world Esque Python function in a `.py` file:

def hello():  
    return "Hello Swift, I'm Python"

Now, save this in a file and note down its path.

The following Swift method invokes the above Python function and gets the result back:

func runPythonCode(){  
  let sys \= Python.import("sys")  
  sys.path.append(dirPath)  
  let example \= Python.import("sample")  
  let response \= example.hello()  
}

Few things to observe from the above piece of Swift code:

*   The `dirPath` is the path to the file location. For me it is : `/Users/anupamchugh/Desktop/workspace/`.
*   `Python.import` is used to import a Python module. In our case, we’re importing the `sample.py` file which contained our hello world code.
*   `example` is a Swift instance of the type PythonObject. We’re invoking the `hello` function over it.
*   The response instance is also a `PythonObject` which is implicitly converted into a string in our case.

We can explicitly convert `PythonObject` into the native Swift types by wrapping them in the following ways:

let str \= String(pythonString)!  
let arr \= Array(pythonArray)!

### Swap Python Variables And Return To Swift

Let’s look at the classic case of interchanging the contents of two variables present in Swift in Python function:

def swap(a, b):  
    a, b = b, a  
    return a, b

Now, let’s call it from the Swift function to get back the results:

func swapNumbersInPython(){  
  let sys \= Python.import("sys")  
  sys.path.append(dirPath)  
  let example \= Python.import("sample")  
  let response \= example.swap(swapA, swapB)  
  let arr : \[Int\] \= Array(response)!  
  swapA \= arr\[0\]  
  swapB \= arr\[1\]  
}

`swapA` and `swapB` are SwiftUI state variables, which will eventually be updated on the screen.

Let’s run our macOS SwiftUI application with the above Python script:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__FZas8vgM3Vp0TOw2wyzg7A.gif)

With that, we managed to build our first macOS application with Swift and Python interoperability.

But this was trivial. Let’s write a fancier Python script.

### Download Videos Using Python Scripts And Show In SwiftUI VideoPlayer

Python has a popular package, named `youtube-dl` for downloading videos from YouTube and many other websites.

Let’s install it on our mac. The following pip command is for Python3:

pip3 install youtube-dl

Now, add the following function in your Python file:

import youtube\_dl  
  
videoName = "NA"  
  
def hello():  
    return "Hello Swift, this is Python"  
  
def swap(a, b):  
    a, b = b, a  
    return a, b  
  
def downloadVideo(link, path):  
    ydl\_opts = {  
    'format': 'best',  
    'writesubtitles' : 'writesubtitles',  
    'outtmpl': path + '/%(title)s.%(ext)s'  
    }  
  
    with youtube\_dl.YoutubeDL(ydl\_opts) as ydl:  
        info\_dict = ydl.extract\_info(link, download=False)  
        videoName = info\_dict.get('title', None) + '.' + info\_dict.get('ext', None)  
        ydl.download(\[link\])  
  
    return videoName

The `link` and `path` arguments are passed from Swift with the former being a video link and the latter being the directory path where the video would be saved.

`ydl.download()` downloads the video and we return the `videoName` back to the Swift code:

func downloadVideo(link: String){  
  let sys \= Python.import("sys")  
  sys.path.append(dirPath)  
  let example \= Python.import("sample")  
  let response \= example.downloadVideo(link, dirPath)  
  videoPath \= String(response)  
}

Now, SwiftUI in WWDC 2020 introduced built-in support for `VideoPlayer` on devices running macOS 11.0 and iOS 14. Still, for iOS 13, you can leverage the `UIViewRepresentable` protocol to create a custom video view.

By using the `videoPath`, we are able to display the downloaded video file in SwiftUI as shown below:

let url \= URL(fileURLWithPath:dirPath+videoPath)  
VideoPlayer(player: AVPlayer(url: url))

Let’s run the above mac application to see the output:

You can find the full source code of the SwiftUI application and Python script in the [GitHub Repository](https://github.com/anupamchugh/iowncode/tree/master/PythonKitBasics).

### Conclusion

We saw how Python-Swift interoperability makes it possible to run Python code from Swift. Besides video downloaders, you can also run automation tasks such as batch file renaming, disk space analyzer, and many more.

Python and Swift are two languages with clean and easy syntax. While the latter is getting groomed as the future of Deep Learning, the former would play a key role as the second fiddle in the years to come.

The launch of PyScript in PyCon 2022 has led to new ways of running Python from HTML. With Python and Swift already interoperable, the possibilities of using Python in mobile apps is limitless.