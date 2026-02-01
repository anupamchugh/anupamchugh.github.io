---
title: >-
  How Facebook’s SDK Can Bring Apple’s iOS Ecosystem Down Without a Single Line
  of Code
date: '2020-07-23T17:37:46.279Z'
categories: []
keywords: []
slug: /how-facebooks-sdk-can-bring-apple-ios-ecosystem-down
---

#### Facebook’s SDK is not only a privacy threat but can also cause catastrophes

One fine morning, I opened my favorite music streaming app, Spotify, on an iOS device and it crashed.

It could have been because I was using iOS 14 beta. Without pondering it too much, I went ahead and opened my favorite blogging app, Medium. _And it crashed as well._

Two of my favorite apps being down at the same time was a weird coincidence. I reinstalled the apps, rebooted my device, but still no luck. The issue persisted.

Strangely, WhatsApp and Instagram were working just fine.

I quickly jumped onto the Twitter web browser to check if there was anything. After all, any breaking news and outages are first reported on the microblogging social media platform.

And it turns out the issue was neither with Apple’s ecosystem nor a lapse in those apps. It was actually a glitch on Facebook’s end.

Facebook’s iOS SDK is widely used across apps on the App Store and had a glaring bug on its server side. It brought down every popular app ranging from Pinterest, Tinder, and TikTok to Medium, Spotify, and PUBG.

This was a strange 20-minute period that caused [more than 500K](https://github.com/facebook/facebook-ios-sdk/issues/1430) crashes in the Apple ecosystem — one of the biggest in recent times.

### Facebook’s SDK Is a Kill Switch Button Present in Almost Every App

Facebook might not have its own mobile operating system, but it’s smartly poised in almost every app on your phone.

Specifically, their open-source SDK is used for easy integration of the Login with Facebook button, analyzing rich metrics, and other utilities such as ad-tracking.

This means if your application accepts permission for location or Bluetooth, Facebook’s SDK can access that data.

Knowing Facebook’s history with data tracking and privacy breaches, not only is their SDK a spy camera, but it’s also highly unreliable. Realistically, Facebook’s SDK is a remote button that can bring apps down in a second.

### Could iOS Developers Have Prevented the Crash? Short Answer: No

In times when we’re seeing advancements in the fields of artificial intelligence and augmented reality, seeing the most popular apps crash feels like traveling back to the Stone Age.

One could easily point fingers at the app developers, and why not? It’s their job to ensure edge cases and errors are handled appropriately.

While it may seem that such app crashes could be prevented with robust error handling, with Facebook’s iOS SDK, this really wasn’t the case.

The bug that caused the app crashes was essentially triggered in the Facebook SDK’s initialization code that runs at launch, as it's linked in the binary.

Essentially, the SDK code was making remote API calls to the Facebook server that eventually returned a [JSON response with a null value](https://github.com/facebook/facebook-ios-sdk/pull/1439) that wasn’t being parsed or handled and hence triggered a `fatalError`.

The app developer might not have even imported the Facebook SDK or invoked a single line of its code, but just by including the framework in the bundle, it crashed applications.

No developer could have prevented this.

### Takeaway

The Facebook iOS SDK disrupted popular applications not once but twice this year. This only opens up the debate about the reliance on and reliability of third-party SDKs.

Is convenience greater than security? Currently, it’s the former that’s causing such lapses.

If there’s any takeaway, developers would only become more aware of it when using third-party frameworks in their applications knowing the cost that external dependencies bring.

Surprisingly, the whole Facebook family of apps were using the latest SDK version and the crashes were caused in the older SDK. This speaks volumes about the accountability of the Silicon Valley tech giant. Perhaps they’re not too keen to provide backward compatibility.

It’ll be interesting to see if Apple looks to bump up its security measures to prevent such outages. Perhaps it’d look to enforce Sign in with Apple in third-party applications and slowly shift away from Login with Facebook.

Facebook, which is already embroiled in anti-trust concerns, wouldn’t be able to do much but adhere to the norms set by Apple.