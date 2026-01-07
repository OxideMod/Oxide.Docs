---
title: Ex. Grid
after: example-verticallayout
---

# Example CuiGrid

This sample code use CuiGridLayoutGroupComponent with four simple element

```csharp
public const string UIScrollName = "UI.CuiGridMin";

CuiElementContainer createGridMinUI()
{
	CuiElementContainer elements = new CuiElementContainer();

	elements.Add(new CuiElement
	{
		Name = UIScrollName,
		Parent = "Overlay",
		DestroyUi = UIScrollName,
		Components = {
		  new CuiImageComponent { Color = "0 0 0 0.18" },
		  new CuiRectTransformComponent { 
			  AnchorMin = "0.2 0.25", AnchorMax = "0.8 0.75", 
			  OffsetMin = "0 0", OffsetMax ="0 0" 
		  },
		  new CuiGridLayoutGroupComponent { 
			CellSize = "160 64",
			Spacing = "16 16",
			StartCorner = GridLayoutGroup.Corner.UpperLeft,
			StartAxis = GridLayoutGroup.Axis.Horizontal,
			ChildAlignment = TextAnchor.MiddleCenter,
			Constraint = GridLayoutGroup.Constraint.Flexible,
			Padding = "12 12 12 12"
		  }
		}
	});

	elements.Add(new CuiElement
	{
		Name = "G_Item_1",
		Parent = UIScrollName,
		Components =
		{
			new CuiImageComponent { Color = "0.9 0.3 0.3 0.95" },
		}
	});

	elements.Add(new CuiElement
	{
		Name = "G_Item_1_Label",
		Parent = "G_Item_1",
		Components =
		{
			new CuiRectTransformComponent { 
				AnchorMin = "0 0", AnchorMax="1 1", 
				OffsetMin = "8 6", OffsetMax = "-8 -6" 
			},
			new CuiTextComponent {
				Text = "Item 1", 
				FontSize=16, Font="RobotoCondensed-Bold.ttf", 
				Align= TextAnchor.MiddleCenter, 
				Color="1 1 1 1" 
			}
		}
	});

	elements.Add(new CuiElement
	{
		Name = "G_Item_2",
		Parent = UIScrollName,
		Components =
		{
			new CuiImageComponent { Color = "0.3 0.9 0.3 0.95" },
		}
	});

	elements.Add(new CuiElement
	{
		Name = "G_Item_2_Label",
		Parent = "G_Item_2",
		Components =
		{
			new CuiRectTransformComponent {
				AnchorMin = "0 0", AnchorMax="1 1",
				OffsetMin = "8 6", OffsetMax = "-8 -6"
			},
			new CuiTextComponent {
				Text = "Item 2",
				FontSize=16, Font="RobotoCondensed-Bold.ttf",
				Align= TextAnchor.MiddleCenter,
				Color="1 1 1 1"
			}
		}
	});

	elements.Add(new CuiElement
	{
		Name = "G_Item_3",
		Parent = UIScrollName,
		Components =
		{
			new CuiImageComponent { Color = "0.3 0.3 0.9 0.95" },
		}
	});

	elements.Add(new CuiElement
	{
		Name = "G_Item_3_Label",
		Parent = "G_Item_3",
		Components =
		{
			new CuiRectTransformComponent {
				AnchorMin = "0 0", AnchorMax="1 1",
				OffsetMin = "8 6", OffsetMax = "-8 -6"
			},
			new CuiTextComponent {
				Text = "Item 3",
				FontSize=16, Font="RobotoCondensed-Bold.ttf",
				Align= TextAnchor.MiddleCenter,
				Color="1 1 1 1"
			}
		}
	});

	elements.Add(new CuiElement
	{
		Name = "G_Item_4",
		Parent = UIScrollName,
		Components =
		{
			new CuiImageComponent { Color = "0.9 0.9 0.3 0.95" },
		}
	});

	elements.Add(new CuiElement
	{
		Name = "G_Item_4_Label",
		Parent = "G_Item_4",
		Components =
		{
			new CuiRectTransformComponent {
				AnchorMin = "0 0", AnchorMax="1 1",
				OffsetMin = "8 6", OffsetMax = "-8 -6"
			},
			new CuiTextComponent {
				Text = "Item 4",
				FontSize=16, Font="RobotoCondensed-Bold.ttf",
				Align= TextAnchor.MiddleCenter,
				Color="1 1 1 1"
			}
		}
	});

	return elements;
}
```
