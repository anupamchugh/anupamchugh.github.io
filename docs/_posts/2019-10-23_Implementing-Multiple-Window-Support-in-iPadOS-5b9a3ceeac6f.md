---
title: Implementing Multiple Window Support in iPadOS
description: AppDelegate takes a back seat. SceneDelegate takes over.
date: '2019-10-23T13:26:45.004Z'
categories: []
keywords: []
slug: /@anupamchugh/implementing-multiple-window-support-in-ipados-5b9a3ceeac6f
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__6ziGpv89dW2jLWE9jiumOg.png)

iPadOS 13 was launched during WWDC 2019. Finally, the iPad has a separate OS.

Introduction of multiple window support in iPadOS is a game-changing move. It allows us to open multiple instances of an application at the same time.

This awesome feature is incredibly useful when it comes to viewing multiple messages, emails, or comparing notes, and map routes. It’ll make life easier for photo and video editors as well. I believe multiple window support will give rise to interesting multiplayer games really soon!

### Our Goal for Today

*   Knowing how multi-window support changes the application’s lifecycle.
*   A bird’s eye view of the `UIScene` API.
*   Implementing multiple window support in two different ways — _With user input_ and _using drag and drop_. We’ll be developing a photo editing based iOS and iPadOS Application which uses `CIFilters` on a spiderman image!

Without wasting any more time, let’s get started.

### Enabling Multi-Window Support

It’s easy, just jump into the project navigator, general settings, and ensure that the _support multiple window_ checkbox is enabled.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__hoFUVFmOYOeD1ud7.png)

Once this is done, the multiple window support boolean property is set in the `info.plist`. Before we dig deep into the API changes and implementation, let's address the elephant in the room.

#### **Multiple window support is not split-screen support**

Split-screen support was introduced in iOS 9 to allow viewing different apps in one window, whereas multiple window support allows viewing multiple instances of a single app at a time.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__lJ1dKoVjKQNkInbg.png)

### Changes in AppDelegate and App Lifecycle

Multi-window support has brought major changes to the `AppDelegate` class. It is much lighter now. All the heavy lifting is done by the `SceneDelegate` class. If you peek into the `AppDelegate` in any iOS 13 Xcode project, you’ll see that it has very few methods.

`UIApplicationDelegate` is not notified when the application goes and comes from the background in iOS 13 and above.

A newly introduced protocol, `UIWindowSceneDelegate`, handles the notifications across multiple windows of an application.

The following properties of the `UIApplication` class are now deprecated:

*   `statusBarStyle`
*   `statusBarHidden`
*   `statusBarOrientation`
*   `open(_:options:completionHandler:)`
*   `keyWindows`

Thanks to multi-window support, windows are now scenes! So starting iPadOS 13, everything you see in the app switcher is a separate scene.

### UIScene API: A Bird’s Eye View

Multiple window support uses `UIScene` API under the hood. The two most essential classes of this API are:

*   `UIWindowScene` — This is responsible for managing multiple windows of an application.
*   `UISceneSession` — This represents a persisted state of the scene. Multiple `UIScene`s store specific information there, such as role and user info with the scene session.

`NSUserActivity` is used to capture the state of a scene. This state is used to restore a previously used scene or create a new scene with the current viewing content.

`UIWindowSceneDelegate` is implemented by the `SceneDelegate` . This protocol is the new entry to the application as it holds the references to the `UIWindow` .

`UIWindow` now holds a reference to the `UIWindowScene`. If you’re using storyboards, the `UIWindow` property would automatically be attached to the scene.

**Not using storyboards?** You need to manually attach the `UIWindow` to the scene in the `SceneDelegate` class as shown below:

func scene(\_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {  
guard let windowScene = (scene as? UIWindowScene) else { return }        window = UIWindow(frame: windowScene.coordinateSpace.bounds)        window?.windowScene = windowScene  
}

If the above stuff didn’t make too much sense, the hands-on implementation in the next section will surely give more clarity. Let’s dig in!

Note: Never use multiple window support for extending functionality across scenes. Or by showing the output of one scene in another. Each scene should have the full functionality of the application.

### Implementation

We’ll be creating a photo editing based application that allows viewing images with different filters across different scenes. It's handy when you need to determine which filter looks best on the image!

#### Laying the UI

The following snippet adds a `UIImageView` to the screen programmatically:

let VCActivityType = "VCKey"  
func setupImageView(){

photo = UIImageView(frame: .zero)  
photo?.translatesAutoresizingMaskIntoConstraints = false  
view.addSubview(photo!)

NSLayoutConstraint.activate(\[  
photo!.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: marginConstant),  
photo!.bottomAnchor.constraint(equalTo: self.stackView!.topAnchor, constant: -marginConstant),  
photo!.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor, constant: marginConstant),  
photo!.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -marginConstant),  
\])  
}

### Creating a New Scene on User Click

To create a new scene of the application, add the following code on a button press:

let activity = NSUserActivity(activityType: VCActivityType) UIApplication.shared.requestSceneSessionActivation(nil, userActivity: activity, options: nil, errorHandler: nil)

`requestSceneSessionActivation` is responsible for activating an existing scene or creating a new scene.

Here’s a screengrab from the iPad Application.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__7fc0__NSBt1Qc5drGdip7dQ.gif)

This was straightforward. Now, let’s hop onto the drag and drop mechanism and see what needs to be done there.

### Creating a New Scene Using Drag and Drop

We can make use of the [Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) by passing the `NSUserActivity` inside the `DragItem`’s `NSItemProvider`.

When you drag a UI component, the system automatically provides drop points (typically at the edges of the screen). Dropping at those points leads to the creation of a new scene.

To create a new scene using drag and drop of the `UIImageView`, we must take care of three things:

#### 1\. Conformation to the `UIDragInteractionDelegate`

We need to set up the drag interaction on the `UIImageView`.

photo?.isUserInteractionEnabled = true photo?.addInteraction(UIDragInteraction(delegate: self))

#### 2\. Implementing the drag function

In the below snippet, we pass the `imageView` to the `NSItemProvider` and register the `NSUserActivity` with it.

extension ViewController : UIDragInteractionDelegate{  
    func dragInteraction(\_ interaction: UIDragInteraction, itemsForBeginning session: UIDragSession) -> \[UIDragItem\] {  
        if let imageView = interaction.view as? UIImageView {  
            guard let image = imageView.image else { return \[\] }  
            let provider = NSItemProvider(object: image)  
              
            let userActivity = NSUserActivity(activityType: VCActivityType)  
            provider.registerObject(userActivity, visibility: .all)  
            let item = UIDragItem(itemProvider: provider)  
            return \[item\]  
        }  
        return \[\]  
    }  
}

#### 3\. Adding the ActivityType in the `Info.plist`

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__h__zgbsYZEr__JunNv.png)

Our iPad application is now ready for multi-window support via dragging.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__FmIUffxepo5CdufNPJ3ZDw.gif)

We’ve set `CIFilters` on the images to compare the same image across different filters.

Multi-window support is compatible with [Mac Catalyst](https://developer.apple.com/mac-catalyst/) as well.

### Conclusion

So, that’s it! We saw how `AppDelegate` takes a back seat and lets `SceneDelegate` do the primary weight lifting by handling most of the lifecycle events.

Finally, we implemented multi-window support and saw our friendly neighborhood in different shades in different scenes.

The full source code of this article is available on [GitHub](https://github.com/anupamchugh/iowncode/tree/master/iPadOSMultiWindowExample).

In the next parts, we’ll deal with state restoration and syncing data across multiple windows in iPadOS.

That’s it for this one. I hope you enjoyed it.