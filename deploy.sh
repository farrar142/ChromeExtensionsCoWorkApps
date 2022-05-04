# docker-compose  --force-rm -f docker-compose-deploy.yml up --build -d
docker-compose -f docker-compose-deploy.yml --force-rm
docker-compose -f docker-compose-deploy.yml -up -d