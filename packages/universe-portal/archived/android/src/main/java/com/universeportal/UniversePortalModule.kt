package com.universeportal

import com.facebook.react.bridge.ReactApplicationContext

class UniversePortalModule(reactContext: ReactApplicationContext) :
  NativeUniversePortalSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeUniversePortalSpec.NAME
  }
}
