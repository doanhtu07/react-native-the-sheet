const fs = require('node:fs')
const path = require('node:path')

// Issue: https://github.com/expo/expo/issues/44229

const main = () => {
  const podfilePath = path.join(__dirname, '../../ios/Podfile')

  if (!fs.existsSync(podfilePath)) return

  let content = fs.readFileSync(podfilePath, 'utf-8')
  if (content.includes('FMT_USE_CONSTEVAL')) return

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

  content = content.replace(
    /(react_native_post_install\([\s\S]*?\n\s*\))/m,
    `$1\n${patchCode}`,
  )
  fs.writeFileSync(podfilePath, content)
}

main()
