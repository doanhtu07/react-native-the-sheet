const fs = require('node:fs')
const path = require('node:path')

const main = () => {
  const podfilePath = path.join(__dirname, '../../../ios/Podfile')

  if (!fs.existsSync(podfilePath)) return

  let content = fs.readFileSync(podfilePath, 'utf-8')
  if (content.includes("target.name == 'glog'")) return

  const targetAnchor = 'react_native_post_install('
  const startIdx = content.indexOf(targetAnchor)
  if (startIdx === -1) return

  // Find the closing ')' of the react_native_post_install(...) function call
  const closingParenIdx = content.indexOf(')', startIdx)
  if (closingParenIdx === -1) return

  // Find the end of the line containing that closing parenthesis
  const lineEndIdx = content.indexOf('\n', closingParenIdx)
  if (lineEndIdx === -1) return

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
    content.slice(0, lineEndIdx) + '\n' + patchCode + content.slice(lineEndIdx)

  fs.writeFileSync(podfilePath, content)
}

main()
