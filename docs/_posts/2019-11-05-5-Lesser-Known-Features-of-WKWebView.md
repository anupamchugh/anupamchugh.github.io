---
title: Lesser-Known WKWebView Features
date: '2019-11-05T14:27:31.457Z'
categories: []
keywords: []
slug: /lesser-known-ios-wkwebview-features
---

## WKWebView, then and now

*Updated November 2026. The original 2019 article follows this update.*

In 2019, embedding a website in a SwiftUI app meant wrapping `WKWebView` in `UIViewRepresentable`. Today, WebKit has a SwiftUI view of its own. `WKWebView` is still here, and the questions below still matter: where can a page navigate, how are dialogs presented, and which session owns its cookies?

### A native SwiftUI web view

On iOS 26 and later, import WebKit and display a URL directly:

```swift
import SwiftUI
import WebKit

struct ArticleView: View {
    private let url = URL(string: "https://example.com")!

    var body: some View {
        WebView(url: url)
    }
}
```

For more control, create a `WebPage` and pass it to `WebView`. The page exposes observable state such as the URL, title, and loading progress. Its `NavigationDeciding` and `DialogPresenting` protocols let you customize navigation and JavaScript dialogs. Apple's [cross-platform browser sample](https://developer.apple.com/documentation/webkit/building-a-cross-platform-web-browser) shows how these pieces fit together.

Supporting older iOS versions? A `UIViewRepresentable` wrapper around `WKWebView` is still an option. On macOS, the corresponding bridge is `NSViewRepresentable`. Pick the implementation that fits your deployment target and the behavior you need.

### The five features, revisited

