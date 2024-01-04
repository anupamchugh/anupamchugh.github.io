---
title: 'Edit PDFs, Images, and Videos Using Quick Look in iOS 13'
description: The QuickLook framework introduced an editing mode
date: '2019-11-14T19:33:53.405Z'
categories: []
keywords: []
slug: >-
  /@anupamchugh/edit-pdfs-images-and-videos-using-quick-look-in-ios-13-ad2131080587
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__4PAyvGEdkoz9Tl22EbRaFg.png)

One of the lesser-known gems of iOS, the Quick Look Framework is useful for previewing documents in your application. During WWDC 2019, the framework got a nice upgrade with the introduction of editing mode.

`QLPreviewController` is the controller responsible for presenting contents of varying types in a view controller. Currently, it supports images, videos, PDFs, CSV, and iWork file types.

`QLPreviewItemEditingMode` is the new addition to the framework that allows us to annotate images and PDFs and trim or convert videos easily.

`QLPreviewItemEditingMode` embeds the [PencilKit](https://medium.com/better-programming/an-introduction-to-pencilkit-in-ios-4d40aa62ba5b) framework for editing images and PDFs.

### Our Goal

*   Exploring the new additions in the Quick Look framework
*   Building an iOS Application that uses Quick Look for editing documents
*   Saving the edited documents in the documents directory using the `FileManager`

#### Final destination

By the end of this piece, we’ll be able to edit and save images, videos, and PDFs as shown below:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__y5gmtds2hlufUxlVL4mc9Q.png)

### What’s New in iOS 13 QuickLook?

Besides the addition of `QLPreviewItemEditingMode`, the `QLPreviewControllerDelegate` protocol introduces three new optional delegate methods.

#### Handling editing mode capabilities

We can handle the editing mode by implementing the following method:

optional func previewController(\_ controller: QLPreviewController, **editingModeFor** previewItem: QLPreviewItem) -> QLPreviewItemEditingMode

In the above method, we can set the return type as `createCopy` , `default` or `updateContents` to handle the editing results accordingly. `updateContents` overwrites the content of the QLPreviewItems in the `FileManager`. By default editing mode is off.

#### Saving the edited contents

Once the edit is done, we can save the modified contents using the below optional method:

func previewController(\_ controller: QLPreviewController, didSaveEditedCopyOf previewItem: QLPreviewItem, at modifiedContentsURL: URL)

The above method gets triggered when the `EditingMode` is `createsCopy`. It returns the URL of the modified content(the content resides in a temp location). We can then choose to handle the URL and save it in `FileManager`.

#### Notifying about edited contents

We can choose to update the user interface after being notified of the successful update of the QLPreviewItem. This gets triggered when the Editing Mode is `updatesContent` :

func previewController(\_ controller: QLPreviewController, didUpdateContentsOf previewItem: QLPreviewItem)

In the next section, we’ll be creating a simple iOS application that invokes the Quick Look preview with a sample image, video, and PDF that are available with the source code. Just `import QuickLook` in your ViewController to get started.

### Setting Up QLPreviewController

The following code is used to present the Quick Look Preview controller in our application’s ViewController and enable the Editing Mode:

@objc func onButtonClick(sender: UIButton){  
          
        let previewController = QLPreviewController()  
        previewController.dataSource = self  
        previewController.delegate = self  
        **previewController.setEditing(true, animated: true)**  
        self.present(previewController, animated: true, completion: nil)  
}

Next, you need to conform to the `QLPreviewControllerDelegate` , `QLPreviewControllerDataSource` protocols and implement the delegate functions in your class.

### Setting Up Our Data Source

For the data source, we’ve set up an array of file name literals that’ll be used to display the `QLPreviewItems` as shown below:

var items : \[String\] = \["sampleVideo.mp4", "samplePDF.pdf", "sampleImage.png"\]

Next, we need to implement the data source protocol methods in order to display the `QLPreviewItems`. The following code is responsible for displaying the data source files in `QLPreviewItems` :

extension ViewController: QLPreviewControllerDataSource {  
    func numberOfPreviewItems(in controller: QLPreviewController) -> Int {  
        return items.count  
    }  
      
    func previewController(\_ controller: QLPreviewController, previewItemAt index: Int) -> QLPreviewItem {  
          
        print(controller.isEditing)  
          
        let name = self.items\[index\]  
        let file = name.components(separatedBy: ".")  
        let path = Bundle.main.path(forResource: file.first!, ofType: file.last!)  
        let url = NSURL(fileURLWithPath: path!)  
        return url as QLPreviewItem  
    }  
}

### Saving Updated Contents

Finally, we’ll add the optional delegate functions in order to save the edited contents as a copy by using the `FileManager` :

In the above code, we retrieve the file path using the `modifiedContentsURL`. Using the FileManager, we save the edited file into our application’s document directory.

As a result, we get the following application up and running!

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__0s8Wp__3HS3cIz1YZ__gg1rg.gif)

We’ve set up our buttons using the new [iOS 13 System Symbols](https://medium.com/better-programming/ios-13-context-menus-and-sf-symbols-a03b032fe330).

### Conclusion

So we explored the little gem that largely went unnoticed during WWDC 2019. Quick Look Editing Mode is an interesting feature since it allows us to quickly annotate PDFs in our application by using the PencilKit framework built-in. The full source code is available in the [Github Repository](https://github.com/anupamchugh/iowncode/tree/master/iOS13QuickLook).

That’s it for this one. I hope you enjoyed reading.