---
title: Pooling
after: data-storage
---

# Pooling

## Reducing allocations and garbage collections with pooling

A pool provides a repository of active and ready-made objects that may be obtained upon request and freed back to the pool after they are no longer needed.

The purpose of pooling is to reduce memory footprint and the number of cycles normally associated with constructing and destroying objects.

Normally when an object is instantiated, memory must be allocated for that object and when the object is no longer needed it is marked for destruction. An object marked for destruction it is not destroyed immediately, instead it sits in memory until the garbage collector destroys the object later.

```csharp
var objectArray = new object[2];
var anotherObjectArray = new object[2];
```

The above code will create two object arrays which must be garbage collected. In contrast, the following code will only create one object array and is not garbage collected.
This is just an example as Oxide.Core.ArrayPool is marked obsolete

```csharp
	// Note that Oxide.Core.ArrayPool is obsolete
	object[] objectArray = ArrayPool.Get(2);
	ArrayPool.Free(objectArray);

	object[] anotherObjectArray = ArrayPool.Get(4);
	ArrayPool.Free(anotherObjectArray);
```

In the case where a program must create a lot of objects, the garbage collector may in-fact represent a significant and typically unavoidable performance bottleneck. Pooling provides a relatively easy way around this bottleneck by avoiding memory allocations and garbage collections altogether.

## Facepunch.Pool (Rust)

The Facepunch.Pool implementation is specific to the game Rust.
Facepunch pooling is divided on three types of object `<T>` or collections of objects.

- Object or collections of objects derived from IPooled
- Collections of object not derived from IPooled
- Collections of objects not part of the two previous cases.

## Pooling of IPooled derived object

`Get<T>()` and `Free<T>(ref T obj)` / `Free<T>(ref ICollection<T> obj)`

Where ICollection is one of : `List<T>, HashSet<T>, BufferList<T>, Queue<T>, ListHashSet<T>, Dictionnary<T>, ListDictionary<T>` and `<T>` is derived from IPooled

example with Item, derived from IPooled :

```csharp
var itemList = Pool.Get<List<Item>>();
player.inventory.GetAllItems(itemList);
// Do some stuff with itemList
Pool.Free(ref itemList);
```

## Pooling of non-IPooled derived object

`Get<T>()` and `FreeUnmanaged<T>(ref ICollection<T> obj)`

Where ICollection is one of : `MemoryStream, StringBuilder, Stopwatch, List<T>, HashSet<T>, BufferList<T>, Queue<T>, ListHashSet<T>, Dictionnary<T>, ListDictionary<T>`

example with DieselEngine :

```csharp
List<DieselEngine> engineList = Pool.Get<List<DieselEngine>>();
Vis.Entities<DieselEngine>(position, 20f, engineList, -1);
// Do some stuff with engine
Pool.FreeUnmanaged(ref engineList);
```

## Pooling of other objects

`Get<T>()` and `FreeUnsafe<T>(ref T obj)`

```csharp
Stack<BaseOven> ovenStack = Pool.Get<Stack<BaseOven>>();
// Do some stuff with ovenStack
Pool.FreeUnsafe(ref ovenStack);
```

### Using try / finally

It is important to ensure that when an object or ICollection is obtained from a pool that it is freed back to that (same) pool. This can be difficult when exceptions are thrown by any code in-between.

If there is any chance that an exception may be thrown, wrap the code with a "try/finally" block to ensure the code within the "finally" is always executed no matter the outcome.

```csharp
// Obtain an StringBuilder
StringBuilder sb = Pool.Get<StringBuilder>();

try
{
	throw new System.Exception("Oh no!");
	return sb.ToString();
}
finally
{
	Pool.FreeUnmanaged(ref sb);
}
```

### Reset

When using `Pool.Free<T>`, `Pool.FreeUnmanaged<T>` or `Pool.FreeUnsafe<T>`, the object freed back to the pool will reset to `obj = default(T);` and `ICollection` will be cleared. When the object is used again, it will not contain previous data.
