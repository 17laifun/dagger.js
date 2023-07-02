nginx setup:  

server {
    listen 6688;
    server_name dagger.demo.com;
    gzip on;
    gzip_min_length 1k;
    gzip_buffers 16 64k;
    gzip_http_version 1.1;
    gzip_types text/plain application/json text/css application/javascript application/xml application/x-javascript text/xml application/xml+rss text/javascript application/vnd.ms-fontobject application/x-font-ttf font/opentype image/svg+xml image/x-icon;
    error_page 403 404  /index.html;
    location / {
        root /{LOCAL_PATH}/dagger.js/function_tests/cases/;
    }
}

run: npm run test  
view test report: npx allure serve  
