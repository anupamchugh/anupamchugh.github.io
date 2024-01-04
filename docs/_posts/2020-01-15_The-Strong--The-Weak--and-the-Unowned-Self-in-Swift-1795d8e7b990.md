---
title: 'The Strong, The Weak, and the Unowned Self in Swift'
description: >-
  Know the three shades of self, how they impact the ARC and, the difference
  between self and Self
date: '2020-01-15T19:22:41.591Z'
categories: []
keywords: []
slug: /@anupamchugh/the-strong-the-weak-and-the-unowned-self-in-swift-1795d8e7b990
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__kL15QEznTdkomlzC.jpg)

A long time ago, in a land far away, the Swift team decided that `self` can have three forms — `strong`, `weak`, or `unowned`. It all depends on the use-case and how much you love or hate memory leaks! In the next few sections, we’ll walk through all three. But before we do that, let's take a step back and look at `self` from a different lens.

### What Is self?

Pick up a mirror and look at it. What did you see? That’s what self is…no, not a reflection, not exactly! `self` is an equivalent form of the instance you’re referring to. Every class and structure have self as an implicit property that refers to itself.

It’s similar to `this` in Java but with the notable difference that Swift’s `self` can be used just about everywhere — Java’s `this` is used only inside an instance method’s scope.

While a self can be applied anywhere to access properties and methods of the class and structure, best practice is to use it only when necessary and omit it otherwise.

Here are two scenarios which require the use of `self.`

### 1\. Differentiating Between Property and Argument Names in Initializers

`self` is crucial for making a distinction between the method parameter and instance property names, in order to prevent ambiguity.

```
class Author{  let name: String  init(name: String) {    self.name = name    }}
```

Omitting `self` in the above case would create ambiguity for the Swift compiler — it would treat both the variables as parameters only.

### 2\. Inside Closures

Referencing properties inside a closure requires explicit use of the `self` property to indicate that you’re capturing the enclosing type’s instance. Swift, being a type-safe language, has brought this design intentionally to indicate that the `self` property won’t be deallocated until the closure occurs.

So, in the previously written `Author` class we’ve added a function that invokes a closure, as shown below:

class Author{  
    
  func greetName(){

DispatchQueue.main.asyncAfter(deadline: .now() + 2) {  
          print(self.name)  
      }  
  }  
}

The Swift compiler would complain if the `name` property is accessed without `self`.

### Strong References

The `self` that we’ve been referring to until now is strong by default. Any property is implicitly marked as strong. Automated Reference Counting (ARC) is responsible for tracking and handling the memory of your application, freeing up space for instances that are no longer used.

ARC will not deallocate an instance as long as it’s holding active references. For example, if two classes are holding strong references to each other it will create a reference cycle, leading to memory leaks.

The following illustration shows an example of a retain cycle where the instances aren’t deallocated:

You can easily end up with such retention cycles when you’re dealing with parent-child relationships in classes like the one above, or in protocols and delegates.

Additionally, we saw that closures capture the self from the enclosing context. What happens when the lifetime of the closure exceeds that of the enclosing class? We’ll discuss that in the next sections where we deal with `weak` and `unowned` references.

### Weak References

To prevent retention cycles, we can mark either one of the references as `weak`, which implies that the relationship isn’t strong. The ARC understands that and doesn’t consider that reference in its retain count thereby allowing it to be deallocated without any inhibitions.

Besides `self`, any property or variable can be set as a weak reference by setting the `weak` keyword on it. During deallocation, the property is marked as nil by ARC. This also suggests that weak references cannot be non-optional.

#### Handling weak self with closures

Closures are designed to capture the properties that it uses from the enclosing scope, be it `self` or any other class/structure references. To prevent retention cycles from being created when the closure lives beyond the lifetime of the enclosing class (and thus keeping a strong reference to the instances) we’ll use capture lists where we can define the type of relationship binding.

A capture list creates a copy of the enclosed property. In the following code snippet, we’ll see how capturing the self as weak saves us from a memory leak:

class Writer {  
    var **myClosure**: (() -> ())?  
    let name: String  
    init(name: String) {  
        self.name = name  
        self.myClosure = {  
            **\[weak self\] in**  
            print("Writer is \\(self**?**.name)")   
        }  
    }  
      
    deinit { print("Writer \\(name) is being deallocated") }  
}

var writer : Writer? = Writer(name: "Anupam")  
writer = nil //this gets deallocated

In the above code, not capturing the self as weak could not allow the instance `writer` to be deallocated and neither of the print statements in the closure would be printed. Ideally, to avoid using `self?` everywhere once it’s weak, we can use a guard statement, as shown below:

self.myClosure = {  
            \[weak self\] in            `**guard let self = self else { return }**`  
            print("Writer is \\(self.name)")   
}

Additionally, we can capture multiple arguments in the square brackets:

\[weak self, weak arg2, unowned arg3\] 

Let’s move onto the final one, `unowned`.

### Unowned References

Unowned references are simply weak references which cannot be marked nil by the ARC**.** Hence all unowned references are **not optional** and should only be used if you’re sure that instance hasn’t been deallocated. It’s critical that you handle unowned references with care. Accessing them when the instance is nil would lead to a crash.

A common use case where you should use unowned over weak is when you want to avoid the use of optional.

### self vs Self

We’ve discussed `self` and its different forms up until now. Besides `self`, which basically is a property, we have another keyword, `Self`, which indicates the type of conforming protocol or of the protocol extension.

The following code demonstrates the use of `Self` and `self` to show how they’re different from each other:

extension String{  
    func greetMe() -> **Self** {  
        return "Hello \\(self)"  
    }  
}

let str = String.greetMe("Anupam")  
str() //prints: Hello Anupam

### Conclusion

Unlike life, using strong references can be detrimental in Swift and cause retention cycles. To handle this, we can mark the references with the `weak` and `unowned` keywords. Any reference type can be marked with these keywords. Things like structures, which are value types cannot be marked as `weak` or `unowned`.

That’s it for this one. I hope you build memory leak-free iOS and macOS applications. Thanks for reading.