echo 'Starting Deploy...'

cd /var/www

if [ -d "api" ]; then
    echo 'Removing existing api directory...'
    rm -rf api
else
    echo 'No existing api directory found. Skipping removal.'
fi

echo 'Cloning the repository...'
git clone https://github.com/MatheusDev20/People-Pilot-Backend.git /var/www/api

cd /var/www/api

cat << EOF > .env
NODE_ENV=$NODE_ENV
API_PORT=$API_PORT
DB_PORT=$DB_PORT
DB_PASSWORD=$DB_PASSWORD
DB_HOST=$DB_HOST
DB_USERNAME=$DB_USERNAME
DB_NAME=$DB_NAME
DB_SYNC=$DB_SYNC
JWT_SECRET=$JWT_SECRET
JWT_EXPIRATION=$JWT_EXPIRATION
AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
BUCKET_NAME=$BUCKET_NAME
BUCKET_URL=$BUCKET_URL
LOCAL_UPLOAD_FOLDER=$LOCAL_UPLOAD_FOLDER
EOF

echo ".env file created successfully."

echo 'Installing dependencies...'

node -v && \
yarn && \
yarn build && \
yarn start:prod
