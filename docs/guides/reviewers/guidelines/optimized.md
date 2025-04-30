---
title: Optimized for performance
after: revert-on-unload
---

# Optimized for performance

1. The plugin must be optimised and steps should be taken to minimise the impact of expensive operations.

## Explanation

This guideline requires all plugins to be optimised for performance so that the plugin can run smoothly on both high and low population servers.

Some indicators of poor optimisation and performance risks are:

### Slow methods

Developers should avoid using slow methods like `FindObjectsOfType<T>()`. There are often much faster alternatives and if used too frequently, can cause massive lag on the server. However, if slow methods must be used, they should be kept to a minimum. Ideally once on plugin load to store the data the plugin needs and then never again.

### Data files

Developers should consider how much data they are going to be storing when using data files. Plugins should be designed to work smoothly on high population servers where there are likely to be a high volume of unique players, which can mean storing large amounts of data.

If the plugin is likely to be storing large amounts of data, then the developer should use a database, proto storage or split the data into multiple files to reduce write times.

Furthermore, it would be a good idea to only save data when it is changed, rather than saving all the data at every opportunity. For example, you do not need to save player A's data when you only changed player B's data.

### Heap allocations

Developers should avoid frequent heap allocations since this puts more, unnecessary pressure on the garbage collector. The developer should utilise pooling when objects are frequently created and destroyed and use a `StringBuilder` when generating strings at runtime.

Something to look out for is frequent usage of the LINQ library. While this library can be useful in creating shorter and more readable code, it can create a lot of heap allocations behind the scenes so its usage should be kept to a minimum.

### Frequently called hooks

Developers should avoid using hooks that are called frequently unless it is absolutely necessary. If the plugin requires a frequently called hook, then there should be some logic in place that dynamically subscribes and unsubscribes from the hook so the plugin is only subscribed when it is needed.

### Caching

Frequently used objects should be stored in variables or data structures (like lists or dictionaries) for quick access, especially if the means to find these objects use slow methods.

### Slow features

Some features are naturally more taxing on performance than others. Some features, whether it be with limitations with modding APIs or limitations with game networking etc., are poor for performance and there is no other way around it.

If this is the case, the developer should implement additional restrictions (such as cooldowns) to prevent servers from stalling or crashing due to misconfiguration or abuse by players or moderators.
