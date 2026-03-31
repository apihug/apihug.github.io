#!/usr/bin/env pwsh

##############################################################################
#
#  ApiHug Install Script for Windows (PowerShell)
#
#  This script downloads the ApiHug REPL tool (it-repl.jar) to the current
#  directory's .apihug\ folder, ready to be launched.
#  It requires NO existing Gradle project - it works in a brand new directory.
#
#  Steps:
#    1. Pre-check: Java 17+ environment
#    2. Resolve the latest version of com.apihug:it-repl from Maven Central
#       (or use the version specified by the user)
#    3. Download it-repl.jar to <current dir>\.apihug\it-repl.jar
#    4. Launch: java -jar .apihug\it-repl.jar  (interactive REPL)
#
#  Usage:
#    .\apihug-install.ps1
#    .\apihug-install.ps1 -Version 2.5.1-RELEASE
#    .\apihug-install.ps1 -Force
#
##############################################################################

param(
    [string]$Version = "",
    [switch]$Force,
    [switch]$Pause
)

# Keep window open on error when run by double-clicking or without a persistent console
function Exit-WithPause {
    param([int]$Code = 1)
    if ($Pause -or -not $Host.UI.RawUI.KeyAvailable -or $Host.Name -eq 'ConsoleHost') {
        Write-Host ""
        Write-Host "Press any key to close this window..."
        $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
    }
    exit $Code
}

# Fallback version when Maven Central is unreachable
$FALLBACK_VERSION = "2.5.0-RELEASE"

$GROUP_ID    = "com.apihug"
$ARTIFACT_ID = "it-repl"

Write-Host ""
Write-Host "##############################################################################"
Write-Host "#  ApiHug Installer"
Write-Host "##############################################################################"
Write-Host ""

##############################################################################
# Step 1: Pre-check Java 17+
##############################################################################

Write-Host "[Step 1] Checking Java environment..."

$javaExe = $null

if ($env:JAVA_HOME) {
    $javaExe = Join-Path $env:JAVA_HOME "bin\java.exe"
    if (-not (Test-Path $javaExe)) {
        Write-Host ""
        Write-Host "ERROR: JAVA_HOME is set to an invalid directory: $env:JAVA_HOME"
        Write-Host ""
        Write-Host "Please set the JAVA_HOME variable in your environment to match the"
        Write-Host "location of your Java installation."
        Exit-WithPause 1
    }
} else {
    $javaExe = "java"
    if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
        Write-Host ""
        Write-Host "ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH."
        Write-Host ""
        Write-Host "Please install JDK 17+ and set the JAVA_HOME variable in your environment."
        Exit-WithPause 1
    }
}

# Check Java version >= 17
# java -version writes to stderr; 2>&1 redirects it as strings in pwsh, but may produce
# ErrorRecord objects in Windows PowerShell 5.x - convert everything to string explicitly.
$versionOutput = & $javaExe -version 2>&1
$versionString = ($versionOutput | ForEach-Object { "$_" } | Where-Object { $_ -match 'version' } | Select-Object -First 1)
if ([string]::IsNullOrWhiteSpace($versionString)) {
    Write-Host ""
    Write-Host "ERROR: Could not determine Java version. Raw output:"
    $versionOutput | ForEach-Object { Write-Host "  $_" }
    Exit-WithPause 1
}
$versionMatch  = [regex]::Match($versionString, 'version "(\d+)')
if (-not $versionMatch.Success) {
    Write-Host ""
    Write-Host "ERROR: Could not parse Java version from: $versionString"
    Exit-WithPause 1
}
$majorVersion = [int]$versionMatch.Groups[1].Value
if ($majorVersion -lt 17) {
    Write-Host ""
    Write-Host "ERROR: Java 17+ is required. Current version: $majorVersion"
    Write-Host ""
    Write-Host "Please install JDK 17 or higher."
    Exit-WithPause 1
}

Write-Host "  Java $majorVersion found: $javaExe"
Write-Host ""

##############################################################################
# Step 2: Resolve version from Maven Central (or use user-specified version)
##############################################################################

Write-Host "[Step 2] Resolving ApiHug version..."

