# Mental Model

The Sheet consists of 3 main layers

## 1. `SheetStackItem`

The layer responsible for registering the current sheet into a stack and handling stacking behavior

## 2. Presenter layer (`BottomSheetPresenter`)

The layer responsible for general presentation of the sheet

It will always open from 0% to 100% and close from 100% to 0%

As you could imagine, this layer can be going from the bottom to the top, or from the left to the right, or literally any direction you want

It's the secret sauce behind supporting dynamic sizing components by default, because when it opens, it doesn't care about the content inside. Thus, the content is free to size itself however it wants

## 3. Content layer (`BottomSheet`)

The layer responsible for the actual content of the sheet

It can be as simple as a `View` with some text, or it can be a complex component with many gestures like `BottomSheet`

As you could imagine, this layer can also be a `View` in the center of the screen, or a full screen modal, or anything you want
