#!/usr/bin/env bash

##############################################################################
#
#  ApiHug Install Script for POSIX (Bash)
#
#  This script downloads the ApiHug REPL tool (it-repl.jar) to the current
#  directory's .apihug/ folder, ready to be launched.
#  It requires NO existing Gradle project - it works in a brand new directory.
#
#  Steps:
#    1. Pre-check: Java 17+ environment
#    2. Resolve the latest version of com.apihug:it-repl from Maven Central
#       (or use the version specified by the user)
#    3. Download it-repl.jar to <current dir>/.apihug/it-repl.jar
#    4. Launch: java -jar .apihug/it-repl.jar  (interactive REPL)
#
#  Usage:
#    ./apihug-install.sh
#    ./apihug-install.sh --version 2.5.1-RELEASE
#    ./apihug-install.sh --force
#
##############################################################################

set -e

# Fallback version when Maven Central is unreachable
FALLBACK_VERSION="2.5.1-RELEASE"

GROUP_ID="com.apihug"
ARTIFACT_ID="it-repl"

# Parse arguments: support both --version=X and --version X forms
VERSION=""
FORCE=0

while [ $# -gt 0 ]; do
    case "$1" in
        --version=*)
            VERSION="${1#*=}"
            shift
            ;;
        --version|-v)
            VERSION="$2"
            shift 2
            ;;
        --force|-f)
            FORCE=1
            shift
            ;;
        *)
            shift
            ;;
    esac
done

echo ""
echo "##############################################################################"
echo "#  ApiHug Installer"
echo "##############################################################################"
echo ""

##############################################################################
# Step 1: Pre-check Java 17+
##############################################################################

echo "[Step 1] Checking Java environment..."

if [ -n "$JAVA_HOME" ] ; then
    JAVACMD="$JAVA_HOME/bin/java"
    if [ ! -x "$JAVACMD" ] ; then
        echo ""
        echo "ERROR: JAVA_HOME is set to an invalid directory: $JAVA_HOME"
        echo ""
        echo "Please set the JAVA_HOME variable in your environment to match the"
        echo "location of your Java installation."
        exit 1
    fi
else
    JAVACMD="java"
    if ! command -v java >/dev/null 2>&1 ; then
        echo ""
        echo "ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH."
        echo ""
        echo "Please install JDK 17+ and set the JAVA_HOME variable in your environment."
        exit 1
    fi
fi

# Check Java version >= 17
JAVA_VERSION_OUTPUT=$( "$JAVACMD" -version 2>&1 | head -n 1 )
JAVA_MAJOR=$( echo "$JAVA_VERSION_OUTPUT" | sed -E 's/.*version "([0-9]+).*/\1/' )

if [ -z "$JAVA_MAJOR" ] ; then
    echo ""
    echo "ERROR: Could not determine Java version from output: $JAVA_VERSION_OUTPUT"
    exit 1
fi

if [ "$JAVA_MAJOR" -lt 17 ] ; then
    echo ""
    echo "ERROR: Java 17+ is required. Current version: $JAVA_MAJOR"
    echo ""
    echo "Please install JDK 17 or higher."
    exit 1
fi

echo "  Java $JAVA_MAJOR found: $JAVACMD"
echo ""

##############################################################################
# Step 2: Resolve version from Maven Central (or use user-specified version)
##############################################################################

echo "[Step 2] Resolving ApiHug version..."

DOWNLOAD_CMD=""

if [ -z "$VERSION" ] ; then
    # Determine download tool: prefer curl, fallback to wget
    if command -v curl >/dev/null 2>&1 ; then
        DOWNLOAD_CMD="curl"
    elif command -v wget >/dev/null 2>&1 ; then
        DOWNLOAD_CMD="wget"
    else
        echo "  WARNING: Neither curl nor wget found. Using fallback version: $FALLBACK_VERSION"
        VERSION="$FALLBACK_VERSION"
    fi

    if [ -z "$VERSION" ] && [ -n "$DOWNLOAD_CMD" ] ; then
        # Primary: query maven-metadata.xml from repo1.maven.org (authoritative, always indexed)
        # Note: search.maven.org Search API is NOT used because com.apihug artifacts are not indexed there.
        GROUP_PATH=$( echo "$GROUP_ID" | tr '.' '/' )
        META_URL="https://repo1.maven.org/maven2/${GROUP_PATH}/${ARTIFACT_ID}/maven-metadata.xml"
        if [ "$DOWNLOAD_CMD" = "curl" ] ; then
            META_CONTENT=$( curl -sf --connect-timeout 15 --max-time 15 "$META_URL" 2>/dev/null || true )
        else
            META_CONTENT=$( wget -qO- --timeout=15 "$META_URL" 2>/dev/null || true )
        fi

        if [ -n "$META_CONTENT" ] ; then
            VERSION=$( echo "$META_CONTENT" | sed -n 's|.*<release>\([^<]*\)</release>.*|\1|p' | head -n 1 )
            if [ -n "$VERSION" ] ; then
                echo "  Version resolved from maven-metadata.xml: $VERSION"
            fi
        fi

        # Fallback: use hardcoded version when network is unavailable
        if [ -z "$VERSION" ] ; then
            VERSION="$FALLBACK_VERSION"
            echo "  WARNING: Could not reach Maven Central. Using fallback version: $VERSION"
        fi
    fi
