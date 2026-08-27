const fs = require('node:fs')
const path = require('node:path')

const main = () => {
  const podfilePath = path.join(__dirname, '../../../ios/Podfile')

  if (!fs.existsSync(podfilePath)) return

  let content = fs.readFileSync(podfilePath, 'utf-8')
  if (content.includes('FMT_USE_CONSTEVAL')) return

  const targetAnchor = 'react_native_post_install('
  const startIdx = content.indexOf(targetAnchor)
  if (startIdx === -1) return

  // Find the closing ')' of the react_native_post_install(...) function call
  const closingParenIdx = content.indexOf(')', startIdx)
  if (closingParenIdx === -1) return

  // Find the end of the line containing that closing parenthesis
  const lineEndIdx = content.indexOf('\n', closingParenIdx)
  if (lineEndIdx === -1) return

  const patchCode = String.raw`
    # Fix fmt 11.0.2 consteval compilation error with Xcode 26.4+
    fmt_base = File.join(installer.sandbox.pod_dir('fmt'), 'include', 'fmt', 'base.h')
    if File.exist?(fmt_base)
      content = File.read(fmt_base)
      patched = content.gsub(/^#\s*define FMT_USE_CONSTEVAL 1$/, '# define FMT_USE_CONSTEVAL 0')
      if patched != content
        File.chmod(0644, fmt_base)
        File.write(fmt_base, patched)
      end
    end`

  // Insert right after the react_native_post_install block
  content =
    content.slice(0, lineEndIdx) + '\n' + patchCode + content.slice(lineEndIdx)

  fs.writeFileSync(podfilePath, content)
}

main()
