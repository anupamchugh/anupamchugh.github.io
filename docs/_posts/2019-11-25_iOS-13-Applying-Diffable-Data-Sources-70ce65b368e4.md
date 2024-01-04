---
title: iOS 13 Applying Diffable Data Sources
description: Goodbye reloadData() and performBatchUpdates()
date: '2019-11-25T01:22:52.600Z'
categories: []
keywords: []
slug: /@anupamchugh/applying-diffable-data-sources-70ce65b368e4
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__aUiCUNjlvpJY05oF.jpg)

Declarative programming was wholeheartedly endorsed by Apple during its WWDC 2019 event.

Be it through the introduction of a new UI framework, [SwiftUI](https://developer.apple.com/xcode/swiftui/), or by upgrading the existing UIKit frameworks, Apple showcased the power of declarative programming in boosting iOS and macOS development.

Among the newer enhancements in UIKit, [compositional layouts](https://medium.com/better-programming/ios-13-compositional-layouts-in-collectionview-90a574b410b8) and diffable data sources not only looked promising but also gave a strong indication that the UIKit framework isn’t going away anytime soon.

### Our Goal

*   Understanding the need for diffable data sources.
*   Knowing how diffable data source and snapshots work.
*   Accessing diffable data sources in index path APIs.

In this article, we’ll be implementing diffable data sources using a `UITableView`in an iOS application.

But, before we delve into the intricacies of diffable data sources, let’s for once just look at the traditional ways of setting up the table and collection views.

### Traditional Approach

The traditional approach for plugging data sources requires conforming to the `UITableViewDataSource` protocol and implementing the methods `numberOfItemsInSection`, `numberOfSections`, `cellForItemAt`.

This works all fine for simple `TableViews` and `CollectionViews` until we need to start updating the rows. For updating, both the approaches, `reloadData()` and `performBatchUpdates()`, had their own sets of issues.

While `reloadData()` would ruin our chances of showing nice animations, `performBatchUpdates()` would easily lead to errors if not handled carefully.

Errors like the one shown below were pretty common with `performBatchUpdates()`:

Terminating app due to uncaught exception ‘NSInternalInconsistencyException’,  
reason: ‘Invalid update: invalid number of items in section 0.  
The number of items contained in an existing section after the update   
must be equal to the number of items contained in that section before.

Gladly, Apple brought in diffable data sources to tackle such errors on our behalf.

### Diffable Data Sources — An Error-Free World

Diffable data sources mark a shift towards a declarative paradigm by handling mechanisms like synchronization, updating the changes on its own, thereby making things less error-prone and with the new state-driven approach.

By using the diffing tool, diffable data sources take care of updating `TableView` and CollectionView rows between the states (current and new).

The class `NSDiffableDataSourceSnapshot` represents the state of a UI. To update a `TableView` or `CollectionView`, we just need to `apply(snapshot)` on the `UITableViewDiffableDataSource` and it takes care of updates and animation for you.

The `apply` method can be executed from the background thread as well. Doing so, the diffing that takes O(n) time, takes place in the background after which the changes are updated to the main thread. This speeds up the updating process.

Apple recommends sticking with either the background or main thread when calling the `apply` method.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__ddls6Nr1rg6aTDiCzfwLwA.png)

### Setting Up the Diffable Data Source

For animation and updates to work, we first need to set up our `UITableViewDiffableDataSource` on the `UITableView`.

The following code creates a data source and sets it on the `UITableView` instance:

Snapshots don’t rely on index paths for updating items. Instead, it relies on type-safe unique identifiers to identify its sections and items uniquely.

To generate these unique identifiers, the section and items must conform to the `Hashable` protocol.

While `Sections` in the above code are enums that conform to `Hashable` implicitly, the `Movies` struct needs to implement the `Hashable` protocol as shown in the below code

struct Movies: Hashable {

let identifier: UUID = UUID()  
let name: String

func hash(into hasher: inout Hasher) {  
return hasher.combine(identifier)  
}

static func == (lhs: Movies, rhs: Movies) -> Bool {  
return lhs.identifier == rhs.identifier  
}

}

### Populating Diffable Data Source

To update or populate the data source, we simply add the necessary sections and its items on a snapshot instance and `apply` it. The following code shows how that’s done.

func updateDataSource(animated: Bool) {

var snapshot = NSDiffableDataSourceSnapshot<Section, Movies>()

snapshot.appendSections(Section.allCases)

snapshot.appendItems(\[Movies(name: "Inception")\], toSection: .one)  
snapshot.appendItems(\[Movies(name: "War")\], toSection: .one)  
snapshot.appendItems(\[Movies(name: "Departed")\], toSection: .one)

snapshot.appendItems(\[Movies(name: "Departed")\], toSection: .two)

dataSource.apply(snapshot, animatingDifferences: animated)

}

### Accessing Data

To update or remove data from the `TableView`, we need to get a hold of the current snapshot which is done by invoking `dataSource.snapshot()`.

To access items that have index path based APIs in diffable data sources, we need to translate the index path to the item identifier in the following way:

dataSource.itemIdentifier(for: indexPath)

The following code snippet removes elements when selected from the `UITableView`:

func tableView(\_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {  
        if let movie = dataSource.itemIdentifier(for: indexPath) {  
              
            var currentSnapshot = dataSource.snapshot()  
            currentSnapshot.deleteItems(\[movie\])  
            dataSource.apply(currentSnapshot)  
        }  
}

In return, we get the following outcome of our application:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__ArW2N8llycjli4eTZZDd8g.gif)

Note that the “Departed” item row, though present twice, is identified uniquely because of the `Hashable` protocol.

In another scenario, where the item is non-hashable, the diffable data source wouldn’t be able to identify items with the same content from each other and would end up overwriting the previous item.

So, in the above case with a non-hashable item (let’s say, string), “Departed” would be displayed just once.

### Conclusion

We’ve seen how the diffable data source introduces a whole new way of building data sources for our `CollectionView` and `TableViews`.

It uses item identifiers instead of index paths and possesses the ability to invoke the `apply()` function from the background as well.

So, it’s time to say _no_ to `reloadData()` and `performBatchUpdates()`. The full source code is available in the [GitHub repository](https://github.com/anupamchugh/iowncode/tree/master/DiffableDataSources).

That’s it for this one. I hope you enjoyed reading it.