#with import (builtins.fetchTarball "https://nixos.org/channels/nixpkgs-unstable/nixexprs.tar.xz") {};
with (import <nixpkgs> {});

mkShell {
  buildInputs = [
    nodePackages_8_x.pnpm
    nodejs-8_x
  ];

  shellHook = ''
    export PATH=$PATH:$(pwd)/node_modules/.bin
  '';
}
