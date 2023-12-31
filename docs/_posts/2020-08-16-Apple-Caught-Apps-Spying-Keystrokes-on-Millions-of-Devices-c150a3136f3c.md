---
title: Apple Caught Apps Spying Keystrokes on Millions of Devices
date: '2020-08-16T05:30:42.194Z'
categories: []
keywords: []
slug: /apple-clipboard-ios14
---

#### The new iOS 14 privacy feature informs you when an app accesses your data from the copy-paste clipboard

****

The fact that Apple keeps pushing the envelope every year with regards to user privacy is no mystery.

When iOS 13 was rolled out, users all over the world were bewildered to see Bluetooth and location in background permission alerts from almost every app.

Earlier, developers could figure out where you are even when you’d not granted access to the location permission. This made the iOS 13 Bluetooth permission a masterstroke. It was a privacy boon for users as it prevented apps from stealing your data with no prior notice.

iOS 14 only ups the ante by bringing more privacy features. A new popup for ad-tracking will certainly kill targeted advertising. But that isn’t it.

Another brilliant iOS 14 privacy feature informs you every time an app accesses your clipboard. Previously, you might have noticed this only when copying something on a Mac that’s connected to your iOS device.

### iOS 14's Clipboard Notification Is A Slap On TikTok, LinkedIn, And Other Apps Accessing Your Data

Essentially, the clipboard is a place that holds content(largely texts) that you copy. Now, with iOS 14, every time an app reads the clipboard, a notification banner gets displayed to the user.

As soon as developers and users downloaded the iOS 14 beta update on their devices, they were greeted with annoying notifications from a lot of apps including TikTok, LinkedIn, Reddit, and more.

People quickly observed that on the TikTok app every time they typed something in the text field, the banner alerts annoyingly popped up. A lot of them were quick to report these findings on [Twitter](https://twitter.com/jeremyburge/status/1275896482433040386).

Popular social media apps snooping your keystrokes can easily collect more data by analyzing your thoughts(which is no different than what Facebook is doing with Giphy).

While TikTok was quick to fix this issue and actually explained the clipboard use as an anti-spam feature, but this doesn’t exhibit confidence to the end-users.

You’d expect a viral video sensation app to have better resolutions for spam checks than accessing user’s copied contents which could easily contain sensitive information.

LinkedIn, on the other hand, explained its use as an [equality check](https://twitter.com/eberger45/status/1278843576638570496) which is rather absurd. Out of the prominent apps, only Reddit’s explanation for keystroke access was actually understandable. [They said](https://www.theverge.com/2020/7/4/21313214/reddit-code-clipboard-privacy-copy-ios), the clipboard is being accessed to fetch post titles from the URL.

Nevertheless, Apple has clearly put apps under the radar for accessing the clipboard a little too frequently. In doing so, they’ve also provided a better alternative for developers to access the clipboard in a way that it doesn’t display too many clipboard paste notifications.

### Apple Bumps Up Clipboard Security With An Enhanced API For Developers

Viewing every paste notification whenever clipboard is accessed is not only a privacy threat but also annoying.

Gladly, with iOS 14 Apple has updated the clipboard API to provide developers with restricted access.

There’s a new [UIPasteboard.DetectionPattern](http://UIPasteboard.DetectionPattern) struct that lets developers determine the _kind_ of content that’s present in clipboard instead of revealing what it actually contains.

For example, if you’re app only requires reading a URL(like Reddit wants to), you could simply check for that by invoking `probableWebUrl` property on `UIPasteboard.DetectionPattern` before accessing the data.

In doing so, users wouldn’t be bombarded with paste notifications when you access metadata. By implementing the new API in iOS 14, developers cannot and shouldn’t read the underlying data unless it's of the required type.

More importantly, apps would no longer have any reasons to access and misuse a different type of content from the clipboard.

### Conclusion

While a lot can be said about Apple’s App Store monopoly, one cannot deny its efforts in boosting user security.

In times where Facebook and TikTok are marred with controversies around data tracking and misuse, Apple is the lone warrior in enhancing data privacy.

That’s it for this one. Thanks for reading.