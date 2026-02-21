{ pkgs, ... }:
{
  # Entorno de desarrollo mínimo, sin ninguna configuración de Android.
  channel = "unstable";

  # Paquetes básicos que pueden ser útiles.
  packages = [
    pkgs.git
    pkgs.curl
    pkgs.jdk17 # Se mantiene por si es necesario para el proyecto.
  ];

  idx = {
    # Extensiones de VS Code que tenías antes.
    extensions = [
      "ms-vscode.js-debug",
      "esbenp.prettier-vscode"
    ];

    # Se han eliminado las secciones 'workspace' y 'previews' 
    # relacionadas con Android para asegurar que el entorno compile.
  };
}
