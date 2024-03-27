build-image-prod:
	docker build -t heseya/admin:latest .

compose-prod:
	docker compose -f docker-compose.yml up --remove-orphans

start-prod:
	make build-image-prod
	make compose-prod
