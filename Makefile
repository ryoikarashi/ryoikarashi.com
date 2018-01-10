#
# development commands
#
dev:
	sh ./scripts/dev-start.sh

kill-session:
	tmux kill-session -t ryoikarashi

destroy-dev:
	docker-compose -f docker-compose.development.yml down -v
	docker-compose -f docker-compose.proxy.development.yml down -v

assets-for-staging:
	docker run -it --rm -v `pwd`:/app ryoikarashi/webpack npm install
	docker run -it --rm -v `pwd`:/app ryoikarashi/webpack npm run build:staging

assets-for-prod:
	docker run -it --rm -v `pwd`:/app ryoikarashi/webpack npm install
	docker run -it --rm -v `pwd`:/app ryoikarashi/webpack npm run build:prod

staging-services:
	docker-compose -f docker-compose.staging.yml pull
	docker-compose -f docker-compose.staging.yml up -d

production-services:
	docker-compose -f docker-compose.production.yml pull
	docker-compose -f docker-compose.production.yml up -d
