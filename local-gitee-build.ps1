Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

& node "scripts/local-gitee-build.mjs" @args
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}
