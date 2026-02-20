{ pkgs, ... }: {
  channel = "stable-23.11";

  packages = [
    pkgs.nodejs_20
    pkgs.jdk17
    pkgs.android-tools
    # Nota: Quitamos pkgs.android-sdk porque causa conflictos en la configuración simple
  ];

  idx = {
    extensions = [ "esbenp.prettier-vscode" ];
    
    workspace = {
      onCreate = {
        setup = ''
          # 1. Permisos
          chmod +x android/gradlew
          
          # 2. Carpetas en /home (espacio libre)
          mkdir -p /home/user/.gradle_home
          mkdir -p /home/user/.android_cache
          mkdir -p /home/user/.build_tmp
          
          # 3. Forzar el local.properties con la ruta interna de IDX
          # Usamos /lib/android/sdk que es donde IDX lo monta por defecto
          echo "sdk.dir=/lib/android/sdk" > android/local.properties
        '';
      };
    };
    
    previews = {
      enable = false;
    };
  };
}