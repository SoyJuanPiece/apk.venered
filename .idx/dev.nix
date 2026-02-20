{ pkgs, ... }: 
let
  # Definimos el SDK de Android en una variable para que sea más limpio
  androidSdk = (pkgs.androidenv.composeAndroidPackages {
    abiVersions = [ "x86_64" ];
    platformVersions = [ "33" ];
    includeEmulator = true;
    sdkmanager-components = [
      "platform-tools"
      "emulator"
      "cmdline-tools;latest"
      "system-images;android-33;google_apis;x86_64"
      "platforms;android-33"
      "build-tools;33.0.2"
    ];
  }).androidsdk;
in {
  channel = "unstable";

  # Usamos la variable definida arriba
  packages = [
    androidSdk
    pkgs.coreutils # Recomendado para comandos básicos de shell
  ];

  idx = {
    extensions = [ "esbenp.prettier-vscode" ];

    workspace = {
      onCreate = {
        setup = ''
          # Crear el AVD automáticamente si no existe para ahorrar tiempo
          echo "no" | avdmanager create avd -n "venered-emu" -k "system-images;android-33;google_apis;x86_64" --force
          
          clear
          echo "------------------------------------------------------------------";
          echo "✅ Entorno de Emulación para Venered (Configuración Corregida)";
          echo "------------------------------------------------------------------";
          echo "SDK de Android configurado correctamente.";
          echo "";
          echo "WORKFLOW:";
          echo "";
          echo "  1. INICIA EL EMULADOR:";
          echo "     emulator -avd venered-emu -no-snapshot -grpc-use-token";
          echo "";
          echo "  2. INSTALA TU APK (en otra terminal):";
          echo "     adb install ./app-release-offline.apk";
          echo "------------------------------------------------------------------";
        '';
      };
    };

    previews = {
      enable = false;
    };
  };
}