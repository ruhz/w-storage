npx nodemon bs-config.js

npx nodemon bs-config.js --watch src/

--ignore 'public/images/*' # 排除某些文件

[nodemon.json]
{
  "watch": ["src/", "public/"],
  "ignore": ["node_modules/", "public/images/*"]
}


