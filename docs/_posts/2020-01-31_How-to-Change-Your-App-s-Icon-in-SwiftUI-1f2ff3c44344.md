---
title: How to Change Your App’s Icon in SwiftUI
description: Let your users set an alternate icon programmatically
date: '2020-01-31T01:04:07.288Z'
categories: []
keywords: []
slug: /@anupamchugh/how-to-change-your-apps-icon-in-swiftui-1f2ff3c44344
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__UHqqq8Ulm7qDoBnYXr6W6w.jpeg)

The ability to change your app’s icon programmatically has been around for quite a few years. Specifically, this feature was released in iOS 10.3, and it allows developers to switch between a predefined set of alternate icons.

Dynamic icons are useful when your application is based on subscriptions. Tinder is one application that uses this feature beautifully as it gives Tinder Gold members an option to switch the icon.

#### Our goals

*   In this piece, we’ll be showing you how to change your app icons programmatically using SwiftUI
*   We’ll leverage SwiftUI `Picker`s to allow the user to choose their favorite icon from a menu list.
*   Finally, we’ll address a serious pitfall. `Picker`s and `NavigationView` don’t get along the way we want them to currently — and we’ll see why.

### Setting Alternate App Icons Programmatically

The code for setting alternate icons isn’t that big. It’s hardly a line. It’s the setup that takes a little bit of time.

#### Get the alternate app icon

The below line of code returns an optional string that represents the current app icon’s key name. If the default app icon is being used, it returns `nil`:

```
UIApplication.shared.alternateIconName
```

#### Set alternate icon

To set an alternate icon, just pass the name of the icon in the below function. Handling the completion handler to check for errors is a good practice.

UIApplication.shared.setAlternateIconName(**iconName**, completionHandler: {error in})

But where do we set the icon name? We’ll come back to this in a bit.

The following are the rules you need to follow when using alternate icons in your application:

#### 1\. Don’t add alternate icons in the assets catalogue

It’s crucial you create a separate group that holds all your alternate icons (including the 2x and 3x files).

#### 2\. Handle the Info.plist file carefully

The `Info.plist` file is where you need to set up your dictionary for alternate icons (and primary icons, too). Since the dictionary is nested, I find editing the `Info.plist` in the raw XML format much easier than those buttons.

The following snippet shows the dictionary structure for the `CFBundleIcons` key. Add this at the top level of the XML dictionary that you see.

It might look a bit scary at first, but it's pretty straightforward. `CFBundleIcons` holds two dictionaries:

*   `CFBundlePrimaryIcon` for the primary icon that resides in your asset catalogue
*   `CFBundleAlternateIcons` is used to hold the alternate icons. The keys inside the `CFBundleAlternateIcons` represents the name you’ll use in the code. The name goes in place of the `iconName` we saw earlier.
*   Inside `CFBundleIconFiles`, we pass the icon file names — without extensions and without the 2x and 3x variants. Just the names.
*   `UIPrerenderedIcon` is a boolean key that indicates the gloss effect. Set this to `false` to let the system add the shine effect on your icon.

### Project Structure

Now that we’re all set, let’s look at the project structure. We’ve added three types of icons in an `Icons` group folder in our app’s target.

### Decoding the Alternate-Icons Dictionary

The idea is to get the key names of all the alternate icons and to set them in an array. The following function does just that by decoding the `Info.plist`.

`iconNames` is the array of strings that are defined in the `ObservableObject` class below with the `getAlternateIconNames` function called in the `init` method:

class IconNames: ObservableObject {  
    var iconNames: \[String?\] = \[nil\]  
    @Published var currentIndex = 0  
      
    init() {  
        **getAlternateIconNames()**  
          
        if let currentIcon = UIApplication.shared.alternateIconName{  
            self.currentIndex = iconNames.firstIndex(of: currentIcon) ?? 0  
        }

}

*   In the above code, the first element of the `iconNames` array is set as `nil` as an indicator of the primary app icon.
*   The active icon’s index is set as a `@Published` property wrapper. It’s initialized with the currently active icon.

We’ll share the above data model with our SwiftUI `ContentView`s through`@EnvironmentObject`, which is passed to the view hierarchy from the `SceneDelegate`.

window.rootViewController = UIHostingController(rootView: contentView.environmentObject(**IconNames**()))

### Setting Up Our SwiftUI Picker in Our ContentView

In the following code, we’re populating our SwiftUI `Picker` with the icon names from the `EnvironmentObject` property-wrapper instance:

*   Whenever the `Picker`’s selection is changed, the `onReceive` modifier gets triggered. It publishes the latest value it got, (index of the selected icon).
*   Inside the closure, we’re comparing the icon name of the new selection with the currently active app icon’s name. This is a crucial step since it triggers an icon change only when the user chooses a different one.

Here’s a look at our application in action:

As we can see above, when the alternate icon is changed successfully, the system sends an alert. Hence, it’s important to call the `setAlternateIconName` from the main thread once the view is set.

Now, let’s look at how to set the alternate icons in the SwiftUI view and also address an issue when `Picker`s and the `NavigationView` operate together.

### SwiftUI Picker and NavigationView Pitfall

While the above SwiftUI application does a fine job in managing the state, there are a few pitfalls when using NavigationView with Pickers. Not handling those cases carefully can haunt you later.

#### Pitfall 1

The following screengrab adds the alternate icons into a SwiftUI image under Pickers, and they get masked due to the `NavigationView`:

Now we have can address the overlay issue by setting a button style on the NavigationView, as shown in [this piece](https://medium.com/better-programming/swiftui-navigation-links-and-the-common-pitfalls-faced-505cbfd8029b). But then, we lose our SwiftUI `Picker` selection indicator:

#### **Remedy**

**Set** `**renderingMode**` **as original on the** `**Image**` By setting the `renderingMode` to original, the overlay is hidden, the picker selection is visible and we don’t need to set a `buttonStyle` for the NavigationView.

So we finally got our application working with alternate icons displayed in a SwiftUI Picker.

#### **Pitfall 2**

Also, there’s another case where SwiftUI `Picker`s and the `NavigationView` don’t work as intended currently. Setting the `NavigationView`’s style to `automatic` or large would cause the `Picker` to reposition once during the navigation thereby showing a jitter in the UI.

#### Remedy

Currently, the only workaround for this is by setting the NavigationView’s `displayMode` as inline. For more details, refer to [this Stack Overflow post](https://stackoverflow.com/questions/58773687/why-is-swiftui-picker-in-form-repositioning-after-navigation).

### Conclusion

We saw how to set your application’s icon programmatically using a SwiftUI `Picker` menu.

Also, we addressed two common pitfalls when using `NavigationView` with `Pickers` in SwiftUI. The issues caused overlay colors inside its child views and looked at ways to work around it.

The full source code of this piece is available in this [Github repository](https://github.com/anupamchugh/iowncode/tree/master/SwiftUIAlternateIcons).

That’s it for this one — thanks for reading.