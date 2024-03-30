echo 'Starting Deploy...'

echo 'Cloning the repository...'

cd /var/www && rm -rf /api

git clone https://github.com/MatheusDev20/People-Pilot-Backend.git /var/www/api

cd /var/www/api

echo 'Setup Enviroment Variables...'
cd ~ && chmod +x ./env-vars.sh && ./env-vars.sh

echo 'Installing dependencies...'

node -v && \
yarn && \
yarn build && \
yarn start:prod