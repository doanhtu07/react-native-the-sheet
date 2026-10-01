package com.keyboardcontroller

import com.facebook.react.bridge.ReactApplicationContext

class KeyboardControllerModule(reactContext: ReactApplicationContext) :
  NativeKeyboardControllerSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeKeyboardControllerSpec.NAME
  }
}
