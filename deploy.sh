#!/bin/bash

npm run build

rsync -avzr -e  'ssh -p 6022' dist/ hcapp@121.201.18.177:/home/hcapp/webHtml/