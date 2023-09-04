cd /home/blog-client-new
git pull
if [ "$1" = "true" ]; then
    echo "package is changed"
    yarn install
fi
yarn build
pm2 restart blog-client