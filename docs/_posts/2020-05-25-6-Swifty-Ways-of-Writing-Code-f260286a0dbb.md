---
title: 6 Swifty Ways of Writing Code
date: '2020-05-25T14:50:03.929Z'
categories: []
keywords: []
slug: /swifty-ways-of-writing-code
---

### Use Maps to Safely Unwrap Optionals

Typically, we use the `if let` or `guard let` syntax to safely unwrap optionals in Swift. While that’s all fine, sometimes you wish there was a way without those brackets around — especially when you’re unwrapping a child property. Thankfully, we can unwrap optionals using the map operator.

Optional values passed inside a `map` closure are evaluated only if they contain some value, thereby ensuring it’s not `nil`.

```
guard let user = user else{ return }
let name = user.name
//using map
let name = user.map{$0.name}
//with nil coalescing operator
let nameWithDefault = user.map{$0.name} ?? "NA"
```

Using maps for unwrapping is handy in optional tuples as well. Here’s a Swifty way to do it:

```
func sampleTuple() -> (String, String)?{  
    return nil  
}

let (a, b) = sampleTuple().map { ($0, $1) } ?? ("NA", "NA")

```

### Invoking willSet and didSet at Initialization

In short, `willSet` and `didSet` property observers are not called when the property is first initialized. But you can work around this by wrapping the initialization in a `defer` statement.

Though this approach is a bit _hacky_, as you’d somehow have to set a default value (in the declaration or outside defer), it’s still good to know:

```
struct User {
    var name: String{
        didSet {print("didSet" )}
        willSet {print( "willSet" )}
    }
    init (name: String) {
        defer { self.name = name }
    }
}

let user = User (name: "A")
//prints:
//willSet
//didSet
```

### Using Protocol Extensions for Default Implementations

Swift protocols are powerful, but they don’t let you specify default implementations. The below snippet could be handy at times when you want to avoid overriding the functions.

```
protocol Printer {
    func printMe()
}
extension Printer {
    func printMe() {
        print ("Hello World")
    }
}
class A : Printer {}

var a = A()
a.printMe()
//prints Hello World

```

Moreover, you could use the `where` clause in the extensions to specify protocol implementations for certain constraints only. But make sure you don’t overdo protocol extensions in your codebase.

### Track Changes in Dictionaries Easily

There may come a point where you’d like to know what’s changed in a Swift dictionary (probably for debugging). The tedious way of doing this is by diffing the contents. But there’s a Swifty way of doing this as well. Simply define a subscript on an object that holds that dictionary, as shown below:

```
struct Items{
    private var items: [Int: String] = [:]
    subscript(key: Int) -> String? {
        get{
            return items [key]
        }
        set (newValue){
            items [key] = newValue
            print( "Value for key \(key) has changed" )
        }
    }
}

var items = Items ()
items [1] = "A"
items [2] = "B"
//prints
//Value for key 1 has changed 
//Value for key 2 has changed
```

### Use guard let in Different Scopes

The `guard let` statement uses the safe fail-first approach wherein a `nil` value ensures that you return immediately. But sometimes, using `return` isn’t in our best interest. For instance, you could be in a for loop and only wish to `continue` or `break`. Gladly, you can do this in the following way:

```
let names: [String?] = ["A", nil, "C"]
for i in 0..<names.count {
    guard let name = names[i] else {
        break
    }
    guard names.count > 2 else {
        throw CustomError.limitError
    }
    guard let n = names[i] else {
        continue
    }
}
```

### Use rethrows for Powerful Error Handling

We all know and use the `throws` keyword but rarely leverage the power of `rethrows` in Swift. A function declared with the `rethrows` keyword indicates that it throws an error only if one of its function parameters `throws`.

This means that if the closure parameter doesn’t throw an error, we don’t need to use the different flavors of `try` when calling it. Swift lets us use this elegant way to significantly reduce the boilerplate code. As you can see in the code below, we don’t need to put the same non-throwing version of a function in a `do-catch` block.

```
func nonThrowing() {
    print( "non throwing")
}
extension String: Error {}
func throwFunction() throws {
    throw "An Error"
}
func doSomething(myClosure: () throws -> Void ) rethrows {
    try myClosure()
}


//regular function doSomething myClosure: nonThrowing)
do {
    try doSomething(myClosure:throwFunction)
} catch {
    print( "Catch: \(error)")
    
}
```