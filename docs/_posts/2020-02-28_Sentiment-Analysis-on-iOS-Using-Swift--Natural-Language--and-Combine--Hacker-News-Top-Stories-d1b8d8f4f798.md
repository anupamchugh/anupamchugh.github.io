---
title: >-
  Sentiment Analysis on iOS Using Swift, Natural Language, and Combine: Hacker
  News Top Stories
description: >-
  Leveraging Apple’s reactive programming framework for handling asynchronous
  tasks, while also doing natural language processing in…
date: '2020-02-28T14:26:01.233Z'
categories: []
keywords: []
slug: >-
  /@anupamchugh/sentiment-analysis-on-ios-using-swift-natural-language-and-combine-hacker-news-top-stories-d1b8d8f4f798
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__J4d5sOjVozBE6pq8Df5vgA.jpeg)

Powering applications with the ability to understand the natural language of the text always amazes me. Apple made some significant strides with its Natural Language framework last year (2019). Specifically, the introduction of a built-in sentiment analysis feature can only help build smarter NLP-based iOS Applications.

Besides the improvements to the Natural Language framework, SwiftUI and Combine were the two biggies that were introduced during WWDC 2019.

SwiftUI is a declarative framework written in Swift that helps developers build user interfaces quickly. Combine, on the other hand, is Apple’s own reactive programming framework, designed to power modern application development, especially when handling asynchronous tasks.

### Our Goal

*   We’ll be using the Hacker News API to fetch the top stories using a Combine-powered URLSession.
*   Subsequently, we’ll run Natural Language’s built-in sentiment analysis over the top-level comments of each story to get an idea of the general reaction.
*   Over the course of the tutorial, we’ll see how reactive programming makes it easier to chain multiple network requests and transform and pass the results to the Subscriber.

