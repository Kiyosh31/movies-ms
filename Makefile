dev:
	docker compose up

dev-build:
	docker compose up --build

clean:
	@echo "Cleaning all Docker resources..."
	docker system prune -a --volumes -f
	docker volume prune -f
	docker volume rm movies-ms_mongodb_data
	@echo "Docker cleanup complete!"