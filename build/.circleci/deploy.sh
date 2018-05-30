#!/bin/bash
#拉取
mkdir .deploy_git && cd ./.deploy_git/
git clone "git@github.com:FJUT/vue-element-admin.git"
cd ./vue-element-admin/
sed -i'' "s~git@github.com:FJUT/vue-element-admin.git~https://${GH_TOKEN}:x-oauth-basic@github.com/kainy/admin.kainy.cn.git~" ./.git/config
#cat ./.git/config
#检出
git checkout --orphan gh-pages
#cat ./.git/config
#pwd
#ls
git rm -rf .
cd ../../
#打包
npm run build:prod
cp ./dist/. .deploy_git/vue-element-admin/ -r
cd ./.deploy_git/vue-element-admin/
#发布
git add .
git commit -a -m "pages commit"
git push origin gh-pages --force