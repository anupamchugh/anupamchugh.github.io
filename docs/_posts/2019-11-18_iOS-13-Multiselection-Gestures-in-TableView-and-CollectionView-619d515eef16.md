---
title: iOS 13 Multiselection Gestures in TableView and CollectionView
description: Accelerate item selection with the new delegate methods
date: '2019-11-18T07:34:16.298Z'
categories: []
keywords: []
slug: >-
  /@anupamchugh/ios-13-multi-selection-gestures-in-tableview-and-collectionview-619d515eef16
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__I8ChgT4jW68Wg2HjDGf8KQ.jpeg)

WWDC 2019 introduced some interesting new features onto the table whilst enhancing some older ones. While SwiftUI rocked the community with its intuitive ways of building the user interface, multiple selections with two pan gestures were introduced on cells for accelerating the user’s selection process.

By using the newly introduced delegate methods and properties of `CollectionView` and `TableView`, we can quicken the process of item selections for the user.

#### Our goals

*   Understanding how multiselection works in `TableView` and `CollectionView`
*   Implementing the new iOS 13 feature to delete a batch of selections from a `TableView`

### Multiple Selection With Two Pan Gestures

iOS 13's `TableViews` and `CollectionViews` provide two-finger pan gestures for the multiple selections of items. As soon as the view recognizes the gesture, it enables the editing mode. The user needn’t even tap the edit mode, as the gesture automatically puts the view in editing mode.

Also, the multiselection needn’t be continuous. A user can stop selecting at a certain point and begin the gesture from another point in the `TableView` or `CollectionView`. The following illustration shows how it works.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__F__zPVDMEgx7RNizQt1oT6A.png)

To support multiple item selection in a `TableView`, the `allowsMultipleSelectionDuringEditing` property needs to be enabled. Additionally, the following new optional delegate methods need to be implemented:

*   `didBeginMultipleSelectionInteractionAt`
*   `shouldBeginMultipleSelectionInteractionAt`
*   `tableViewDidEndMultipleSelectionInteraction`

Two-finger pan gestures also allow single-finger multiselection/deselection on a group of already selected items.

### Implementing Multiselection in TableView

To get started, create a new Xcode project.

The following code demonstrates an example of `TableView` with multi-finger selection in editing mode along with an option to delete the bunch of selected items.

In the above code, inside the `didBeginMultipleSelectionInteractionAt` editing mode is enabled in order to mark the multiple selections.

The `setEditing` handles the case after the editing is marked done by the user. In our case, we delete the array of selected items from the `TableView`.

In return, we get the following outcome of the iOS application in a simulator.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1____2KQzTFzt1cinwuybNTl9g.gif)

In order to simulate gestures on a simulator, drag the trackpad while holding the option and shift buttons.

The equivalent delegate methods are available for `CollectionView` too.

### Conclusion

So we implemented the new iOS 13 two-finger gestures for multiselections on a `TableView`. Apple aims to accelerate the user selection of multiple items with this feature. The source code of the above implementation is available in this [GitHub repository](https://github.com/anupamchugh/iowncode/tree/master/iOS13TableViewAndCollectionView)

iOS 13 also introduces other notable UIKit additions, such as compositional layouts in `CollectionViews`. We’ll cover that in the next piece. Stay tuned!

That’s it for this one. I hope you enjoyed reading.