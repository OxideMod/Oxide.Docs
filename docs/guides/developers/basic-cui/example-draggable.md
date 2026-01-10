---
title: Ex. Draggable
after: example-grid-button
---

# Example CuiDraggable

This sample code use CuiDraggableComponent adaptation of Facepunch Draggable demo

```csharp
public const string UIScrollName = "UI.draggable.test";

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
				Color = "0.04 0.04 0.04 0.99",
				Sprite = "Assets/Content/UI/UI.Background.Tile.psd",
			},
			new CuiRectTransformComponent {
				AnchorMin = "0 0", AnchorMax = "1 1",
			},
			new CuiNeedsCursorComponent { }
		}
	});

	elements.Add(new CuiElement
	{
		Name =  "Container1",
		Parent = UIScrollName,
		Components = {
			new CuiRawImageComponent {
				Color = "0.15 0.15 0.15 0.7",
				Sprite = "Assets/Content/UI/UI.Background.Tile.psd",
			},
			new CuiRectTransformComponent {
				AnchorMin = "0.5 1", AnchorMax = "0.5 1",
				OffsetMin = "-620 -340", OffsetMax = "-220 -20",
			},
			new CuiOutlineComponent {
				Distance = "2 2",
				Color = "0 0 0 0.1",
			},
			new CuiOutlineComponent {
				Distance = "4 4",
				Color = "0 0 0 0.05",
			},
		}
	});

	elements.Add(new CuiElement
	{
		Name = "Container1_bg",
		Parent = "Container1",
		Components = {
			new CuiImageComponent {
				Sprite = "assets/content/effects/crossbreed/fx gradient skewed.png",
				Color = "0.25 0.05 0.05 0.2",
			},
			new CuiRectTransformComponent {
				OffsetMax = "0 0",
			},
		}
	});

	elements.Add(new CuiElement
	{
		Parent = "Container1",
		Components = {
			new CuiRectTransformComponent {
				OffsetMin = "35 5",
				OffsetMax = "-35 -5",
			},
			new CuiTextComponent {
				Text = "''type'': ''Draggable'',",
				Color = "0.6 0.6 0.6 0.3",
				FontSize = 24,
				Align = TextAnchor.UpperLeft,
			}
		}
	});

	elements.Add(new CuiElement
	{
		Name = "drag1",
		Parent = "Container1",
		Components = {
			new CuiImageComponent {
				Sprite = "assets/content/ui/gradient-circle.png",
				Color = "1 0.7 0.7 1",
			},
			new CuiRectTransformComponent {
				AnchorMin = "0.5 0.5",
				AnchorMax = "0.5 0.5",
				OffsetMin = "-50 -50",
				OffsetMax = "50 50",
			},
			new CuiDraggableComponent {
			},
			new CuiOutlineComponent {
				Distance = "2 2",
				Color = "0 0 0 0.06",
			},
			new CuiOutlineComponent {
				Distance = "4 4",
				Color = "0 0 0 0.025",
			}
		}
	});

	elements.Add(new CuiElement
	{
		Parent = "drag1",
		Components = {
			new CuiImageComponent {
				Sprite = "assets/content/ui/gameui/mlrs/mlrs_target_circle_fade.png",
				Color =  "0.6 1 1 0.1",
			}
		}
	});

	elements.Add(new CuiElement
	{
		Parent = "drag1",
		Components = {
			new CuiTextComponent {
				Text = "Draggable",
				Color = "0.6 0.6 0.6 1.0",
				FontSize = 20,
				Align = TextAnchor.MiddleCenter,
			}
		}
	});

	// --------------------------------------------------------
	
	elements.Add(new CuiElement 
	{ 
		Name = "Container2",
		Parent = UIScrollName,
		Components = {
			new CuiRawImageComponent {
				Color = "0.15 0.15 0.15 0.7",
				Sprite = "Assets/Content/UI/UI.Background.Tile.psd",
			},
			new CuiRectTransformComponent {
				AnchorMin = "0.5 1",
				AnchorMax = "0.5 1",
				OffsetMin = "-200 -340",
				OffsetMax = "200 -20",
			},
			new CuiOutlineComponent {
				Distance = "2 2",
				Color = "0 0 0 0.1",
			},
			new CuiOutlineComponent {
				Distance = "4 4",
				Color = "0 0 0 0.05",
			}
		}
	});

	elements.Add(new CuiElement
	{
		Name = "Container2_bg",
		Parent = "Container2",
		Components = {
			new CuiImageComponent {
				Sprite = "assets/content/effects/crossbreed/fx gradient skewed.png",
				Color = "0.25 0.05 0.05 0.2",
			},
			new CuiRectTransformComponent {
				OffsetMax = "0 0",
			}
		}
	});

	elements.Add(new CuiElement
	{
		Name = "Container2_circle",
		Parent = "Container2",
		Components = {
			new CuiImageComponent {
				Sprite = "assets/content/ui/gameui/mlrs/mlrs_dotted_circle.png",
				Color = "1 1 1 0.2",
			},
			new CuiRectTransformComponent {
				AnchorMin = "0.5 0.5",
				AnchorMax = "0.5 0.5",
				OffsetMin = "-100 -150",
				OffsetMax = "100 50",
			}
		}
	});

	elements.Add(new CuiElement
	{
		Parent = "Container2",
		Components = {
			new CuiRectTransformComponent {
				OffsetMin = "35 5",
				OffsetMax = "-35 -5",
			},
			new CuiTextComponent {
				Text = "''type'': ''Draggable'',                                                ''maxDistance'': 100.0,                         ''dropAnywhere'': false",
				Color = "0.6 0.6 0.6 0.3",
				FontSize = 24,
				Align = TextAnchor.UpperLeft,
			}
		}
	});

	elements.Add(new CuiElement
	{
		Name = "drag2",
		Parent = "Container2",
		Components = {
			new CuiImageComponent {
				Sprite = "assets/content/ui/gradient-circle.png",
				Color = "1 0.7 0.7 1",
			},
			new CuiRectTransformComponent {
				AnchorMin = "0.5 0.5",
				AnchorMax = "0.5 0.5",
				OffsetMin = "-50 -100",
				OffsetMax = "50 0",
			},
			new CuiDraggableComponent {
				MaxDistance = 100,
				DropAnywhere = false,
			},
			new CuiOutlineComponent {
				Distance = "2 2",
				Color = "0 0 0 0.06",
			},
			new CuiOutlineComponent {
				Distance = "4 4",
				Color = "0 0 0 0.025",
			}
		}
	});
	
	elements.Add(new CuiElement
	{
		Parent = "drag2",
		Components = {
			new CuiImageComponent {
				Sprite = "assets/content/ui/gameui/mlrs/mlrs_target_circle_fade.png",
				Color = "0.6 1 1 0.1",
			}
		}
	});        

	elements.Add(new CuiElement
	{
		Parent = "drag2",
		Components = {
			new CuiTextComponent {
				Text = "Draggable",
				Color = "0.6 0.6 0.6 1.0",
				FontSize = 20,
				Align = TextAnchor.MiddleCenter,
			}
		}
	});

	// --------------------------------------------------------

	elements.Add(new CuiElement
	{
		Name = "Container3",
		Parent = UIScrollName,
		Components = {
			new CuiRawImageComponent {
				Color = "0.15 0.15 0.15 0.7",
				Sprite = "Assets/Content/UI/UI.Background.Tile.psd",
			},
			new CuiRectTransformComponent {
				AnchorMin = "0.5 1",
				AnchorMax = "0.5 1",
				OffsetMin = "220 -340",
				OffsetMax = "620 -20",
			},
			new CuiOutlineComponent {
				Distance = "2 2",
				Color = "0 0 0 0.1",
			},
			new CuiOutlineComponent {
				Distance = "4 4",
				Color = "0 0 0 0.05",
			}
		}
	});

	elements.Add(new CuiElement
	{
		Name = "Container3_bg",
		Parent = "Container3",
		Components = {
			new CuiImageComponent {
				Sprite = "assets/content/effects/crossbreed/fx gradient skewed.png",
				Color = "0.25 0.05 0.05 0.2",
			},
			new CuiRectTransformComponent {
				OffsetMax = "0 0",
			},
		}
	});

	elements.Add(new CuiElement
	{
		Parent = "Container3",
		Components = {
			new CuiRectTransformComponent {
				OffsetMin = "35 5",
				OffsetMax = "-35 -5",
			},
			new CuiTextComponent {
				Text = "''type'': ''Draggable'',                                                ''limitToParent'': true",
				Color = "0.6 0.6 0.6 0.3",
				FontSize = 24,
				Align = TextAnchor.UpperLeft,
			}
		}
	});

	elements.Add(new CuiElement
	{
		Name = "drag3",
		Parent = "Container3",
		Components = {
			new CuiImageComponent {
				Sprite = "assets/content/ui/gradient-circle.png",
				Color = "1 0.7 0.7 1",
			},
			new CuiRectTransformComponent {
				AnchorMin = "0.5 0.5", AnchorMax = "0.5 0.5",
				OffsetMin = "-50 -50", OffsetMax ="50 50",
			},
			new CuiDraggableComponent {
				LimitToParent = true,
			},
			new CuiOutlineComponent {
				Distance = "2 2",
				Color = "0 0 0 0.06",
			},
			new CuiOutlineComponent {
				Distance ="4 4",
				Color = "0 0 0 0.025",
			}
		}
	});

	elements.Add(new CuiElement
	{
		Parent = "drag3",
		Components = {
			new CuiImageComponent {
				Sprite = "assets/content/ui/gameui/mlrs/mlrs_target_circle_fade.png",
				Color = "0.6 1 1 0.1",
			},
		}
	});

	elements.Add(new CuiElement
	{
		Parent = "drag3",
		Components = {
			new CuiTextComponent {
				Text = "Draggable",
				Color = "0.6 0.6 0.6 1.0",
				FontSize = 20,
				Align = TextAnchor.MiddleCenter,
			}
		}
	});

	return elements;
}
```
