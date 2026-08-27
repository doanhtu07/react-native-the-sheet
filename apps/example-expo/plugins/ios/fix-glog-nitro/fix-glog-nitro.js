const { withDangerousMod } = require('@expo/config-plugins')
const fs = require('node:fs')
const path = require('node:path')

/**
 * Fixes a CocoaPods compilation error between legacy `glog` and `react-native-nitro-modules`.
 *
 * ISSUE:
 * Nitro Modules requires modular headers (`DEFINES_MODULE = YES`) for Swift interop, and this
 * cascades to pods that never asked for it — including `glog` (used by RN core & Reanimated).
 * `glog`'s `logging.h` wraps `#include "glog/log_severity.h"` inside a C++ `namespace google {
 * ... }` block. Any target compiled with Clang modules enabled that includes a glog header will
 * have Clang auto-modularize it via the discoverable modulemap — regardless of what's set on
 * glog's own pod target — producing:
 * `fatal error: import of module 'glog.glog.log_severity' appears within namespace 'google'`
 * Simply disabling `DEFINES_MODULE` on the glog target is not sufficient, since other targets
 * (e.g. RNGestureHandler, React-debug) still find and use glog's modulemap independently.
 *
 * SOLUTION:
 * Rewrite `glog`'s modulemap so it only exports `logging.h` as a single opaque unit — this
 * prevents the internal `log_severity.h` include from being converted into a namespaced
 * `@import`, while still letting glog function as a module for anything that needs it. Also
 * allow non-modular includes inside framework modules globally, since Nitro/Swift-facing
 * targets may otherwise refuse to include glog (or other non-modular pods) at all.
 *
 * SAFE TO REMOVE WHEN:
 * - Upgraded to React Native/Nitro versions with a native glog modulemap fix, or `glog` is
 *   replaced as a logging dependency.
 */
const fixGlogNitro = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (localConfig) => {
      const podfilePath = path.join(
        localConfig.modRequest.platformProjectRoot,
        'Podfile',
      )

      if (!fs.existsSync(podfilePath)) return localConfig

      let content = fs.readFileSync(podfilePath, 'utf-8')
      if (content.includes("target.name == 'glog'")) return localConfig

      const targetAnchor = 'react_native_post_install('
      const startIdx = content.indexOf(targetAnchor)
      if (startIdx === -1) return localConfig

      // Find the closing ')' of the react_native_post_install(...) function call
      const closingParenIdx = content.indexOf(')', startIdx)
      if (closingParenIdx === -1) return localConfig

      // Find the end of the line containing that closing parenthesis
      const lineEndIdx = content.indexOf('\n', closingParenIdx)
      if (lineEndIdx === -1) return localConfig

      const patchCode = `
    # Rewrite glog modulemap instead of deleting it
    glog_modulemap_public = File.join(installer.sandbox.headers_root, 'Public', 'glog', 'glog.modulemap')
    glog_modulemap_pod = File.join(installer.sandbox.pod_dir('glog'), 'src', 'glog', 'glog.modulemap')

    glog_modulemap_content = <<~MODULEMAP
      module glog [system] [extern_c] {
        header "logging.h"
        export *
      }
    MODULEMAP

    [glog_modulemap_public, glog_modulemap_pod].each do |map_path|
      if File.exist?(File.dirname(map_path))
        File.write(map_path, glog_modulemap_content)
      end
    end

    # Apply build settings across all pod targets
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |c|
        if target.name == 'glog'
          c.build_settings['DEFINES_MODULE'] = 'YES'
          c.build_settings['CLANG_ENABLE_MODULES'] = 'YES'
        end
        c.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
      end
    end`

      // Insert right after the react_native_post_install block
      content =
        content.slice(0, lineEndIdx) +
        '\n' +
        patchCode +
        content.slice(lineEndIdx)

      fs.writeFileSync(podfilePath, content)

      return localConfig
    },
  ])
}

module.exports = fixGlogNitro
