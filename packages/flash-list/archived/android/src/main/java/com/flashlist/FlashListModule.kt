package com.flashlist

import com.facebook.react.bridge.ReactApplicationContext

class FlashListModule(reactContext: ReactApplicationContext) :
  NativeFlashListSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeFlashListSpec.NAME
  }
}
