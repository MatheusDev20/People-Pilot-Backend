
echo 'Cloning the repository...'
git clone https://github.com/MatheusDev20/People-Pilot-Backend.git /var/www/api

cd /var/www/api

echo 'Installing dependencies...'

node -v && \
yarn && \
yarn build && \
yarn start:prod
