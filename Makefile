dev:
	docker compose up

clean:
	@echo "Cleaning all Docker resources..."
	docker system prune -a --volumes -f
	docker volume prune -f
	docker volume rm sleepr_mongodb_data
	@echo "Docker cleanup complete!"