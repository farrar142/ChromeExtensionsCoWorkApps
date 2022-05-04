# docker-compose  --force-rm -f docker-compose-deploy.yml up --build -d
docker-compose -f docker-compose-deploy.yml build --force-rm
docker-compose -f docker-compose-deploy.yml up -d