---
title: Ex. VerticalLayout
after: basic-cui
---

# Example CuiVerticalLayoutGroup

This sample code use CuiGridLayoutGroupComponent, CuiVerticalLayoutGroupComponent, CuiContentSizeFitterComponent

```csharp
public const string UIScrollName = "UI.CuiVerticalLayoutGroup";

CuiElementContainer createVerticalLayout()
{
	CuiElementContainer elements = new CuiElementContainer();

	elements.Add(new CuiElement
	{
		Name = UIScrollName,
		Parent = "Hud",
		DestroyUi = UIScrollName,
		Components = {
			new CuiRawImageComponent { 
				Sprite = "assets/content/effects/crossbreed/fx gradient skewed.png", 
				Color = "0.3 0.3 0.3 0.8", 
			},
			new CuiRectTransformComponent { 
				AnchorMin = "0.3 0.5", AnchorMax = "0.7 0.92", 
				Pivot = "0.5 1", Rotation = 0 
			},
			new CuiVerticalLayoutGroupComponent
			{
				ChildAlignment = TextAnchor.UpperCenter,
				Spacing = 8f,
				Padding = "3 12 3 12",
				ChildControlHeight = false,
				ChildControlWidth = true,
			},
			new CuiContentSizeFitterComponent()
			{
				VerticalFit = ContentSizeFitter.FitMode.PreferredSize,
				HorizontalFit = ContentSizeFitter.FitMode.Unconstrained,
			}
		}
	});


	for (int i = 0; i < 6; i++)
	{
		elements.Add(new CuiElement
		{
			Name = "Label_" + i,
			Parent = UIScrollName,
			Components = {
				new CuiImageComponent { Color = "0.2 0.2 0.8 0.6"},
				new CuiRectTransformComponent {
					AnchorMin = "0.02 0", AnchorMax = "0.98 0",
					OffsetMin = "0 0", OffsetMax = "0 40"
				},
			}
		});
		
		elements.Add(new CuiElement
		{
			Name = "LabelText_" + i,
			Parent = "Label_" + i,
			Components = {
				new CuiTextComponent {
					Text = $"Text #{i+1}",
					Color = "0.9 0.9 0.9 1.0",
					FontSize = 14,
					Align = TextAnchor.MiddleCenter },
			}
		});
		
	}
	return elements;
}
```
