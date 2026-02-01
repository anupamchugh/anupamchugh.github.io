---
title: SwiftUI Bar Charts
date: '2019-11-04T06:00:20.825Z'
categories: []
keywords: []
slug: /swiftui-bar-charts
---

![Header Image](/assets/screenshots/swiftui-bar-charts-final-output.png)

SwiftUI is the talk of the town. The declarative UI pattern is here to stay and building cool and awesome UIs is easier than ever before. Previously, we implemented [SwiftUI with Alerts, Pickers, and Gradients (Medium)](https://medium.com/better-programming/swiftui-alerts-pickers-and-gradients-29b9ee5ff8f3). Now, it’s time for some custom views!

The goal of this article is to build bar charts with SwiftUI. For this, we’ll be using SwiftUI shapes and gradients. Also, we’ll be binding the different bar chart shapes to a segmented picker view.

### Sneak Peek

Before we deep dive into the SwiftUI implementation, here’s a sneak peek at what we’ll be building:

![Demo](/assets/screenshots/swiftui-bar-charts-demo.gif)

### Implementation

For starters, you need to create a new Xcode project in SwiftUI. Add the following piece of code in your `ContentView`:

{% gist 7b68851d44682ae8629418706eb6b70a %}

In the above code, we’ve built a `ZStack` to add views on top of each other. Inside that, we’ve set a vertical stack for the `Text`, `Picker`, and a `Horizontal Stack`.

The two states, `pickerSelection` and `barValues`, are correlated. Based on the `pickerSelection` value, the respective bar chart values and shapes are tweaked slightly (notice how the `cornerRadius` of the bar chart changes).

The bar chart uses a horizontal stack to display each of the single bar views as we shall see next.

To change the segmented picker control styles in SwiftUI, we need to do the necessary `UIKit` additions in the init method.

### Building Bar Views

To build our custom bar views, we need to use SwiftUI’s `Shape API`. It supports a variety of shapes, such as `Circle`, `Capsule`, `Rounded Rectangle`, etc.

The code for building the bar views is given below:

```
struct BarView: View{

    var value: CGFloat
    var cornerRadius: CGFloat
    
    var body: some View {
        VStack {

            ZStack (alignment: .bottom) {
                RoundedRectangle(cornerRadius: cornerRadius)
                    .frame(width: 30, height: 200).foregroundColor(.black)
                RoundedRectangle(cornerRadius: cornerRadius)
                    .frame(width: 30, height: value).foregroundColor(.green)
                
            }.padding(.bottom, 8)
        }
        
    }
}
```

Here, we’ve used two `RoundedRectangles` aligned to the bottom (you can use the shape`Capsule` as well). One acts as the container and has a fixed height and the other has a dynamic height based on the value it holds.

### Fill Custom Views With Gradients

We can further beautify our bar charts by adding gradients as the fill color. The following code adds a `LinearGradient` to the `BarView`:

```
RoundedRectangle(cornerRadius: cornerRadius)
.fill(LinearGradient(gradient: Gradient(colors: [.purple, .red, .blue]), startPoint: .top, endPoint: .bottom))
.frame(width: 30, height: value)
```

In return, we get a new look for the bar charts in our SwiftUI preview, as shown below:

![](/assets/screenshots/swiftui-bar-chart-custom-view-gradient.gif)

The full source code of _Bar Charts Using SwiftUI_ is available in this [GitHub Repository](https://github.com/anupamchugh/iowncode/tree/master/SwiftUIBarCharts).