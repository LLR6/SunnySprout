#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
sdk="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-/tmp/sunny-sdk}}"
bt="$sdk/build-tools/35.0.0"
jar="$sdk/platforms/android-35/android.jar"
mkdir -p build/classes build/dex
"$bt/aapt" package -f -m -J build -M app/src/main/AndroidManifest.xml -S app/src/main/res -I "$jar"
javac -source 8 -target 8 -encoding UTF-8 -classpath "$jar" -d build/classes app/src/main/java/com/lr/sunnysprout/*.java build/com/lr/sunnysprout/R.java
"$bt/d8" --lib "$jar" --min-api 26 --output build/dex $(find build/classes -name '*.class')
"$bt/aapt" package -f -M app/src/main/AndroidManifest.xml -S app/src/main/res -A app/src/main/assets -I "$jar" -F build/unsigned.apk
(cd build/dex && zip -q ../unsigned.apk classes.dex)
"$bt/zipalign" -f -p 4 build/unsigned.apk build/aligned.apk
# Development signing only. Keep this file to preserve upgrade compatibility.
if [ ! -f build/development.keystore ]; then
 keytool -genkeypair -keystore build/development.keystore -storepass android -keypass android -alias sunny -dname 'CN=SunnySprout Development' -keyalg RSA -keysize 2048 -validity 10000
fi
"$bt/apksigner" sign --ks build/development.keystore --ks-pass pass:android --ks-key-alias sunny --key-pass pass:android --out build/SunnySprout-v1.0.0.apk build/aligned.apk
"$bt/apksigner" verify build/SunnySprout-v1.0.0.apk
