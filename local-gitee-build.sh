set -e


pnpm build
cd  out/

git init
git add -A
git commit  -m "deploy of apihug.com static build"

git push -f git@gitee.com:apihugcom/apihugcom-build.git master

cd -
