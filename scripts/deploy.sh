echo 'Starting Deploy...'

cd /var/www 
rm -rf /api

echo 'Setup Enviroment Variables...'
chmod +x ~/env-vars.sh
~/env-vars.sh

echo 'Cloning the repository...'
git clone https://github.com/MatheusDev20/People-Pilot-Backend.git /var/www/api

cd /var/www/api

echo 'Installing dependencies...'

node -v && \
yarn && \
yarn build && \
yarn start:prod