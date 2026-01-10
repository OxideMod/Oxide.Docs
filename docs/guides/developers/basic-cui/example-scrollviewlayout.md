---
title: Ex. Scrollview with layout
after: example-scrollview
---

# Example ScrollView with LayoutGroup+SizeFitter {#ScrollView2-code}

This sample code use CuiScrollViewComponent but with a small twist, to use with CuiVerticalLayoutGroupComponent and CuiContentSizeFitterComponent.
Also use the `Update` flag to modify existing component created by the VerticalLayoutGroup component

```csharp
public const string UIScrollName = "UI.Scrolltest";

CuiElementContainer createScrollUI()
{
	CuiElementContainer elements = new CuiElementContainer();

	string mainpanel = elements.Add(new CuiPanel
	{           
		Image = { Color = "0.3 0.3 0.6 0.8" },
		RectTransform = { 
			AnchorMin = "0.5 0.5", AnchorMax = "0.5 0.5", 
			OffsetMin = "-200 -300", OffsetMax = "200 300" 
		},
	}, "Overlay", UIScrollName, UIScrollName);

	elements.Add(new CuiElement
	{
		Name = "panel1",
		Parent = UIScrollName,
		Components =
			{
				new CuiRawImageComponent { 
					Sprite = "assets/content/effects/crossbreed/fx gradient skewed.png", 
					Color = "0.1 0.81 0.1 0.7" 
				},
				new CuiRectTransformComponent { 
					AnchorMin = "0.015 0.015", AnchorMax = "0.985 0.985",
					OffsetMax = "0 -50",
				}
			}
	});

	elements.Add(new CuiElement
	{
		Parent = UIScrollName,
		Components =
			{
				new CuiTextComponent { 
					Text = "Vertical scroll example", 
					FontSize=12, 
					Align=TextAnchor.MiddleCenter 
				},
				new CuiRectTransformComponent { 
					AnchorMin = "0 1", AnchorMax = "1 1", 
					OffsetMin = "0 -50", OffsetMax = "0 0" 
				}
			}
	});

	elements.Add(new CuiButton
	{
		Button = { 
			Color = "0.8 0.2 0.2 0.8", 
			Command = "closescroll" 
		},
		RectTransform = { 
			AnchorMin = "0.91 0.93", AnchorMax = "0.98 0.98" 
		},
		Text = { 
			Text = "Close", 
			FontSize = 8, 
			Align = TextAnchor.MiddleCenter }
	}, mainpanel);


	elements.Add(new CuiElement
	{
		Name = "Scroller",
		Parent = "panel1",
		Components = {
			new CuiNeedsCursorComponent(),

			new CuiRawImageComponent {
				Sprite = "assets/content/effects/crossbreed/fx gradient skewed.png", Color = "0.15 0.25 0.25 0.8"
			},

			new CuiScrollViewComponent {                    
				ContentTransform = new CuiRectTransform { 
					AnchorMin = "0 0.98", AnchorMax = "1 0.98", 
					OffsetMin = "0 -800", OffsetMax = "0 0",
					Pivot = "0.5 1",
				},

				Vertical = true,
				Horizontal = false,
				MovementType = ScrollRect.MovementType.Clamped, //Unrestricted, Elastic, Clamped,
				Elasticity = 0.25f,
				Inertia = true,
				DecelerationRate = 0.3f,
				ScrollSensitivity = 24f,                   
				
				VerticalScrollbar = new CuiScrollbar { 
					AutoHide = true, Size = 20 
				},
			},

			new CuiRectTransformComponent {
				AnchorMin = "0 0", AnchorMax = "1 1",
				Pivot = "0.5 1",
			},
		}
	});

	// This section apply the VerticalLayoutGroup to the content panel instead of the CuiScrollViewComponent
	// Info come from Facepunch  CommunityEntity.UI.cs file on github
	// Enable/Disable the following section to see behaviour change of the ScrollView
#if true
	elements.Add(new CuiElement
	{
		Name = "Scroller" + "___Content",
		//Name = "Scroller" + "___Viewport", 
		Update = true, // update instead of overwrite
		Components = {
			new CuiVerticalLayoutGroupComponent
			{
				ChildAlignment = TextAnchor.UpperCenter,
				Spacing = 5f,
				ChildControlHeight = false,
				ChildControlWidth = true,
				ChildForceExpandHeight = false,
				ChildForceExpandWidth = false,
				ChildScaleHeight = false,
				ChildScaleWidth = false,
				Padding = "5",
			},
			
			new CuiContentSizeFitterComponent
			{
				VerticalFit = ContentSizeFitter.FitMode.PreferredSize,   // Unconstrained, MinSize, PreferredSize
				HorizontalFit = ContentSizeFitter.FitMode.Unconstrained,
			},
		}
	});
#endif

	// use large spacing in example to show effect of VerticalLayoutGroup and CuiContentSizeFitterComponent
	int buttonSpacing = 30;
	int buttonSize = 20;
  
	for ( int i=0; i<30; i++) 
	{
		var offsetMin = -i * buttonSpacing - buttonSize;
		var offsetMax = -i * buttonSpacing;

		elements.Add(new CuiElement
		{
			Name = "Scroller_" + i,
			Parent = "Scroller",
			Components =
			{
				new CuiImageComponent { Color = "0.1 0.1 0.1 0.3"},
				new CuiRectTransformComponent { 
					AnchorMin = "0.002 0.998", AnchorMax = "0.998 0.998", 
					OffsetMin = $"0 {offsetMin}", OffsetMax = $"0 {offsetMax}"
				},
				new CuiOutlineComponent { Distance= "2 2", Color= "0 0 0 0.06" },
				new CuiOutlineComponent { Distance= "4 4", Color= "0 0 0 0.025" },
			}
		});

		elements.Add(new CuiElement
		{
			Name = "Text_" + i,
			Parent = "Scroller_" + i,
			Components = {
				new CuiImageComponent { 
					Color = "0.2 0.2 0.2 1.0", 
					Sprite = "Assets/Content/UI/UI.Background.Tile.psd",
					ImageType = Image.Type.Tiled,
				},
				new CuiRectTransformComponent { 
					AnchorMin = "0 0", AnchorMax = "0.7 1"
				},
				new CuiOutlineComponent { 
					Distance= "2 2", 
					Color= "0 0 0 0.06" 
				},
				new CuiOutlineComponent { 
					Distance= "4 4", 
					Color= "0 0 0 0.025" 
				},
			}
		});

		elements.Add(new CuiElement
		{
			Parent = "Text_" + i,
			Components =
			{
			new CuiTextComponent { 
				Text = $"Item #{i+1}", 
				Color = "0.95 0.95 0.95 1.0", 
				FontSize = 10, 
				Align = TextAnchor.MiddleLeft },          
			}
		});

		elements.Add(new CuiElement
		{
			Name = "Button_" + i,
			Parent = "Scroller_" + i,
			Components =
			{
			new CuiImageComponent { 
				Color = "0.2 0.2 0.2 1.0", 
				Sprite = "Assets/Content/UI/UI.Background.Tile.psd",
				ImageType = Image.Type.Tiled,
			},
			new CuiRectTransformComponent { 
				AnchorMin = "0.72 0", AnchorMax = "1 1", 
			},
			new CuiOutlineComponent { 
				Distance= "2 2", 
				Color= "0 0 0 0.06" }
			}
		});

		elements.Add(new CuiElement
		{
			Name = "TheButton_" + i,
			Parent = "Button_" + i,
			Components =
			{
				new CuiButtonComponent { Color = "0.8 0.2 0.2 0.8", Command = "ui.testscrollui "+ (i+1), ImageType= Image.Type.Tiled },
				new CuiRectTransformComponent { AnchorMin = "0.02 0.02", AnchorMax = "0.98 0.98" },
				new CuiOutlineComponent { Distance= "2 2", Color= "0 0 0 0.50" },
			}
		});

		elements.Add(new CuiElement
		{
			Name = "ButtonText_" + i,
			Parent = "TheButton_" + i,
			Components =
			{
			new CuiTextComponent { Text = $"Button#{i+1}", Color = "0.95 0.95 0.95 1.0", FontSize = 10, Align = TextAnchor.MiddleCenter },
			new CuiRectTransformComponent { AnchorMin = "0.02 0.02", AnchorMax = "0.98 0.98"},
			}
		});
	}
	return elements;
}
```

