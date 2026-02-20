# Compilación de APK

## Método 1: GitHub Actions (Recomendado - Sin configuración local)

El APK se compila **automáticamente** cuando haces push a `main`. 

### Descargar APK compilado:

1. Ve a: [GitHub Actions - Releases](https://github.com/SoyJuanPiece/Vene-red-Social/releases)
2. En la sección "Releases" encontrarás:
   - `app-debug.apk` - Versión de debug (desarrollo)
   - `app-release.apk` - Versión release (producción)

3. Descarga el APK y instálalo en tu dispositivo Android:
```bash
adb install path/to/app-debug.apk
```

---

## Método 2: Compilación Local (Requiere Android SDK)

Si quieres compilar localmente en tu máquina:

### Requisitos:
- Android SDK (API level 34+)
- Java 17+
- Gradle 9.0+

### Pasos:

1. **Instalar Android SDK** (Ubuntu/Debian):
```bash
# Descargar AndroidStudio o SDK tools
# https://developer.android.com/studio

# O instalar via apt:
sudo apt-get install -y openjdk-17-jdk-headless
# Descargar Android SDK manually desde https://developer.android.com/studio/command-line
```

2. **Configurar ANDROID_HOME**:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

3. **Crear local.properties**:
```bash
cd Venered/android
echo "sdk.dir=$ANDROID_HOME" > local.properties
```

4. **Compilar APK**:
```bash
cd Venered
npm install
cd android

# Debug APK (desarrollo)
./gradlew assembleDebug

# Release APK (producción)
./gradlew assembleRelease
```

5. **APK generado en**:
```
Venered/android/app/build/outputs/apk/[debug|release]/app-[debug|release].apk
```

6. **Instalar en dispositivo**:
```bash
adb install path/to/app-debug.apk
```

---

## Instalación en Dispositivo

### Opción 1: Conectar dispositivo físico
```bash
# Activar Debug USB en Android
# Conectar dispositivo

# Listar dispositivos
adb devices

# Instalar APK
adb install -r app-debug.apk

# Ejecutar app
adb shell am start -n com.venered/.MainActivity
```

### Opción 2: Emulador Android
```bash
# Crear emulador
sdkmanager "system-images;android-34;default;x86_64"
avdmanager create avd -n Pixel4 -k system-images;android-34;default;x86_64

# Ejecutar emulador
emulator -avd Pixel4

# Instalar APK
adb install app-debug.apk
```

---

## Troubleshooting

### "SDK location not found"
```bash
cd Venered/android
echo "sdk.dir=$ANDROID_HOME" > local.properties
```

### "Gradle sync failed"
```bash
cd Venered
npm install
cd android
./gradlew clean
./gradlew assembleDebug
```

### "adb not found"
```bash
export PATH=$PATH:$ANDROID_HOME/platform-tools
adb devices
```

---

## CI/CD Status

Compila automáticamente en:
- ✅ Push a `main`
- ✅ Pull Requests
- ✅ Manual workflow dispatch

Logs: https://github.com/SoyJuanPiece/Vene-red-Social/actions

Releases: https://github.com/SoyJuanPiece/Vene-red-Social/releases
