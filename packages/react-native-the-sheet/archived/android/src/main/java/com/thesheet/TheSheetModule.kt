package com.thesheet

import com.facebook.react.bridge.ReactApplicationContext

class TheSheetModule(reactContext: ReactApplicationContext) :
  NativeTheSheetSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeTheSheetSpec.NAME
  }
}
