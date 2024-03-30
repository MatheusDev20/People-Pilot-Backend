echo 'Starting Deploy...'

cd /var/www

if [ -d "api" ]; then
    echo 'Removing existing api directory...'
    rm -rf api
else
    echo 'No existing api directory found. Skipping removal.'
fi

echo 'Setup Environment Variables...'
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
