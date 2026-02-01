---
title: How to Modify States During View Updates in SwiftUI
description: Let’s leverage the power of the Combine framework to work around this issue
date: '2020-06-15T14:47:59.588Z'
categories: []
keywords: []
slug: /@anupamchugh/how-to-modify-states-during-view-updates-in-swiftui-923bf7cea44f
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__NTi5gorXl8eUIKxV.jpg)

Introduced at WWDC 2019, SwiftUI has changed the way we build user interfaces for our applications. Things that would take significant time and boilerplate code when done using UIKit and Auto Layouts can be done very quickly with SwiftUI.

Updating SwiftUI views is really easy thanks to its state-driven framework. Hooking up a `ProgressBar` and `WKWebView` in SwiftUI seems like a cakewalk.

But what happens when you need to modify the `ProgressBar` state from `WKWebView` as the web page loads? That’s the goal of this article.

### Our Goal

*   Build a SwiftUI iOS application that consists of a `WKWebView` and `ProgressBar`. We’ll update the `ProgressBar` as the web page loads in SwiftUI.
*   Understand how modifying the state during view updates will cause undefined behavior and discrepancies in the SwiftUI view.
*   Using the power of the Combine framework with the `@Published` property wrapper and `ObservableObject` to fix this issue in our application.

### Build a SwiftUI ProgressBar

SwiftUI doesn’t provide an out-of-the-box implementation for `ProgressBars` at the moment. Thankfully, we can leverage the SwiftUI `Rectangle` shape and a `GeometryReader` to create our own `ProgressBar`, as shown below:

Here’s a sneak peek from the SwiftUI Previews with `ProgressBar` in action. We’ve used a SwiftUI slider to update the `progress` value:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__Lrl0Wrgb1LwEW97r__6NZBA.gif)

Now, this was quick and easy. Our next goal is to create a SwiftUI WebView and integrate it with the `ProgressBar`.

### Create SwiftUI WebView by Using UIViewRepresentable Protocol

Like with `ProgressBars`, SwiftUI doesn’t provide a built-in implementation for displaying `WKWebViews`. Luckily, we can use the `UIViewRepresentable` protocol and leverage the UIKit-SwiftUI interoperability to build a wrapper structure for `WKWebView`.

The `makeUIView` function is triggered when an instance of the struct above is created. Subsequently, we’ll need to use `updateUIView` to update the view.

You’ll notice a `@Binding` property defined in the structure above — `progress`. It’s used to update the `ProgressBar` state from the `WKWebView` page load progress that we’ll monitor.

The `Coordinator` class is used to handle the UIKit delegates and pass the data back to the SwiftUI view. We’re passing the `Binding progress` property above in this:

The `observe` method requires the `estimatedProgress` property of the `WKWebView`, and we’ve used the Swift 5.2 Keypath syntax on it.

The `.new` argument ensures that any new progress in page load triggers the observer.

The logic is pretty straightforward. We’re setting the `estimateProgress` value to the `Binding` property, which updates the SwiftUI `ProgressBar`. But the line below is a glaring issue:

self.progress = webView.estimatedProgress

SwiftUI gives us the following message at runtime:

Warning: Modifying state during view update, this will cause undefined behavior.

Predictably, when you run the SwiftUI application above, you end up with a `ProgressBar` that keeps updating, as shown below:

As you can see, the `ProgressBar` keeps showing random values and the `WKWebView` keeps reloading. We were modifying the `State` property while the view was loading, which caused the views to be re-rendered. Apple might fix this undefined behavior in the upcoming release, but until then, we need to fix the problem.

### Fix Undefined Behavior Using @Published Property

The problem with the code above was we were trying to change a view’s state from another state while the view was updating, which was causing the whole body to reload.

Instead of using SwiftUI’s state-driven data flow, we can use the `@Published` property wrapper to update the views reactively. SwiftUI now provides built-in support for Combine’s `Published` property wrapper.

Let’s create a class that conforms to the `ObservableObject` protocol in order to publish announcements to SwiftUI:

The `progress` property would be used to reactively update the `ProgressBar` and the `link` would set the string URL in the `WKWebView` `loadRequest`.

The properties of the `WebViewModel` instance we declared earlier can now be changed from the `Coordinator` class to update the SwiftUI view accordingly. As you can see, we’re using a `Publisher` to update the view reactively instead of using `States` and `Binding`, which cause problems when modifying during view updates.

The code for the SwiftUI view that holds the `SwiftUIWebView` above and the `SwiftUIProgressBar` appears below:

In the code above, the `ObservedObject` publishes a double value whenever the `progress` property changes. But the `ProgressBar` requires a `Binding` property. So in order to convert a `Double` to `Binding<Double>` value, we use `constant` bindings.

The application now works like a charm:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__7__QPqCCh31QANTY7YMBBbQ.gif)

### Closing Thoughts

SwiftUI is a state-driven framework that lets us easily create declarative user interfaces. But sometimes when you need to modify states during view updates, using the power of the Combine framework is a better idea, as it prevents rendering and reload issues.

You can find the full source code in this [GitHub repository](https://github.com/anupamchugh/iowncode/tree/master/SwiftUIWebViewsProgressBars).

That’s it for this one. Thanks for reading.