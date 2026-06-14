package com.flashlistv2

import com.facebook.react.bridge.ReactApplicationContext

class FlashListV2Module(reactContext: ReactApplicationContext) :
  NativeFlashListV2Spec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeFlashListV2Spec.NAME
  }
}
