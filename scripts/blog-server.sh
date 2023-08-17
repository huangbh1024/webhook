cd /home/blog-server
git pull
if [ "$1" = "true" ]; then
    echo "package is changed"
    npm install
fi
npm run build
pm2 restart blog-server