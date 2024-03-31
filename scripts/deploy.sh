
echo 'Cloning the repository...'

cd /var/www/api
git clone https://github.com/MatheusDev20/People-Pilot-Backend.git

echo 'Installing dependencies...'

node -v && \
yarn && \
yarn build && \
yarn start:prod
