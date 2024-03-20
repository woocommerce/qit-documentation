# Env vars
include .env
export

deploy_docs:
	#npm run build
	#mkdir -p deploy
	docker run --rm \
    		--user "$(shell id -u):$(shell id -g)" \
    		-v "${PWD}/build:/build" \
    		-v "${PWD}/deploy:/deploy" \
    		joshkeegan/zip:latest \
    		sh -c "rm -f /deploy/*.zip && zip -r /deploy/docs.zip build"
	@docker run --rm \
		--user "$(shell id -u):$(shell id -g)" \
		-v "${PWD}/deploy.php:/app/deploy.php" \
		-v "${PWD}/deploy/docs.zip:/deploy/docs.zip" \
		-e DOCS_SECRET=${DOCS_SECRET} \
		--add-host host.docker.internal:host-gateway \
		php:8-cli \
		bash -c "php -d memory_limit=1G /app/deploy.php"