else
    echo "  Using user-specified version: $VERSION"
fi

echo ""
echo "  ApiHug Version: $VERSION"
echo ""

##############################################################################
# Step 3: Download it-repl.jar (with version cache to avoid re-downloading)
##############################################################################

echo "[Step 3] Preparing it-repl.jar..."

APPDIR=$( pwd )
APIHUG_DIR="$APPDIR/.apihug"
JAR_PATH="$APIHUG_DIR/it-repl.jar"
VERSION_CACHE_FILE="$APIHUG_DIR/.version"

# Create .apihug directory if it does not exist
if [ ! -d "$APIHUG_DIR" ] ; then
    mkdir -p "$APIHUG_DIR"
    echo "  Created directory: $APIHUG_DIR"
fi

# Check whether download is needed
NEED_DOWNLOAD=1
if [ -f "$JAR_PATH" ] && [ -f "$VERSION_CACHE_FILE" ] && [ "$FORCE" -eq 0 ] ; then
    CACHED_VERSION=$( cat "$VERSION_CACHE_FILE" )
    if [ "$CACHED_VERSION" = "$VERSION" ] ; then
        NEED_DOWNLOAD=0
        echo "  it-repl.jar is up-to-date (version: $VERSION), skipping download."
    else
        echo "  Version changed: $CACHED_VERSION -> $VERSION, re-downloading..."
    fi
fi

if [ $NEED_DOWNLOAD -eq 1 ] ; then
    # Ensure download tool is available
    if [ -z "$DOWNLOAD_CMD" ] ; then
        if command -v curl >/dev/null 2>&1 ; then
            DOWNLOAD_CMD="curl"
        elif command -v wget >/dev/null 2>&1 ; then
            DOWNLOAD_CMD="wget"
        else
            echo ""
            echo "ERROR: Neither curl nor wget is available. Cannot download it-repl.jar."
            exit 1
        fi
    fi

    GROUP_PATH=$( echo "$GROUP_ID" | tr '.' '/' )
    JAR_URL="https://repo1.maven.org/maven2/${GROUP_PATH}/${ARTIFACT_ID}/${VERSION}/${ARTIFACT_ID}-${VERSION}.jar"

    echo "  Downloading: $JAR_URL"
    echo ""

    # Do NOT rely on set -e here - validate explicitly below for a friendly error message
    if [ "$DOWNLOAD_CMD" = "curl" ] ; then
        curl -fL --connect-timeout 30 --max-time 120 -o "$JAR_PATH" "$JAR_URL" || true
    else
        wget -O "$JAR_PATH" --timeout=120 "$JAR_URL" || true
    fi

    # Validate download (file must be non-empty)
    if [ ! -f "$JAR_PATH" ] || [ ! -s "$JAR_PATH" ] ; then
        [ -f "$JAR_PATH" ] && rm -f "$JAR_PATH"
        echo ""
        echo "ERROR: Downloaded file is empty or missing."
        echo "       URL: $JAR_URL"
        echo "       Please check your network connection and try again."
        exit 1
    fi

    # Save version to cache file
    printf '%s' "$VERSION" > "$VERSION_CACHE_FILE"
    echo "  Download complete: $JAR_PATH"
fi

echo ""

##############################################################################
# Step 4: Launch ApiHug interactive REPL
##############################################################################

echo "[Step 4] Starting ApiHug REPL..."
echo ""

# TODO: replace bare launch with a non-interactive init command once available
# Note: --enable-native-access is required for JLine terminal on Java 22+
# -Dorg.jline.terminal.provider=jni forces JNI provider for better compatibility
"$JAVACMD" -Xmx128m -Xms64m -Dorg.jline.terminal.provider=jni --enable-native-access=ALL-UNNAMED -jar "$JAR_PATH" init

EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ] ; then
    echo ""
    echo "ERROR: ApiHug REPL exited with error (exit code: $EXIT_CODE)"
    exit $EXIT_CODE
fi

echo ""
echo "##############################################################################"
echo "#  Done!"
echo "##############################################################################"
echo ""
