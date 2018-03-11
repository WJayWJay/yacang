#!/bin/bash

npm run build

cp ./public/MP_verify_h3EnKiX6dbaSLifK.txt ./dist/

rsync -avzr -e  'ssh -p 6022' dist/ hcapp@121.201.18.177:/home/hcapp/webHtml/