cd /home/nest-ssr
git pull
if [ "$1" = "true" ]; then
    echo "package is changed"
    pnpm install
fi
pnpm run build
pm2 restart nest-ssr