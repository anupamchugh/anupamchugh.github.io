---
title: 'SwiftUI Alerts, Pickers, and Gradients'
description: Nine examples to get things done fast
date: '2019-10-27T10:10:28.905Z'
categories: []
keywords: []
slug: /@anupamchugh/swiftui-alerts-pickers-and-gradients-29b9ee5ff8f3
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__2PYOFL__RfFEmKcfTxItyXg.png)

[SwiftUI](https://developer.apple.com/xcode/swiftui/) has been the talk of the town since it was launched during Apple’s WWDC 2019. This declarative user interface builder toolkit is here to stay and should give stiff competition to Interface Builders and Storyboards in the long run.

Being a Swift-only framework isn’t the only advantage it’s got. Its declarative syntax, which allows defining all states at once, is a big boon for developers.

Moreover, you don’t have to worry about maintainability across teams (Storyboards, are you reading this?) or the readability when the codebase increases.

With its easy to use drag-and-drop (or just in code) interface and live previews, building the UI is far easier and faster than ever before! Additionally, it supports interoperability with UIKit.

I could go on and on about its advantages, but let’s leave that for another time.

In the next sections, we’ll be implementing different kinds of alert controllers, picker views, and gradients in our SwiftUI iOS application.

For starters, you need Mac Catalina, Xcode 11, and iOS 13 or above as deployment target to integrate SwiftUI in your application.

### Getting Started

Launch a new Xcode single-view application. Select SwiftUI as the user interface type from the wizard. Here’s what you see once you’re done with the setup.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__GcHXa__ZIv6mjHth3KE8__6Q.png)

Two structures are created by default. A `ContentView` is for laying out the content and layout of the View. The `Preview` is for displaying it in a view.

Before we dive right into SwiftUI, let us look at one important property wrapper.

#### What is State?

Properties inside a struct can be marked with the keyword `State`**.** Doing so allows us to modify those properties and subsequently update our views. Any change to the state property triggers an update on the view.

### SwiftUI Alerts

Alerts in SwiftUI largely fall under the following three types:

*   Alert dialogs
*   Action sheets
*   Popovers

#### Alert dialogs

I’m sure you’ve made endless alert controllers in UIKit. SwiftUI alerts have a much easier way to create alerts and define actions in a declarative way as shown below:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__PlgNhD58SXBH7dWzZqPdBw.gif)

`showingAlert` is a bindable property that shows the alert on the basis of the button tap.

#### Action sheets

Action sheets are no longer a style in SwiftUI. They have a separate syntax similar to alert controllers. Here are an example and an illustration of it:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__1cMhXg1A9iikBwAmIu3NxA.gif)

#### Popovers

Popovers are basically tooltips. Not much different from modal sheets on iPhones. It requires an `arrowEdge` property for displaying the arrow in a particular direction.

Here’s some sample code for it with different previews defined.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1____XF1ScW__1FHfk3U86i77Ow.png)

Let’s sail onto pickers next!

### SwiftUI Pickers

Pickers are UI components used for selecting an option. Pickers in SwiftUI can be styled in different ways, such as:

*   Navigation view style.
*   Wheel picker.
*   Segmented picker.
*   Date picker style.

In the next sections, we’ll be discussing a few of these picker styles.

#### Navigation view style

Here’s an example of the navigation view-picker style which is embedded in a form.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__1OA8LAfLjISrgHzGgou5QQ.gif)

#### Segmented picker style

The following code shows an example of a `SegmentedPickerStyle`.

Switching between `Segmented` and `WheelPicker` styles is easier than ever.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__tarZK__6pHIEmH__I7vrD7NA.png)

Let’s now sail towards our last stop! Gradients.

### SwiftUI Gradients

Adding gradients in SwiftUI is very easy. Currently, SwiftUI supports three kinds of gradients:

*   Linear gradient — Color is applied along the axis.
*   Radial gradient — Color is applied based on distance from an edge. It can be from the center, top, bottom, etc.
*   Angular gradient — Also known as conic gradients, color is applied as the angle changes.

#### Radial gradients

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__YMFqkfZmNEnTnod2V8i7Ig.png)

#### Linear and angular gradients

`LinearGradients` require setting the start point and endpoint as shown below.

LinearGradient(gradient: colors, startPoint: .leading, endPoint: .bottomTrailing)

`AngularGradients` require passing the point of origin. It can be center, top, bottom, leading, or any random point. Optionally, we can also pass the `angles` at which we want the gradient to be drawn.

AngularGradient(gradient: colors, center: .center, angle: .degrees(200))

### Conclusion

Our ship’s journey started with alerts. Addressing the different styles, followed by a detour to pickers, and finally ended with gradients in SwiftUI. SwiftUI is here to stay and will be quickly adopted in the next few years.

That’s it for this one. I hope you enjoyed it.