1. **Navigation.** `WKNavigationDelegate` remains useful for a `WKWebView`. With SwiftUI WebKit, look at [`WebPage.NavigationDeciding`](https://developer.apple.com/documentation/webkit/webpage/navigationdeciding). Match a callback by its expected scheme, host, path, and relevant state. A substring check can match an unrelated URL. The original delegate snippets below also omit a decision on some paths. A real delegate must complete every navigation decision exactly once.
2. **JavaScript dialogs.** `WKUIDelegate` can handle alerts, confirmations, and prompts in `WKWebView`. SwiftUI WebKit offers [`WebPage.DialogPresenting`](https://developer.apple.com/documentation/webkit/webpage/dialogpresenting). Decide how to present, cancel, and complete each dialog. Don't silently assume every website needs custom dialog handling.
3. **Links out of the app.** Decide which HTTPS destinations can remain in the view and how user-initiated `tel:`, `sms:`, and `mailto:` links should open. Handle unsupported schemes and failed opens explicitly. The 2019 sample is a sketch, not a complete navigation policy.
4. **Authentication.** A `URLAuthenticationChallenge` handles a specific web or server authentication challenge. It isn't a general replacement for an OAuth redirect. For a browser-based sign-in, consider Apple's [`WebAuthenticationSession`](https://developer.apple.com/documentation/authenticationservices/webauthenticationsession) where it fits the provider's flow. If the provider requires an embedded web view, validate the redirect and let the user complete sign-in. Never bypass a server-trust challenge or put an app secret in client code.
5. **Cookies.** The old claim that every `WKWebView` has its own cookie storage is too broad. By default, `WKWebViewConfiguration` uses the default persistent [`WKWebsiteDataStore`](https://developer.apple.com/documentation/webkit/wkwebsitedatastore). You can choose a nonpersistent store for an in-memory session or use a separate identified store for a profile. WebKit's cookie store and `HTTPCookieStorage` are distinct APIs. Copy cookies only when your design requires it, and test the sign-in and logout behavior you actually need.

For example, [Kite Connect's mobile guidance](https://kite.trade/docs/connect/v3/apps/) describes a web-view login and a registered redirect. It also says a distributed app must keep its API secret on a backend. A browser view can show a login page. It doesn't by itself prove that the callback, token exchange, session, or subsequent data request succeeded.

The original snippets below are preserved as a 2019 snapshot. They're illustrative and need the corrections above before use in an app. The old description of `WKWebView` as running outside the app's main thread also needs care: web content uses a separate process, while the view and its UI-facing APIs still belong on the main actor.

---

## Original article — November 2019

_Recently, I worked on a freelance project (Aged Care Decisions) where I was asked to build a PoC set of white-label apps that uses web views throughout. Below are the things I discovered while implementing WKWebView in the iOS apps._

iOS and Web have a long history. Their history can be defined in two eras: the shaky rule of `UIWebView` followed by the savior, `WKWebView`. `UIWebView` has been deprecated since iOS 12. Apple won’t even accept app submissions if there’s even a trace of it. Why would they, when its successor performs twice as well?

`WKWebView` is a part of the `WebKit` framework and runs outside the application’s main thread, thus contributing to its stability and superior performance.

For starters, to load content, let’s say a URL string in a `WKWebView`, we simply do the following:

```
guard let url = URL(string: string) else { return }  
let request = URLRequest(url: url)  
webView?.load(request)
```

There’s a lot more you can do with `WKWebView` than just content loading and CSS styling.

The following section is a checklist of the relatively lesser-known features of `WKWebView`.

### 1\. Intercepting Web URL

By implementing `WKNavigationDelegate` protocol’s `decidePolicyFor` function we can intercept intermediate URL during navigations. The following code snippet shows how it’s done:

```
func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
  let urlString = navigationAction.request.url?.absoluteString ?? ""
  let pattern = "interceptSomeUrlPattern"
  if urlString.contains(pattern){
     var splitPath = urlString.components(separatedBy: pattern)
  }
}
```

### 2\. JavaScript Alerts

By default, prompts from JavaScript don’t show up in `WKWebView` since it isn’t a part of UIKit. So, we need to implement the `WKUIDelegate` protocol in order to show alerts, confirmations or text input in prompts.

Following are the methods for each of the different alerts or action sheets:

```
func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void)

func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) 


func webView(_ webView: WKWebView, runJavaScriptTextInputPanelWithPrompt prompt: String, defaultText: String?, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (String?) -> Void) {

        let alertController = UIAlertController(title: nil, message: prompt, preferredStyle: .alert)

        alertController.addTextField { (textField) in
            textField.text = defaultText
        }
        alertController.addAction(UIAlertAction(title: "Ok", style: .default, handler: { (action) in
            if let text = alertController.textFields?.first?.text {
                completionHandler(text)
            } else {
                completionHandler(defaultText)
            }
        }))

        self.present(alertController, animated: true, completion: nil)
 }
```

![](/assets/screenshots/js-alerts-ios-wkwebview.gif)

### 3\. Configure URL Actions

Using the `decidePolicyFor` function, you can not only control external navigation with actions such as calls, facetime, and mail but also choose to restrict certain URLs from opening. The following piece of code shows each of these cases.

```
func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {

guard let url = navigationAction.request.url else {
            decisionHandler(.allow)
            return
        }

 if ["tel", "sms", "mailto"].contains(url.scheme) && UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
            decisionHandler(.cancel)
        } else {
            if let host = navigationAction.request.url?.host {
               if host == "www.notsafeforwork.com" {
                  decisionHandler(.cancel)
               }
               else{
                   decisionHandler(.allow)
               }
            }
        }        
  }
}
```

### 4\. Authenticating With WKWebView

When your URL in `WKWebView` requires user authorization, you need to implement the following method:

```
func webView(_ webView: WKWebView, didReceive challenge: URLAuthenticationChallenge, completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
        
        let authenticationMethod = challenge.protectionSpace.authenticationMethod
        if authenticationMethod == NSURLAuthenticationMethodDefault || authenticationMethod == NSURLAuthenticationMethodHTTPBasic || authenticationMethod == NSURLAuthenticationMethodHTTPDigest {
            //Do you stuff  
        }
        completionHandler(NSURLSessionAuthChallengeDisposition.UseCredential, credential)
}
```

On receiving the authentication challenge you can determine the type of authentication it needs (user credentials or a certificate) and handle the conditions with prompts or predefined credentials accordingly

### 5\. Sharing Cookies Across WKWebViews

Every instance of `WKWebView` has its own cookie storage. In order to share cookies across multiple instances of `WKWebView`, we need to use `WKHTTPCookieStore` as shown below:

```
let cookies = HTTPCookieStorage.shared.cookies ?? []for (cookie) in cookies {   webView.configuration.websiteDataStore.httpCookieStore.setCookie(cookie)}
```

Other features of WKWebView, such as showing progress updates of the URL being loaded, are fairly common these days.

**Bonus**: `ProgressViews` can be updated by listening to the `estimatedProgress` `keyPath` value of the following method:

```
override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?)
```