> Pre-requisite: Having a brief idea about the Combine framework would be helpful. Here’s a [piece](https://medium.com/better-programming/a-deep-dive-into-the-combine-framework-in-swift-cffdfcc6f32c) to kickstart using Combine in Swift.

### Getting Started

To start, let’s create a new Xcode SwiftUI project. We’ll be using the official [Hacker News API](https://github.com/HackerNews/API), which offers almost real-time data.

In order to create a SwiftUI List that holds the top stories from Hacker News, we need to set up our `ObservableObject` class. This class is responsible for fetching the stories from the API and passing them on to the SwiftUI List. The following code does that for you:

There’s a lot happening in the above code. Let’s break it down:

*   `fetchTopStories` is responsible for returning an array of integer ids for the stories.
*   To save time, we’re passing the top 10 story identifiers to the `fetchStoryById` function, where we’re fetching the Hacker News stories using a custom publisher `FetchItem` and merging the results.
*   The `collect()` operator of Combine is responsible for merging all the stories fetched from the API into a single array.

Let’s look at how to construct our custom Combine publisher next.

### Creating a Custom Combine Publisher

To create a custom publisher, we need to conform the struct to the `Publisher` protocol and set the `Output` and `Failure` types of the stream as shown below:

*   The `id` defined represents the story identifier that’s passed in the initializer.
*   Implementing the `receive(subscriber:)` method is crucial. It connects the publisher to the subscriber, and we need to ensure that the output from the publisher has the same type as the input to the subscriber.
*   Inside the `receive<S>(subscriber: S)` method, we’re making another API request. This time, we’re fetching the story and decoding it using a `StoryItem` model, which is defined below:

struct StoryItem : Identifiable, Codable {  
    let by: String  
    let id: Int  
    let kids: \[Int\]?  
    let title: String?

private enum CodingKeys: String, CodingKey {  
            case by, id, kids, title  
        }  
}

The array of `StoryItems` is then published to the SwiftUI view to get which has a built-in subscriber. The following code is responsible for displaying the Hacker News stories in the SwiftUI list:

The `NavigationLink` is responsible for taking the user to the destination screen, where the comments are displayed. We’ve wrapped our destination view — `CommentView`—in a lazy view. This is done to load the destination views only when the user has navigated to that view. It’s a [common pitfall in](https://medium.com/better-programming/swiftui-navigation-links-and-the-common-pitfalls-faced-505cbfd8029b) `[NavigationLink](https://medium.com/better-programming/swiftui-navigation-links-and-the-common-pitfalls-faced-505cbfd8029b)`[s](https://medium.com/better-programming/swiftui-navigation-links-and-the-common-pitfalls-faced-505cbfd8029b).

Before we jump into the comments section and the subsequent sentiment analysis using NLP, let’s look at what we’ve built so far:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__uq9OYI4LpYaq9TPE73fRDA.gif)

### Fetching Hacker News Comments and Analyzing Sentiment Scores

The `kids` property in the `StoryItem` model contains the ids for the top-level comments. We’ll use a similar approach for multiple network requests as we did earlier, using Combine publishers.

The difference here is the inclusion of Natural Language’s built-in sentiment analysis to give a sentiment score to each comment, followed by calculating the mean sentiment score for that story.

The following code is from the `HNCommentFeed` class, which extends the `ObservableObject`:

The `comments` property, once fetched from the API using the custom publisher, is manually published by invoking `didChange.send()` once we’ve calculated the mean sentiment score and set it on the `sentimentAvg` property, which is a `@Published` property wrapper itself.

Before we look at the SwiftUI view that holds the comments with their respective scores, let’s look at the custom Combine publisher `FetchComment`, as shown below:

Much like the previous custom publisher, we need to define the `Output` and `Failure` types. Besides that, we’re doing quite a number of things in the `map` operator to transform the `CommentItem` into another new instance, which holds the sentiment score as well.

Let’s look at the important ones that are marked with a comment.

1.  Passing the `id` of the comment and `nlTagger` instance from the `HNCommentFeed`. The `nlTagger` is responsible for segmenting the text into sentence or paragraph units and processing the information in each part. In our case, we’ve set it to process the `sentimentScore`, which is a floating-point value between -1 to 1 based on how negative or positive the text is.
2.  The comment’s text returned from the API request in the `CommentItem` instance is an HTML string. By retrieving the data part (using `utf8`), we’re converting it into a formatted string, devoid of the HTML escape characters.
3.  Next, we’ve set the formatted string on the `nlTagger’s` `string` property. This string is analyzed by the linguistic tagger.
4.  Finally, we’ve created a new `CommentItem` instance that holds the `sentimentScore`. This is result is passed downstream to the subscriber.

The code for the `CommentView` SwiftUI struct which holds the comments along with their score is given below:

We’ve set an SF Symbol (new in iOS 13) as the Navigation Bar Button, the color of which represents the overall sentiments of the top-level comments of that story.

As a result, we get the following output in our application:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__ZnuTLJdRiyR88EcFcNSB3A.gif)

### Conclusion

Using Apple’s built-in sentiment score for NLP, we see that most top stories attract polarizing opinions on Hacker News. While a lot of comments are cryptic, which can cause accuracy issues in the sentiment analysis even custom models, Apple’s built-in sentiment analysis does a fine job. The Natural Language framework has shown some good progress, and there’s a lot more to look forward to in WWDC 2020.

Let’s take a step back and look at what we’ve learned in this piece.

We saw:

*   How the Combine framework makes it really easy to handle multiple network requests with URLSession. We managed to chain requests, set dependency API requests, and synchronize the API results by avoiding the dreaded callback hell.
*   How to create custom publishers and ensure that the contract between the publisher and subscriber is maintained (visit the where clause in the `receive` methods).
*   How to use Combine operators to our advantage. We managed to transform a bunch of comments to add an additional property — sentiment score—by performing natural language processing inside the Combine operators.

Moving forward, you can extend the above implementation by adding an endless scrolling functionality. This gives you all the top Hacker News stories. Here’s a [good reference](https://medium.com/better-programming/build-an-endless-scrolling-list-with-swiftui-combine-and-urlsession-8a697a8318cb) for implementing endless scrolling in a SwiftUI-based application.

The full source code of the above application is available in this [GitHub repository](https://github.com/anupamchugh/iowncode/tree/master/SwiftUIHNSentiments).

That’s a wrap for this one. Thanks for reading, and I hope you enjoyed the mix of Combine and the Natural Language framework.