cd /home/webhook
git pull
if [ "$1" = "true" ]; then
    echo "package is changed"
    pnpm install
fi
pm2 restart webhook