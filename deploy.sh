echo 'Starting Deploy....'

pm2 stop main

echo 'Pulling from Master branch ... '

git pull

rm -rf node_modules
npm install --ignore-scripts
npm run build

cd dist

pm2 start main.js
