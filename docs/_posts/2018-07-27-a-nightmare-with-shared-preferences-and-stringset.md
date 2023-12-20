# A Nightmare with Shared Preferences and StringSet

I love using Shared Preferences to cache data just about everywhere in my Android Applications. But little did I know that storing values in a Set of Strings would turn into a nightmare.

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

It worked absolutely fine when I added and removed more such data from the Shared Preferences. As soon as I rebooted my testing device. **BOOM!** Just a single `String` value was present in the `SharedPreferences`.

**WHY SO?**

As mentioned in the documentation:

> You *must not* modify the set instance returned by the **getStringSet** call. The consistency of the stored data is not guaranteed if you do, nor is your ability to modify the instance at all.

# Workaround

Referring this [StackOverflow answer](https://stackoverflow.com/a/14034804/3849039) tells us to create a copy of `Set<String>` every time the `getStringSet` returns that instance using:

```
Set<String> newSet = new HashSet<String>(mSharedPrefs.getStringSet("keySet", new HashSet<String>()));
```

This can save you some precious hours which you’d otherwise spend scratching your head.
