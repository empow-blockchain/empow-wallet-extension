require('shelljs/global');

rm('-rf', 'build');
mkdir('build');
console.log("Created folder build")
cp('extension/manifest.json', 'build/manifest.json');
cp('-R','extension/logo', 'build/logo')
console.log("Copied all assets")