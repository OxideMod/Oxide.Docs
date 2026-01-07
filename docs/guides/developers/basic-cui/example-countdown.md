---
title: Ex. Countdown + Update
after: example-scrollviewlayout
---

# Example CuiCountdownComponent with update and ActiveSelf {#CuiCountdownComponent-code}

This sample code implement a CuiCountdownComponent and at the end of the count, update some of the CUI element from the existing.

```csharp
private void TestUi(BasePlayer player)
{
	CuiElementContainer elements = new CuiElementContainer();

	elements.Add(new CuiElement
	{
		Name = "UI_CountDown",
		Parent = "Overall",
		Components = {
			new CuiImageComponent {
			  Sprite = "Assets/Content/UI/UI.Background.Tile.psd",
			  Material = "assets/content/ui/uibackgroundblur-ingamemenu.mat",
			  Color = "0 0 0 0.85",
			},
			new CuiRectTransformComponent {
				AnchorMin = "0.30 0.6", AnchorMax = "0.7 0.9" ,
			},
			new CuiNeedsCursorComponent(),
		}
	});

	elements.Add(new CuiButton
	{
		Button = {
				Color = "0.8 0.2 0.2 0.8",
				Command = "closeupdate"
			},
		RectTransform = {
				AnchorMin = "0.91 0.90", AnchorMax = "0.98 0.98"
			},
		Text = {
				Text = "Close",
				FontSize = 8,
				Align = TextAnchor.MiddleCenter
			},
	}, "UI_CountDown", "UICloseButton");

	// Hide close button by default
	// Note that CuiButton does not permit direct access to Update and ActiveSelf
	// This is why the flags are updated using a CuiElement
	elements.Add(new CuiElement
	{
		Name = "UICloseButton",
		ActiveSelf = false,
		Update = true,
	});

	elements.Add(new CuiElement
	{
		Name = "SubPanel1",
		Parent = "UI_CountDown",
		Components =
		{
			new CuiTextComponent { Text = "Text element to change after countdown", FontSize = 14, Align = TextAnchor.UpperCenter, Color ="1 0 0 1" },
			new CuiOutlineComponent { Distance = "1 1", Color = "0 0 0 1" },
			new CuiRectTransformComponent { AnchorMin = "0.1 0.85",  AnchorMax = "0.90 0.95" },
		}
	});

	elements.Add(new CuiElement
	{
		Name = "SubPanel2",
		Parent = "UI_CountDown",
		Components =
		{
			new CuiTextComponent { Text = "Text element to remove after downdown", FontSize = 14, Align = TextAnchor.UpperCenter, Color ="0 0 1 1" },
			new CuiOutlineComponent { Distance = "1 1", Color = "0 0 0 1" },
			new CuiRectTransformComponent { AnchorMin = "0.1 0.75",  AnchorMax = "0.9 0.85" },
		}
	});

	elements.Add(new CuiElement
	{
		Name = "SubPanel3",
		Parent = "UI_CountDown",
		Components =
		{
			new CuiRectTransformComponent { AnchorMin = "0.1 0.55",  AnchorMax = "0.9 0.75" },
		}
	});

	elements.Add(new CuiElement
	{
		Name = "CountDownElement",
		Parent = "SubPanel3",
		FadeOut = 2.0f,
		Components =
		{
			new CuiTextComponent{
				Text="Time left : %TIME_LEFT%",
				FontSize=14,
				Font="RobotoCondensed-Bold.ttf",
				Align=TextAnchor.MiddleCenter,
				Color="1 1 1 1"
			},
			new CuiCountdownComponent
			{
				TimerFormat = TimerFormat.HoursMinutesSeconds,
				Step = 1,
				EndTime = 0f,
				StartTime = 10f,
				Interval = 1f,
				FadeIn = 2.0f,
				DestroyIfDone = true,
				Command = "testCountDown.CountdownUi ",
			},
		}
	});

	CuiHelper.AddUi(player, elements);
}
```

Update the text and color of SubPanel1, make SubPanel2 element invisible, make UICloseButton element visible  
 
```csharp
[Command("testCountDown.CountdownUi")]
void hideUpdateUI(IPlayer iplayer, string command, string[] args)
{
    var player = iplayer.Object as BasePlayer;
    if (player != null)
    {
        CuiElementContainer elements = new CuiElementContainer();

        // update text and color
        elements.Add(new CuiElement
        {
            Name = "SubPanel1",
            Components =
            {
                new CuiTextComponent { Text = "Text element was changed", Color ="0.2 1 0.2 1" },
            },
            Update = true,
        });

        // hide element. can be set active later with ActiveSelf = true,
        elements.Add(new CuiElement
        {
            Name = "SubPanel2",
            ActiveSelf = false,
            Update = true,
        });

        // Show close button
        elements.Add(new CuiElement
        {
            Name = "UICloseButton",
            ActiveSelf = true,
            Update = true,
        });

        CuiHelper.AddUi(player, elements);
    }
}
```
