---
title: Exploring MapKit on iOS 13
description: 'Optimized overlays, points of interest, and much more, alongside SwiftUI'
date: '2019-11-12T00:26:09.186Z'
categories: []
keywords: []
slug: /@anupamchugh/exploring-mapkit-on-ios-13-1a7a1439e3b6
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__I0idAmCrZlJyMvdRMuA1Hg.jpeg)

Maps have been a constant in Apple’s every WWDC event. Through continuous enhancements and upgrades, Apple strives to convert its weakest link over the years into a strong suit.

During WWDC 2019, Apple showcased how it has revamped Apple Maps, for the better. Though most of the new Apple Map updates will roll out by the end of 2019, [MapKit](https://developer.apple.com/documentation/mapkit) already has a lot in store for us.

Here are some of the improvements MapKit brought out this year:

*   Points of interest.
*   Optimized polylines and polygons rendering.
*   Improved search and auto-complete.
*   Controlling camera boundary and zoom.

In the next few sections, we’ll be discussing each of these enhancements at length. We’ll be implementing MapKit examples using [SwiftUI](https://developer.apple.com/xcode/swiftui/) over the course of this article.

### Filtering Points of Interest

The upgraded MapKit framework in iOS 13 now allows us to include and exclude certain places by category on maps.

Here are the point-of-interest categories available right now:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__jW3__RbgENpjtFFyl5Ivs6A.png)

The following code showcases how to filter the points of interest to include only a certain set of categories in the `MKMapView`.

let categories:\[MKPointOfInterestCategory\] = \[.cafe\]  
let filters = MKPointOfInterestFilter(including: categories)

mapView.pointOfInterestFilter = .some(filters)

As an outcome, we get the following filtered-out look of our Maps in SwiftUI.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__MW332d64OoO__PFZUQSnQmQ.png)

### Optimized Map Overlays

iOS 13 MapKit introduces `MKMultiPoyline` and `MKMultiPolygon` classes to group overlays with the same style, instead of creating separate renderer objects for each.

This vastly improves the performance of your application when you are dealing with multiple overlays on a `MapView`.

Adding polylines like the one below would create three different renderers.

view.addOverlay(poyline1)  
view.addOverlay(poyline2)  
view.addOverlay(poyline3)

Instead, doing the following with `MKMultiPolyine` would create just one renderer and prevent any performance issues in your application.

view.addOverlays(\[polyline1, polyline2, polyline3\])

Let’s see how to integrate the new `MKMultiPolylines` by implementing the `MKMapViewDelegate` protocol in a SwiftUI-based view.

#### Adding polylines to the MapView

The following code sets up the Coordinator bridge between UIKit and SwiftUI and adds the polyline overlays on the maps:

struct PolylineMapView: UIViewRepresentable {  
    func makeCoordinator() -> MapViewCoordinator{  
         return MapViewCoordinator(self)  
    }  
      
    func updateUIView(\_ view: MKMapView, context: Context){

        **view.delegate = context.coordinator**  
        let b2MLocation = ... //add your location coordinates here  
        let m2DLocation = ...  
        let d2BLocation = ...  
          
        let polyline1 = MKPolyline(coordinates: b2MLocation, count: b2MLocation.count)  
        let polyline2 = MKPolyline(coordinates: m2DLocation, count: m2DLocation.count)  
        let polyline3 = MKPolyline(coordinates: d2BLocation, count: d2BLocation.count)  
        view.addOverlays(\[polyline1, polyline2, polyline3\])  
    }  
      
    func makeUIView(context: Context) -> MKMapView{  
         MKMapView(frame: .zero)  
    }  
}

The delegate is responsible for communicating the changes from the Coordinator class to the SwiftUI View.

#### Setting up MKMapViewDelegate and PolylineRenderer

In the below code, we’ve set the polyline styles on the instance `MKMultiPolylineRenderer` (newly introduced in iOS 13):

class MapViewCoordinator: NSObject, MKMapViewDelegate {  
        var mapViewController: PolylineMapView  
          
        init(\_ control: PolylineMapView) {  
          self.mapViewController = control  
        }  
      
        func mapView(\_ mapView: MKMapView, rendererFor overlay: MKOverlay) -> MKOverlayRenderer {

if let multiPolyline = overlay as? MKMultiPolyline{  
            let polylineRenderer = **MKMultiPolylineRenderer**(multiPolyline: multiPolyline)  
            polylineRenderer.strokeColor = UIColor.blue.withAlphaComponent(0.5)  
            polylineRenderer.lineWidth = 5  
        }  
        return MKOverlayRenderer(overlay: overlay)  
    }  
}

Here’s a comparison of the new, optimized renderer for multiple polylines against the older one:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__M3XStqWMvtVD9AUkKOXpwQ.png)

### Improved Search Results

MapKit search and auto-completion results have been enhanced by the inclusion of the new `ResultType`, which allows us to specify the outcome result we want to see.

*   `.pointsOfInterest`
*   `.address`
*   `.query`

Besides, the search completer also allows filtering by points of interest to limit the results to certain categories. Here’s some small code, showing the enhanced autocomplete of iOS 13 MapKit:

let completer = MKLocalSearchCompleter()

completer.delegate = self

completer.pointOfInterestFilter = .some(MKPointOfInterestFilter(including: \[.cafe\]))

completer.resultTypes = .query

`MKMapItem` instance, which holds the search results, now has an additional property containing the `pointsOfInterest` to indicate the category type of the returned location or name.

### Controlling the Camera Boundary

`CameraBoundary` is the newly introduced class in `MKMapView`. It allows us to restrict the panning of the map to a particular boundary region. That means that even if you set the map region outside the boundary, the camera boundary would not be violated.

mapView.cameraBoundary = MKMapView.CameraBoundary(coordinateRegion: region)

Alternatively, we can also pass a `MKMapRect` instance inside the `CameraBoundary`.

Another new class that came out with iOS 13 is `CameraZoomRange`. This allows us to set the camera zoom controls based on the center coordinate distance.

The following code showcases a `MapView` implementing both of these classes:

struct CameraBoundaryMapView: UIViewRepresentable {  
      
    func updateUIView(\_ view: MKMapView, context: Context){

let region = MKCoordinateRegion(center: CLLocationCoordinate2D(  
        latitude: 12.9352, longitude: 77.6244), latitudinalMeters: 500, longitudinalMeters: 500)  
          
        view.setCameraZoomRange(MKMapView.**CameraZoomRange**(minCenterCoordinateDistance: 500, maxCenterCoordinateDistance: 2000), animated: true)

view.cameraBoundary = MKMapView.**CameraBoundary**(coordinateRegion: region)     
    }  
    func makeUIView(context: Context) -> MKMapView{  
         MKMapView(frame: .zero)  
    }  
}

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__YTlD8XY6D5dKLTynctY0Bg.gif)

### Conclusion

So, we’ve discussed some pretty interesting changes such as points of interest and camera zooming and saw how MapKit in iOS 13 optimizes overlay rendering.

The full SwiftUI source code is available in the [GitHub repository](https://github.com/anupamchugh/iowncode/tree/master/iOS13MapKit).

That’s it for this piece. I hope you enjoyed reading it.