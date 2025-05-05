---
title: Basic CUI
after: coroutines
---
# Structure

UI element consists of its name, which should be a unique identifier (using duplicate names may cause issues), 
parent, which is the name of element parent (Example: Background is a parent of Table, and Table is a parent of cells), fade out time in seconds and components, 
which are the properties of your element.

## Components

There are multiple available components. Some are required, some are not. 
Rust client will use some default values when fields are needed but not defined by the UI

### `CuiRectTransformComponent`
Position of the element  

| Field | Type | Description |
| :---------- | :-------- | :-------------------------------------------------------- |  
| AnchorMin | String | The lower left corner, see [UI position](./basic-cui#ui-position)  |  
| AnchorMax | String | the upper right corner      |  
| OffsetMin | String | Lower left corner, in pixels, relative to AnchorMin |  
| OffsetMax | String | Upper right corner, in pixels, relative to AnchorMin |  

```csharp
CuiRectTransformComponent { AnchorMin = "0.5 0.5",  AnchorMax = "0.5 0.5", OffsetMin="-100 -20", OffsetMax="100 20" }
```

### `CuiNeedsCursorComponent`
Show a cursor that will let you click buttons and such.  

```csharp
CuiNeedsCursorComponent()
```

### `CuiNeedsKeyboardComponent`
 Keyboard input is needed for this UI.  

```csharp
CuiNeedsKeyboardComponent()
```

### `CuiImageComponent` 
Image with a sprite, material, color and cache.  

| Field | Type | Description |
| :---------- | :-------- | :-------------------------------------------------------- |
| Color | String | Color Field in RGBA format see [colors](./basic-cui#colors)  |
| FadeIn | float | Fadein time in seconds  |
| ImageType | Image.Type | see [image-type](./basic-cui#image-type)  |
| Material | String | Material of background [UI position](./basic-cui#colors)  |
| ItemId | int | Item ID, see [RustHelp Item list](https://rusthelp.com/tools/admin/item-list) |
| SkinId | ulong | Skin ID  |
| Png | String | Png image  |
| Sprite | String | Sprite image  |

```csharp
CuiImageComponent { Color = "0.20 0.30 0.40 1.0", Material = "assets/content/ui/uibackgroundblur.mat" }
```

### `CuiRawImageComponent`
 Raw image with a sprite, material, color, URL and cache.  

| Field | Type | Description |
| :---------- | :-------- | :-------------------------------------------------------- |
| Color | String | Color Field in RGBA format see [colors](./basic-cui#colors)  |
| FadeIn | float | Fadein time in seconds  |
| Material | String | Material of background [UI position](./basic-cui#colors)  |
| Png | String | Png image  |
| Sprite | String | Sprite image  |
| SteamId | String |   |
| Url | String |   |

```csharp
CuiRawImageComponent { Png = (string) ImageLibrary?.Call("GetImage", "ImageName") }
```

### `CuiButtonComponent` 
Button with command to execute, and other atttributes.  

| Field | Type | Description |
| :---------- | :-------- | :-------------------------------------------------------- |
| Close | String | UI name to close  |
| Color | String | Color Field in RGBA format see [colors](./basic-cui#colors)  |
| Command | String | Command to execute when button is pressed  |
| FadeIn | float | Fadein time in seconds  |
| ImageType | Image.Type | see [image-type](./basic-cui#image-type)  |
| Material | String | Material of background [UI position](./basic-cui#colors)  |
| Sprite | String |   |

```csharp
CuiButtonComponent {Color = "0.20 0.30 0.40 1.0", Command = "CommandName"}
```

### `CuiInputFieldComponent` 
Input field with default text attributes and command to run  

| Field | Type | Description |
| :---------- | :-------- | :-------------------------------------------------------- |
| Command | String | Command to execute when button is pressed  |
| Text | String |  Text to display  |
| Font | String | see [fonts](./basic-cui#fonts)  |
| FontSize | int | Size of font  |
| Color | String | Color Field in RGBA format see [colors](./basic-cui#colors)  |
| Align | TextAnchor | see [Align](./basic-cui#align)  |
| Autofocus | bool | true or false  |
| CharsLimit | int | maximum number of char  |
| HudMenuInput | bool | true or false  |
| IsPassword | bool | true or false  |
| LineType | InputField.LineType | TextAnchor.SingleLine<br> TextAnchor.MultiLineSubmit<br> TextAnchor.MultiLineNewline  |
| NeedsKeyboard | bool | true or false  |
| ReadOnly | bool | true or false  |

```csharp
CuiInputFieldComponent {Align = TextAnchor.MiddleCenter, CharsLimit = 300, Command = "CommandName", FontSize = 20, IsPassword = false, Text = "Why ?" }
```

### `CuiTextComponent` 
Text with value, font size, font, text align and color.  

| Field | Type | Description |
| :---------- | :-------- | :-------------------------------------------------------- |
| Text | String | Text to display  |
| Font | String |  see [fonts](./basic-cui#fonts) |
| FontSize | int | Size of font  |
| Color | String | Color Field in RGBA format see [colors](./basic-cui#colors)  |
| Align | TextAnchor | see [Align](./basic-cui#align)  |
| FadeIn | float | Fadein time in seconds  |
| VerticalOverflow | VerticalWrapMode | VerticalWrapMode.Truncate or VerticalWrapMode.Overflow  |

```csharp
CuiTextComponent { Text = "Workbench view", FontSize = 24, Align = TextAnchor.MiddleCenter, Color ="1 0 0 1" }
```

### `CuiOutlineComponent` 
Outline for an element with parameters.  

| Field | Type | Description |
| :---------- | :-------- | :-------------------------------------------------------- |
| Color | String | Color Field in RGBA format see [colors](./basic-cui#colors)  |
| Distance | String | Number of pixels for outline size  |
| UseGraphicAlpha | bool | true or false  |

```csharp
CuiOutlineComponent { Distance = "0.5 0.5", Color = "1 1 1 1" }
```

### `CuiCountdownComponent` 
Countdown that send a command at the end of count  
&emsp;

| Field | Type | Description |
| :---------- | :-------- | :-------------------------------------------------------- |
| Command | String | Command to execute when countdown terminates |
| DestroyIfDone | bool |  |
| StartTime | float | Initial time of the counter |
| EndTime | float | End time of the countter |
| Step | float | Value to increase/decrement the counter  |
| FadeIn | float | Fadein time in seconds  |
| Interval | float | timer update interval. Min interval is 0.02 ( 50 times per sec ) |
| NumberFormat | String | format, default is "0.####"  |
| TimerFormat | TimerFormat | None(default), SecondsHundreth, MinutesSeconds, MinutesSecondsHundreth, HoursMinutes, HoursMinutesSeconds, HoursMinutesSecondsMilliseconds, HoursMinutesSecondsTenths, DaysHoursMinutes, DaysHoursMinutesSeconds |

```csharp
CuiCountdownComponent Countdown = new CuiCountdownComponent
{
 TimerFormat = TimerFormat.HoursMinutesSeconds,
 Step = 1, EndTime = 0f, StartTime = 100f, Interval = 1f, FadeIn=2.0f
 Command = "Cmd.CountdownUi " + player.userID.ToString()
};

elements.Add(new CuiElement
{
 Name = "questCountdown", Parent = panel, FadeOut=2.0f
 Components =
 {
  new CuiTextComponent{Text="Time left : %TIME_LEFT%", FontSize=14, Font="RobotoCondensed-Bold.ttf", Align=TextAnchor.MiddleCenter, Color="1.0 1.0 1.0 1.0" },
  Countdown
 }
});
```
   
### `CuiScrollViewComponent`
Scroll component with parametrization  
&emsp;

| Field | Type | Description |
| :---------- | :-------- | :-------------------------------------------------------- |
| ContentTransform | CuiRectTransform | Rectangle definition of the window |
| DecelerationRate | float | Deceleration rate |
| Elasticity | float | Elasticity |
| Inertia | bool | Inertia |
| MovementType | ScrollRect.MovementType | Unrestricted, Elastic, Clamped |
| ScrollSensitivity | float | Scroll Sensitivity |
| Horizontal | bool | Enable horizontal scrollbar |
| Vertical | bool | Enable vertical scrollbar |
| HorizontalScrollbar | CuiScrollbar | Parameters to define the scrollbar [see CuiScrollbar](./basic-cui#cuiscrollbar) |
| VerticalScrollbar | CuiScrollbar | Parameters to define the scrollbar [see CuiScrollbar](./basic-cui#cuiscrollbar) |

```csharp
CuiScrollViewComponent scrollUI = new CuiScrollViewComponent
{
 ContentTransform = new CuiRectTransform { AnchorMin = "0 1", AnchorMax = "1 1", OffsetMin = "0 -700", OffsetMax = "0 0" },
 Vertical = true,
 Horizontal = false,
 MovementType = ScrollRect.MovementType.Clamped,
 Elasticity = 0.25f,
 Inertia = true,
 DecelerationRate = 0.3f,
 ScrollSensitivity = 24f,
 VerticalScrollbar = new CuiScrollbar { AutoHide = true, Size = 20 },
 HorizontalScrollbar = new CuiScrollbar { AutoHide = true, Size = 20 },
};

elements.Add(new CuiElement
{
 Name = "Scroller",
 Parent = "panel1",
 Components =
 {
  new CuiRawImageComponent { Sprite = "assets/content/effects/crossbreed/fx gradient skewed.png", Color = "0.05 0.05 0.05 0.5" },
  scrollUI,
  new CuiRectTransformComponent {AnchorMin = "0 0", AnchorMax = "1 1", OffsetMax = "0 -50" },
  new CuiNeedsCursorComponent()
 }
});
```

## Element presets

Oxide provides you with a few presets for elements with predefined components, such as:

### `CuiElement`
CuiElement is an assembly of single or multiple components. The CuiElement member will be defined through the `elements.Add` member. 

| Field | Type | Description |
| :---------- | :-------- | :-------------------------------------------------------- |  
| Parent | String | Parent name of this element  |
| Components | List\<ICuiComponent\> | a list of components to define the element  |  
| Name | String | Name of the element.  |  
| FadeOut | float | Fade out time in seconds   |
| Update | bool | Update flag |
| DestroyUI | String | Name of the UI to auto destroy  |  

### `CuiPanel` 
to show images or draw a nice background.  

| Field | Type | Description |
| :---------- | :-------- | :-------------------------------------------------------- |
| Image | CuiImageComponent | Background image, required |
| RawImage | CuiRawImageComponent | Raw image |
| RectTransform | CuiRectTransformComponent | Rectangle for the panel, required |
| CursorEnabled | bool | Cursor enabled for this UI |
| KeyboardEnabled | bool | Keyboard input enabled for this UI |
| FadeOut | float | Fade out time in seconds  |

### `CuiButton` 
to create a button.  

| Field | Type | Description |
| :---------- | :-------- | :-------------------------------------------------------- |
| Text | CuiTextComponent | Text to display on the button, required  |
| RectTransform | CuiRectTransformComponent | Rectangle for the button, required |
| FadeOut | float | Fade out time in seconds  |

### `CuiLabel` 
to show text.  

| Field | Type | Description |
| :---------- | :-------- | :-------------------------------------------------------- |
| Text | CuiTextComponent | Text to display, required |
| RectTransform | CuiRectTransformComponent | Rectangle to display text, required |
| FadeOut | float | Fade out time in seconds  |

### `CuiRectTransform` 
to draw a rectangle

| Field | Type | Description |
| :---------- | :-------- | :-------------------------------------------------------- |  
| AnchorMin | String | Lower left corner see [UI position](./basic-cui#ui-position)  |  
| AnchorMax | String | Upper right corner      |  
| OffsetMin | String | Lower left corner, in pixels, relative to AnchorMin |  
| OffsetMax | String | Upper right corner, in pixels, relative to AnchorMin | 

### `CuiScrollbar`
To draw a scrollbar

| Field | Type | Description |
| :---------- | :-------- | :-------------------------------------------------------- |  
| HandleColor | String | Color of handle see [colors](./basic-cui#colors) |  
| HandleSprite | String | Sprite of handle  |  
| HighlightColor | String | Color when highlighted  |
| PressedColor | String | Color when pressed  |  
| TrackColor | String | color of the track background |
| TrackSprite | String | Sprite of the track background  |
| Size | float | size of the scrollbar  |  
| Invert | bool | Invert action of scroller  |  
| AutoHide | bool | Auto hides the scroller  |  


They can be used to have predefined fields in case you want to modify them without casting ICuiComponent to the needed type, and to simplify UI creation.

## Adding UI
You made a few buttons and a nice background. To send them you have to create a container first, which is CuiElementContainer:
```csharp
var container = new CuiElementContainer();
var backgroundName = container.Add(myBackground, "Overlay", "MyBackgroundName");
container.Add(myCuiComponent);
```
There are multiple Add methods - one is for presets, which lets you set the parent and name. If you do not specify a name, a random GUID will be used. Name will also be returned. However, if you have a CuiElement, it works as just a `List<CuiElement>` so you have to manually specify parent and name.

In order to send UI to the player, you should use AddUi:
```csharp
CuiHelper.AddUi(basePlayer, container);
```

## Destroying UI
If you want to remove your beautiful UI, you should call DestroyUi and specify element ID (name) to remove like that:
```csharp
CuiHelper.DestroyUi(basePlayer, backgroundName);
```

## CuiElementContainer
CuiElementContainer is the top object to create an UI. It will contain multiple elements
Once the container is created, we add a CuiPanel and a CuiElement with multiple component in the CuiElement
Finally, the CuiHelper.AddUi will send the UI to a player for display but the UI will only be visible when opening workbench.

```csharp
private const string UI_WORKBENCHOVERLAY = "UI_WorkbenchOverlay";
private void WorkbenchUi(BasePlayer player)
{
 CuiElementContainer elements = new CuiElementContainer();
 
 string panel = elements.Add(new CuiPanel
 {
  Image = { Color = "0 0 0 0.63", Sprite = "assets/content/materials/highlight.png", Material = "assets/content/ui/uibackgroundblur-ingamemenu.mat" },
  RectTransform = { AnchorMin = "0.1 0.7", AnchorMax = "0.9 0.8" }
 }, "TechTree", UI_WORKBENCHOVERLAY);

 elements.Add(new CuiLabel
 {
  Text = {
  Text = "Message to overlay in workbench",
  FontSize = 14, Align = TextAnchor.MiddleCenter, Color = "1 1 1 1" },
  RectTransform = { AnchorMin = "0.02 0.5", AnchorMax = "0.98 0.98" }
 }, panel);

 elements.Add(new CuiElement
 {
  Parent = panel,
  Components =
  {
   new CuiTextComponent { Text = "Workbench view", FontSize = 24, Align = TextAnchor.MiddleCenter, Color ="1 0 0 1" },
   new CuiOutlineComponent { Distance = "0.5 0.5", Color = "1 1 1 1" },
   new CuiRectTransformComponent { AnchorMin = "0.02 0.02",  AnchorMax = "0.98 0.5" },
  }
 });
 CuiHelper.AddUi(player, elements);
}
```

## Cache

If you are using a URL, client will download the image from the link you specify every time, and its quality might be changed depending on the quality settings. To avoid both issues, you can use "cache" a.k.a. Png option.

Game provides you with a Png option for UI, which is the image ID on the server. You have to store the image server-side first, for example you could use Image Library. After doing so you provide your client with the ID of this image, and client will download it from the server and store in its cache.
## UI position

There are two types of positions - Anchor and Offset. Both have Min and Max. Min value is the bottom left corner position, and Max is the top right one. Both Min and Max have X and Y values and are such string: "X Y".

Anchors are numbers that represent width and height in percents (%) from 0.0 (0%) to 1.0 (100%).

Offsets are accurate values that are width and height, in pixels, relative to 1280x720. Example: You made a 100x100 box for 1280x720 and if you switch to 2560x1440, it will be 200x200 pixels.

Anchors are applied before offsets. If you want offsets to be relative to the screen center, make all anchors 0.5 0.5 so that both corners are in the center. Then to make a 100x100 box you should use offsets -50 -50 for bottom left corner and 50 50 for top right one.
## Colors

Rust UI is using normalized RGBA colors. It means that this nice red color (R255 G102 B102 A255) would be 1.0 0.4 0.4 1.0.

The fourth and last number is Alpha (transparency), in the example above it is 100%.
## Fonts

All available fonts are
* `DroidSansMono.ttf`
* `PermanentMarker.ttf`
* `RobotoCondensed-Bold.ttf`(Default)
* `RobotoCondensed-Regular.ttf`

## Align

* `TextAnchor.UpperLeft`
* `TextAnchor.UpperCenter`
* `TextAnchor.UpperRight`
* `TextAnchor.MiddleLeft`
* `TextAnchor.MiddleCenter`
* `TextAnchor.MiddleRight`
* `TextAnchor.LowerLeft`
* `TextAnchor.LowerCenter`
* `TextAnchor.LowerRight`
 
## Material

* `"assets/content/ui/ui.saturation.shader`  
* `"assets/content/ui/ui.thresholdcolor.shader`  
* `"assets/content/ui/uibackgroundblur-ingamemenu.mat"`  
* `"assets/content/ui/uibackgroundblur-mainmenu.mat`  
* `"assets/content/ui/uibackgroundblur-notice.mat`  
* `"assets/content/ui/uibackgroundblur.mat`  
* `"assets/content/ui/uibackgroundblur.shader`  

## Image type

* Simple,
* Sliced,
* Tiled,
* Filled
   
## Layers

You can use specific "layers" as parents for your UI because they are always present:

* `Overall` the top most layer in front of all of Rust's UI
* `Overlay` 
* `Hud` the layer where Rust stores most HUD elements like your status bar
* `Hud.Menu` the layer where rust positions menus like your inventory
* `Under` the lowermost layer, your UI will appear behind all of Rust's UI

For the other layers, UI will only be visible in the respective view.
* `Inventory`
* `Crafting`
* `Contacts`
* `Clans`
* `TechTree`
* `Map`
