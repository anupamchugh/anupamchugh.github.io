---
title: Lesser-Known WKWebView Features
date: '2019-11-05T14:27:31.457Z'
categories: []
keywords: []
slug: /lesser-known-ios-wkwebview-features
---

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