if (-not $Version) {
    # Try Maven Central Search API first
    $searchUrl = "https://search.maven.org/solrsearch/select?q=g:$GROUP_ID+AND+a:$ARTIFACT_ID&rows=1&wt=json"
    try {
        $response = Invoke-RestMethod -Uri $searchUrl -TimeoutSec 15 -ErrorAction Stop
        $Version  = $response.response.docs[0].latestVersion
        Write-Host "  Version resolved from Maven Central Search API: $Version"
    } catch {
        Write-Host "  Maven Central Search API unavailable, trying maven-metadata.xml..."
        try {
            # Fallback: query maven-metadata.xml directly
            $metaUrl     = "https://repo1.maven.org/maven2/com/apihug/$ARTIFACT_ID/maven-metadata.xml"
            $metaContent = (Invoke-WebRequest -Uri $metaUrl -TimeoutSec 15 -ErrorAction Stop).Content
            $metaXml     = [xml]$metaContent
            $Version     = $metaXml.metadata.versioning.release
            Write-Host "  Version resolved from maven-metadata.xml: $Version"
        } catch {
            # Final fallback: use hardcoded version
            $Version = $FALLBACK_VERSION
            Write-Host "  WARNING: Could not reach Maven Central. Using fallback version: $Version"
        }
    }
} else {
    Write-Host "  Using user-specified version: $Version"
}

Write-Host ""
Write-Host "  ApiHug Version: $Version"
Write-Host ""

##############################################################################
# Step 3: Download it-repl.jar (with version cache to avoid re-downloading)
##############################################################################

Write-Host "[Step 3] Preparing it-repl.jar..."

$apihugDir        = Join-Path (Get-Location) ".apihug"
$jarPath          = Join-Path $apihugDir "it-repl.jar"
$versionCacheFile = Join-Path $apihugDir ".version"

# Create .apihug directory if it does not exist
if (-not (Test-Path $apihugDir)) {
    New-Item -ItemType Directory -Path $apihugDir | Out-Null
    Write-Host "  Created directory: $apihugDir"
}

# Check whether download is needed
$needDownload = $true
if ((Test-Path $jarPath) -and (Test-Path $versionCacheFile) -and (-not $Force)) {
    $cachedVersion = (Get-Content $versionCacheFile -Raw).Trim()
    if ($cachedVersion -eq $Version) {
        $needDownload = $false
        Write-Host "  it-repl.jar is up-to-date (version: $Version), skipping download."
    } else {
        Write-Host "  Version changed: $cachedVersion -> $Version, re-downloading..."
    }
}

if ($needDownload) {
    $groupPath = $GROUP_ID -replace '\.', '/'
    $jarUrl    = "https://repo1.maven.org/maven2/$groupPath/$ARTIFACT_ID/$Version/$ARTIFACT_ID-$Version.jar"

    Write-Host "  Downloading: $jarUrl"
    Write-Host ""

    try {
        Invoke-WebRequest -Uri $jarUrl -OutFile $jarPath -TimeoutSec 120 -ErrorAction Stop
    } catch {
        Write-Host ""
        Write-Host "ERROR: Failed to download it-repl.jar from: $jarUrl"
        Write-Host "       $($_.Exception.Message)"
        Exit-WithPause 1
    }

    # Validate download (file must be non-empty)
    if (-not (Test-Path $jarPath) -or (Get-Item $jarPath).Length -eq 0) {
        if (Test-Path $jarPath) { Remove-Item $jarPath }
        Write-Host ""
        Write-Host "ERROR: Downloaded file is empty or missing. Please check your network and try again."
        Exit-WithPause 1
    }

    # Save version to cache file
    Set-Content -Path $versionCacheFile -Value $Version -NoNewline

    Write-Host "  Download complete: $jarPath"
}

Write-Host ""

##############################################################################
# Step 4: Launch ApiHug interactive REPL
##############################################################################

Write-Host "[Step 4] Starting ApiHug REPL..."
Write-Host ""

# TODO: replace bare launch with a non-interactive init command once available
$jvmOpts = @("-Xmx128m", "-Xms64m")
& $javaExe @jvmOpts -jar $jarPath apihug

$exitCode = $LASTEXITCODE
if ($exitCode -ne 0) {
    Write-Host ""
    Write-Host "ERROR: ApiHug REPL exited with error (exit code: $exitCode)"
    Exit-WithPause $exitCode
}

Write-Host ""
Write-Host "##############################################################################"
Write-Host "#  Done!"
Write-Host "##############################################################################"
Write-Host ""
