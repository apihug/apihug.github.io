# How to Initialize a Local Directory as an ApiHug Directory

## Windows

**ApiHug Install Script for Windows (PowerShell)**

This script initializes the current directory as an ApiHug project.
It requires **no** existing Gradle project — it works in a brand‑new directory.

**Steps:**

1. **Pre‑check:** Java 17+ environment
2. Resolve the latest version of `com.apihug:it-repl` from Maven Central (or use the version specified by the user)
3. Download `it-repl.jar` to `<current directory>\.apihug\it-repl.jar`
4. Execute: `java -jar .apihug\it-repl.jar --task apihug`

**Usage:**

```
.\apihug-install.ps1
.\apihug-install.ps1 -Version 2.5.1-RELEASE
.\apihug-install.ps1 -Force
```

**One‑line installation:**

```powershell
iex (irm 'https://raw.githubusercontent.com/apihug/apihug.github.io/main/helper/apihug-install.ps1')
```

---

## Bash (Linux, Unix, macOS)

**ApiHug Install Script for POSIX (Bash)**

This script initializes the current directory as an ApiHug project.
It requires **no** existing Gradle project — it works in a brand‑new directory.

**Steps:**

1. **Pre‑check:** Java 17+ environment
2. Resolve the latest version of `com.apihug:it-repl` from Maven Central (or use the version specified by the user)
3. Download `it-repl.jar` to `<current directory>/.apihug/it-repl.jar`
4. Execute: `java -jar .apihug/it-repl.jar --task apihug`

**Usage:**

```
./apihug-install.sh
./apihug-install.sh --version 2.5.1-RELEASE
./apihug-install.sh --force
```

**One‑line installation:**

```bash
curl -fsSL https://raw.githubusercontent.com/apihug/apihug.github.io/main/helper/apihug-install.sh | bash
```
