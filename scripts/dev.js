require('shelljs/global');

rm('-rf', 'dev');
mkdir('dev');
console.log("Created folder dev")
cp('extension/popup.dev.html', 'dev/popup.html')
cp('extension/manifest.json', 'dev/manifest.json')
cp('extension/background.dev.html', 'dev/background.html')
cp('-R','extension/logo', 'dev/logo')
console.log("Copied all assets")