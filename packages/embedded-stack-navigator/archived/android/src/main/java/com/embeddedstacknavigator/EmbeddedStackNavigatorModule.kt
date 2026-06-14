package com.embeddedstacknavigator

import com.facebook.react.bridge.ReactApplicationContext

class EmbeddedStackNavigatorModule(reactContext: ReactApplicationContext) :
  NativeEmbeddedStackNavigatorSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeEmbeddedStackNavigatorSpec.NAME
  }
}
