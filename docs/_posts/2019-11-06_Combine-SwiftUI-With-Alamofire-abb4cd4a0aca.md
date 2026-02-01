---
title: Combine SwiftUI With Alamofire
description: Networking with declarative and reactive frameworks
date: '2019-11-06T16:22:46.433Z'
categories: []
keywords: []
slug: /@anupamchugh/combine-swiftui-with-alamofire-abb4cd4a0aca
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__7SYBgrbNOfbD45I3NRxeKA.jpeg)

Alongside SwiftUI, Apple introduced Combine, its own reactive programming framework, during WWDC 2019. It’s come out at a time when the RxSwift framework has already matured. Though one thing that does stand out in Combine is the support for back pressure.

The goal of this article is to connect Alamofire with SwiftUI while taking leverage of the Combine framework.

Before we mix the three elements to build a perfect recipe, let’s take a quick look at the [Combine Framework](https://developer.apple.com/documentation/combine).

### What’s Combine?

Combine Framework brings functional, reactive, and declarative paradigms of programming into Apple’s ecosystem. At a high level, it consists of three core components:

*   **Publishers** — These emit the data (let’s say, Medium writers).
*   **Subscribers** — They listen to the data (let’s assume, Medium readers).
*   **Operators** — These work on the emitted data (let’s call these the Medium editors.)

#### ObservableObject and ObservedObject

`ObservableObject` protocol is a part of the Combine Framework. Classes that have properties that need to be observed by SwiftUI must conform to the `ObservableObject` protocol.

Properties need to be marked as `@Published` , basically, a property wrapper used to update views in SwiftUI based on value changes.

`ObservedObject` is used to bind `ObservableObject` instances to the View.

To sum up :

*   `ObservedObjects` are the `Publishers`.
*   SwiftUI Views are the `Subscribers`.

Now that we’ve got an idea of what the Combine Framework consists of, let’s bring Alamofire into the mix and build our cool iOS Application.

### Final Destination

We’ll be developing a SwiftUI-based application that displays a list of jokes using the famous [Chuck Norris API](http://www.icndb.com/api/). Here’s an illustration of what we plan to achieve:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__nwrW0CZtKgNNrrDk2REkjA.gif)

### Adding Alamofire Into Our Project

Launch a new Xcode, SwiftUI based project and add the [Alamofire](https://github.com/Alamofire/Alamofire) dependency. You can use Cocoapods, Swift Package Manager or Carthage, whichever works the best for you.

Once that’s done, simply import Alamofire into your Swift class.

### Privacy Permissions

Ensure that you’ve added the App Transport Security in the `info.plist` file, as shown below, since we’re dealing with an HTTP network request.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__TNt0__zNUezFf__b97K1Uriw.png)

### Setting Up Our Model Structure

Our model needs to implement the `Identifable` protocol for the list to identify each row as a unique one. In the following code, we simply store the string message and the id:

struct JokesData : Identifiable{

public var id: Int  
public var joke: String

}

### Setting Up Our Observer Class

As discussed earlier, we need to conform to the `ObservableObject` in our class and set the property as `Published` for notifying updates to SwiftUI Views. The following code does that and adds the API responses to the model structure.

### Building Our Content View

Finally, we set the published property from the `ObservedObject` onto the lists as shown in the below code:

struct ContentView: View {  
    @ObservedObject var observed = Observer()  
      
    var body: some View {  
        NavigationView{  
            List(observed.jokes){ i in  
                HStack{Text(i.joke)}  
                }.navigationBarItems(  
                  trailing: Button(action: addJoke, label: { Text("Add") }))  
            .navigationBarTitle("SwiftUI Alamofire")  
        }  
    }  
      
    func addJoke(){  
        observed.getJokes(count: 1)  
    }  
}

In the above code, we’ve also added a navigation bar button that updates the SwiftUI list for every new joke that’s received from the API response.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__QMNt2Nnutkf7D0FKbfW5gw.png)

### Conclusion

Thanks to SwiftUI Previews, we no longer have to depend on simulators for simulating API requests and responses. It all happens in the preview itself. The full source code is available in this [Github Repository](https://github.com/anupamchugh/iowncode/tree/master/SwiftUIAlamofire).

That wraps up this piece. I hope you enjoyed reading and had a few good laughs as well.