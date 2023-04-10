const fs = require('fs')
const pkg = require('./package.json')

fs.writeFileSync(
  'package.json',
  JSON.stringify(
    {
      name: pkg.name,
      description: pkg.description,
      version: pkg.version,
      repository: pkg.repository,
      keywords: pkg.keywords,
      main: pkg.main,
      module: pkg.module,
      types: pkg.types,
      publishConfig: pkg.publishConfig,
      dependencies: pkg.dependencies,
      peerDependencies: pkg.peerDependencies,
    },
    null,
    4,
  ),
)
