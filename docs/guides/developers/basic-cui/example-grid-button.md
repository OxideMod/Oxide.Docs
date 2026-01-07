---
title: Ex. Grid of button
after: example-gridmin
---

# Example CuiGrid of button

This sample code use CuiGridLayoutGroupComponent to show a grid of buttons

```csharp
public const string UIScrollName = "gridlayout.cuigrid";

CuiElementContainer createScrollUI()
{
	CuiElementContainer elements = new CuiElementContainer();

	elements.Add(new CuiElement
	{
		Name = UIScrollName,
		Parent = "Overlay",
		DestroyUi = UIScrollName,
		Components = {
			new CuiRawImageComponent { 
				Sprite = "assets/content/effects/crossbreed/fx gradient skewed.png", 
				Color = "0.1 0.1 0.1 1.0", 
			},
			new CuiRectTransformComponent { 
				AnchorMin = "0.3 0.05", AnchorMax = "0.7 0.95",
				Pivot = "0.5 1", Rotation = 0,
			},
			new CuiGridLayoutGroupComponent {
				CellSize = "32 32",
				ChildAlignment = TextAnchor.UpperLeft,
				Constraint = GridLayoutGroup.Constraint.FixedColumnCount,
				ConstraintCount = 8,
				Padding = "12",
				Spacing = "5 5",
				StartAxis = GridLayoutGroup.Axis.Horizontal,
				StartCorner = GridLayoutGroup.Corner.UpperLeft,
			},
			new CuiContentSizeFitterComponent()
			{
				VerticalFit = ContentSizeFitter.FitMode.PreferredSize,
				HorizontalFit = ContentSizeFitter.FitMode.PreferredSize
			},
		}
	});

	for ( int i=0; i<32; i++) 
	{
		elements.Add(new CuiElement
		{
			Name = "TheButton_" + i,
			Parent = UIScrollName, //"Button_" + i,
			Components =
			{
				new CuiButtonComponent { 
					Color = "0.2 0.2 0.7 1.0",
					Command = "ui.testscrollui "+ (i+1), 
					Sprite = "assets/icons/blueprint.png",
					HighlightedColor = "0.2 0.7 0.3 0.3", 
					PressedColor = "0.1 0.9 0.1 0.8",
				},
			}
		});

		elements.Add(new CuiElement
		{
			Name = "ButtonText_" + i,
			Parent = "TheButton_" + i,
			Components =
			{
				new CuiTextComponent {
					Text = $"Button#{i+1}",
					Color = "0.95 0.95 0.95 1.0",
					FontSize = 10,
					Align = TextAnchor.MiddleCenter
				},
			}
		});
	}
	return elements;
}
```

