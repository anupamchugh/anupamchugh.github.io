---
title: 'Don’t Use Boolean Arguments, Use Enums'
date: '2020-04-28T18:42:00.360Z'
categories: []
keywords: []
slug: /dont-use-boolean-arguments-use-enums
---

#### A case for avoiding flag values in your code
***


Booleans are the first data type any programmer learns. And why not? They’re the simplest of the lot with only two states: a `true` and a `false`.

While it’s tempting to use boolean flag values in your codebases for managing state machines, it can easily lead to code complexity, readability, and scalability issues as your code evolves.

Generally, flag arguments divide a function’s logic, forcing it to do more than one thing based on the value. This can lead to tangled implementations in business logic. Your codebase could easily end up with the following tree structure:

![Image](/assets/screenshots/boolean-enum-case-diagram.png)

### Backstory

Let me take you through a story to highlight the weaknesses of boolean arguments in state machines and function arguments.

A group of software developers was once building a module that manages the user’s state. One of them insisted on using booleans since the requirement had only two states: `ONLINE` and `OFFLINE`. Despite the majority not fully agreeing with the proposal, they went ahead since it looked quick, easy, and straightforward.

Eventually, functions like the one below started creeping up in their codebase:

```
func setUserState(isUserOnline : Bool)

Soon, a new developer joined the team and wondered what the following statement really means:

setUserState(true) //The new guy just kept staring at this.
```

While the others proposed a better function name (`setUserOnline`) and it looked fine at first, things became a nightmare once a new business requirement came in for including another user state: `BLOCKED`. They had a few possible ways to include the new state in the codebase. Let’s explore them, see how they affect the code, and how to ultimately overcome this problem.

### The Three-State Boolean Problem

A boolean generally represent two states. But in some languages (like Java, by using `Boolean` object), we can use `null` for assigning the third state. So in our context, `BLOCKED` would be set to `null`. While this may seem to accommodate the new user state without the need for additional booleans, we can easily end up with `NullPointerExceptions`.

Moreover, in a different scenario, it could get tricky to differentiate `false` from `null`. For example, a boolean property `game.isPlaying` when `true` clearly indicates that the game is in play mode. But what happens when it’s `false` or `null`? Does `false` indicate that the game is paused or stopped?

As you can see, `false` doesn’t hold enough information for us to easily identify and recall the state it was bound with. A three-state boolean value only complicates our logic.

Additionally, what happens when we’re asked to include another state called `EXPIRED`? Clearly, we cannot go ahead with this approach since we now have four states. So let’s look at the other approach that the bunch of developers applied.

### Multiple Booleans Bring Hidden Dependencies

The developers eventually expanded the previous function’s signature by slapping two boolean parameters for the new states:

```
func setUserState(   
isUserOnline : Bool,   
isUserBlocked : Bool,  
isUserExpired : Bool)
```

What looks like a simple extension to fulfill a business requirement has unwillingly introduced hidden dependencies and a lot of new combinations in the codebase.

The two hidden dependencies created are `isUserOnline` — `isUserExpired` and `isUserOnline` — `isUserBlocked`. This has now forced us to explicitly manage the extra conditions to avoid conflicting states. For example, a user who is blocked/expired cannot be online. Here’s an example of two conflicting states you need to handle:

1. `isUserOnline`: false and `isUserExpired`: true

2. `isUserOnline`: false and `isUserBlocked`: true

As you add more states, functions can easily turn into a long list of parameters. Things become unsustainable, as you’d end up with lots of `&&` ,`||`, and other complex branching logic to handle mutually exclusive and dependent booleans.

### Booleans Have Type Safety and Readability Issues

By using multiple boolean values, there’s also a high chance of mixing them up. You could end up passing a wrong value (perhaps from a different object) and the compiler won’t even complain. This can be a nightmare when refactoring and doing code reviews, as you’d need to write a lot of unit tests to catch such issues.

Besides, it’s easy to lose track of what the `false` or `true` value actually implies for the boolean variable. Understanding function calls that are full of boolean values, like the one shown below, only gets difficult:

```
setUserState(true, false, false)
```

One could argue that a lot of programming languages today support named arguments that improve the readability of functions. But then again, you could accidentally pass an inverse or incorrect boolean value and the function signature would still match.

The bunch of software developers from the story could have avoided these hassles if they’d used enums instead of booleans.

### Prefer Enums and Avoid Booleans

An enumerator is a data type consisting of a set of named values that can be used in a type-safe way. While it may not look as simple as a boolean, using an enum or other user-defined type helps us avoid setting up complicated if statements with multiple branches.

```
enum UserStates{

case active  
case inactive  
case blocked  
case expired

}
```

Let’s look at the benefits an enum brings to the table when managing finite states and function signatures.

#### 1\. Enums are clear and descriptive

Enums force you to name all states, which makes it easy to understand what they mean — thereby creating a self-documenting code. Also, enums clearly indicate that the values are mutually exclusive, thereby removing doubts of conflicting states. Passing enums as parameters in functions is much clearer and helps us avoid mystery booleans. Just compare the two lines below:

```
setUserState(true, false, false)

//The version below is more concise and clearer.
setUserState(UserStates.active)
```

#### 2\. Enums make scaling and refactoring easier

It’s easier to expand the set of values in enumerators because, unlike with a boolean, the number of possible state combinations doesn’t double with every new case. Moreover, a lot of compilers are smart enough to indicate the changes you need to make to accommodate the new enum case. For example, Swift would raise an error. At the same time, in other languages, it’s easy to look up all the cases present in an enum.

Extending an already existing enum with an additional new case requires minimal effort since the data type remains the same. This makes refactoring a whole lot easier.

#### 3\. Enums are type-safe

With enums, you cannot assign any value besides the specified ones because they are type-safe. This makes it impossible to accidentally swap values or pass an invalid state because the compiler would spot it.

Not all languages have native enum support and you could create custom types in such cases. For example, in JavaScript, we can work around this by “freezing” constants in an object:

```
const UserState = {
   ACTIVE: 1,
   INACTIVE: 2,
   BLOCKED: 3,
   EXPIRED: 4
};
Object.freeze(UserState);
```

### Closing Thoughts

Remember, booleans aren’t bad. It’s completely fine to use them in function arguments if you’re sure the states are binary and mutually exclusive or when the method name already describes it (like with `setEnabled(true)`). But more often than not, requirements change and new states are added.

A two-element enum is worth the effort and is a safer bet than boolean flags. Enums help future-proof your code and eliminate the need to track boolean fields.

Booleans are the simplest, but they can be easily misused — or rather abused.

That’s it for this one. Thanks for reading.