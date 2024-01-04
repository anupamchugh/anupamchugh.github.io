---
title: Coronavirus Visualisation on Maps with SwiftUI and Combine on iOS
description: >-
  Leveraging a GIS dataset to show real-time updates on the outbreak of the
  global COVID-19 pandemic
date: '2020-03-13T13:45:06.463Z'
categories: []
keywords: []
slug: >-
  /@anupamchugh/coronavirus-visualisation-on-maps-with-swiftui-and-combine-on-ios-c3f6e04c2634
---

#### COVID-19

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__r__lD4nuhi__JnByKRL5__jaQ.jpeg)

> For rolling updates on COVID-19, including location-specific developments, guidance on preparedness, and more, [visit the World Health Organization’s official update portal.](https://www.who.int/emergencies/diseases/novel-coronavirus-2019/events-as-they-happen)

Recently, a lot of datasets have started to emerge as the outbreak of the contagious virus continues to spread around the globe. While some are leveraging them to forecast the impact of coronavirus (COVID-19) in the coming future, the accuracy of such models is questionable.

The idea of this article isn’t to do a predictive analysis using the current coronavirus datasets. Instead, we’ll create a SwiftUI and Combine-based iOS application that visualizes the impact of this virus on Maps in real-time. To do this, we’ll be using a GIS dataset. Before we dive into the implementation, let’s talk a bit about GIS datasets.

GIS (Geographic Information Systems) datasets present data based on geographical location. While using such datasets on Maps helps with faster decision making by analyzing data, the intersection of machine learning and GIS can give rise to a lot more solutions for many business problems today.

Classification, regression, clustering, predictive analysis, and anomaly detection are just a few machine learning categories where GIS datasets can be used.

Specifically, GIS datasets can be used to analyze crime rates, agricultural production, environmental problems across countries, to optimize traffic, and classify land and road networks (via machine learning). Apple only recently released an [application](https://apps.apple.com/in/app/cleansky/id1495573108?ign-mpt=uo%3D2) that tracks and displays air quality on its default Maps application.

While there’s a lot that can be done in ML with GIS datasets, let’s bring back our focus back to visualizing the spread of COVID-19 on Maps in iOS. To start off, we need a GIS dataset for the task.

### Our Dataset

There are a lot of free GIS datasets available for using geospatial data. There’s a [Google Landmarks](https://www.kaggle.com/google/google-landmarks-dataset) dataset that recognizes famous places, a [GlobalMaps](https://globalmaps.github.io/) dataset that contains information about elevation, drainage, transportation population, a [National Geophysical dataset](https://www.ngdc.noaa.gov/nndc/struts/results?op_2=ne&v_2=STORE&t=102759&s=15&d=10,15,11) that covers information related to earthquakes, a [WorldClim](http://www.worldclim.org/) dataset that holds information related to climate temperature and precipitation — the list of datasets available is never-ending.

The spatial data that is available in GIS datasets can be in either vector or raster formats. The vector data is represented in the form of points, lines, and polygons. At the same time, Rasters are digital aerial photographs, imagery from satellites, digital pictures, and the data is stored in the form of grid of pixels. The dataset that we’ll use holds vector data information along with attributes(non-spatial data, information related to the location).

While all that’s good, cleaning and preparing the data for our problem by removing the noisy information is a challenge. Luckily, we have [ArcGIS Open Data](https://hub.arcgis.com/pages/open-data), a platform comprising 200K+ datasets from over 2K organizations. Most importantly, it provides an API for customizing data for our own solutions.

We’ll be using the [data provided by John Hopkins](https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6), which is a real-time source for updates on the spread of COVID-19. ArcGiS holds the API for querying this data. Here’s a bird’s eye view of the query parameters:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__fn__VYohC9VXhNOhLri6m8w.png)

### Setting Up Our Data Model

To start, we need to set up our model structures that’ll parse the JSON response. The following code snippet does that by conforming to the Codable protocol:

Next up, we’ll set up our `ObservableObject` class where we’ll perform the network request using Combine publishers.

### Network Request Using Combine and URLSession

Apple’s own reactive programming framework Combine has smartly exposed its publisher property for the Foundation framework classes. URLSession is (figuratively) on steroids thanks to the new `dataTaskPublisher` method and the Combine operators that let us transform and decode responses, as well as chain multiple requests.

In the following code of the `ObservableObject` class, we’re performing the network request to fetch the coronavirus cases worldwide:

The `URLQueryItem` we’ve set lets us retrieve data from all countries and provinces that have coronavirus cases, in descending order.

Now that we’ve got a hold of the data and set it in our model, it’s time to pass it on to another model that conforms to the `MKAnnotation` protocol, which is a part of Apple’s MapKit framework that lets us store the content we wish to annotate on the map.

In the following code, we’re storing the province, number of coronavirus cases, and coordinates of that given location:

class CaseAnnotations: NSObject, MKAnnotation {  
    let title: String?  
    let subtitle: String?  
    let coordinate: CLLocationCoordinate2D  
      
    init(title: String?,  
         subtitle: String?,  
         coordinate: **CLLocationCoordinate2D**) {  
          
        self.title = title  
        self.subtitle = subtitle  
        self.coordinate = coordinate  
    }  
}

`CLLocationCoordinate2D` is responsible for holding the latitude and longitude.

Add the following method in your `ObservableObject` class. This will set data from the response to an array of `CaseAnnotations`, which eventually updates our `MapView`:

Finally, it’s time to implement a user interface. Let’s create a SwiftUI view that displays the information published from the `ObservableObject` class.

### Integrating MKMapView in SwiftUI

Currently, in the first version of SwiftUI, we cannot embed the `MKMapView` directly. So we need to fall back to a `UIViewRepresentable` protocol that lets us integrate UIKit views in SwiftUI. The following structure sets up the `MKMapView` and adds the markers on the map in the form of `MKPinAnnotationView`:

The `MapViewCoordinator` class acts as the bridge between UIKit and SwiftUI. It lets us pass data between SwiftUI and UIKit views. Here, we’re simply passing the array of `CaseAnnotations` and drawing them on the map, as shown in the code below:

*   The `mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation)` function is triggered when `MKAnnotations` are added on the `MKMapView`. In this function, we’re setting up our `MKPinAnnotationView` and its content.
*   The `canShowCallout` property is set to `true` in order to popup the content in a hover view. The view to be displayed is set on the `detailCalloutAccessoryView` property of the `MKAnnotationView`.

Finally, we’re ready to set up our SwiftUI view that populates the map and data:

The output of the application in action, at the time of writing this piece, is given below:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1____8PEJQSIfG7Y6WguGP__bWA.gif)

### Closing Thoughts

We started with a brief overview of GIS datasets and the potential they have in helping us solve common machine learning and deep learning problems. Geospatial information is crucial for visualizing and solving world problems. Moreover, GIS datasets are extremely useful for computer vision-based tasks. Segmenting road networks or classifying the different types of lands—the opportunities are there for a wide range of geospatial analyses.

Subsequently, we used a recently released dataset that tracks COVID-19 cases geographically across the world. To use it in our application, we used the power of Apple’s Combine framework for processing asynchronous tasks and transforming the values in order to display it on the Map in a SwiftUI Application.

[iOS 13’s MapKit](https://medium.com/better-programming/exploring-mapkit-on-ios-13-1a7a1439e3b6) brought some interesting new features and enhancements. The pick of the lot was the optimized `MKPolylines` and `MKPolygons`. MapKit now lets us group overlays and set common styles, instead of creating a separate renderer, like in iOS 12.

Alternatively, you can also use [Mapbox](https://www.mapbox.com/), a third-party map-based API that lets us customize maps by highlighting the polygon areas of different cities.

The full source code of this article is available in this [GitHub Repository](https://github.com/anupamchugh/iowncode/tree/master/SwiftUICoronaMapTracker).

That’s it for this one. Thanks for reading.

> For rolling updates on COVID-19, including location-specific developments, guidance on preparedness, and more, [visit the World Health Organization’s official update portal.](https://www.who.int/emergencies/diseases/novel-coronavirus-2019/events-as-they-happen)

_Editor’s Note:_ [_Heartbeat_](https://heartbeat.comet.ml/) _is a contributor-driven online publication and community dedicated to providing premier educational resources for data science, machine learning, and deep learning practitioners. We’re committed to supporting and inspiring developers and engineers from all walks of life._

_Editorially independent, Heartbeat is sponsored and published by_ [_Comet_](http://comet.ml/?utm_campaign=heartbeat-statement&utm_source=blog&utm_medium=medium)_, an MLOps platform that enables data scientists & ML teams to track, compare, explain, & optimize their experiments. We pay our contributors, and we don’t sell ads._

_If you’d like to contribute, head on over to our_ [_call for contributors_](https://heartbeat.fritz.ai/call-for-contributors-october-2018-update-fee7f5b80f3e)_. You can also sign up to receive our weekly newsletters (_[_Deep Learning Weekly_](https://www.deeplearningweekly.com/) _and the_ [_Comet Newsletter_](https://info.comet.ml/newsletter-signup/)_), join us on_ [](https://join.slack.com/t/fritz-ai-community/shared_invite/enQtNTY5NDM2MTQwMTgwLWU4ZDEwNTAxYWE2YjIxZDllMTcxMWE4MGFhNDk5Y2QwNTcxYzEyNWZmZWEwMzE4NTFkOWY2NTM0OGQwYjM5Y2U)[_Slack_](https://join.slack.com/t/cometml/shared_invite/zt-49v4zxxz-qHcTeyrMEzqZc5lQb9hgvw)_, and follow Comet on_ [_Twitter_](https://twitter.com/Cometml) _and_ [_LinkedIn_](https://www.linkedin.com/company/comet-ml/) _for resources, events, and much more that will help you build better ML models, faster._