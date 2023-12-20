---
url: https://medium.com/@anupamchugh/a-nightmare-with-shared-preferences-and-stringset-c53f39f1ef52
canonical_url: https://medium.com/@anupamchugh/a-nightmare-with-shared-preferences-and-stringset-c53f39f1ef52
title: A Nightmare With Shared Preferences and StringSet
subtitle: I love using Shared Preferences to cache data just about everywhere in my
  Android Applications. Little did I know that storing values in a…
slug: a-nightmare-with-shared-preferences-and-stringset
description: StringSet and SharedPreferences in Android. Always create a copy of the
  StringSet otherwise you’ll get inconsistent behaviour
tags:
- android
- sharedpreferences
- java
- mobile
- android-app-development
author: Anupam Chugh
username: anupamchugh
---

![Don’t stare at your code for too long.][image_ref_MSpMbUJEOU9hUkFKUG5CWUJvWnd5Wk13LmpwZWc=]

# A Nightmare with Shared Preferences and StringSet

I love using Shared Preferences to cache data just about everywhere in my Android Applications. Little did I know that storing values in a Set of Strings would turn into a nightmare.

To cut the story short — for saving strings and most of the other data types in Shared Preferences we use the following code:

```
mSharedPreferences.editor().putString(“Key”,”value”).apply();
```

And to retrieve we simply use the get methods:

```
mSharedPreferences.getString("key","defaultValue");
```

I used the same approach to save content from Notifications created within my application in order to build the Notifications again when the device is rebooted. It looked so simple:

```
Set<String> sets = new HashSet<>();
sets.add("notification title 1");
```

```
mSharedPreferences.edit().putStringSet("keySet",sets).apply();
```

```
//And to add another local notification:
```

```
sets = mSharedPreferences.getStringSet("keySet",new HashSet<String>());
```

```
sets.add("notification title 2");
```

```
mSharedPreferences.edit().putStringSet("keySet",sets).apply();
```

It worked absolutely fine when I added and removed more such data from the Shared Preferences. As soon as I rebooted my testing device. **BOOM!**

Just a single String value was present in the `SharedPreferences`.

**WHY SO?**

As mentioned in the documentation:

> You *must not* modify the set instance returned by the **getStringSet** call. The consistency of the stored data is not guaranteed if you do, nor is your ability to modify the instance at all.

# Workaround

Create a copy of `Set<String>` every time the `getStringSet` returns that instance using:

```
Set<String> newSet = new HashSet<String>(mSharedPrefs.getStringSet("keySet", new HashSet<String>()));
```

This can save you some precious hours which you’d otherwise spend scratching your head.

Reference: [This StackOverflow Post](https://stackoverflow.com/a/14034804/3849039)


[image_ref_MSpMbUJEOU9hUkFKUG5CWUJvWnd5Wk13LmpwZWc=]: data:image/jpeg;base64,
