echo 'Starting Deploy....'

# pm2 stop main

echo 'Pulling from Github ... '

git checkout .
git pull

rm -rf node_modules
npm install --production --ignore-scripts --no-cache
npm run build

cd dist

pm2 start main.js
