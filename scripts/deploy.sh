echo 'Starting Deploy...'

echo 'Cloning the repository...'

cd /var/www 
rm -rf /api

git clone https://github.com/MatheusDev20/People-Pilot-Backend.git /var/www/api

echo 'Setup Enviroment Variables...'
chmod +x ~/env-vars.sh
~/env-vars.sh

echo 'Installing dependencies...'

cd /var/www/api

node -v && \
yarn && \
yarn build && \
yarn start:prod