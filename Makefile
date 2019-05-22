.PHONY: react electron dist

react:
	yarn react-start

electron:
	yarn electron-start

clean-db:
	rm -rf /Users/sergey/Library/Application\ Support/inventory/database

dist:
	yarn react-build && yarn electron-dist

test:
	yarn electron-test-w

secrets:
	cp ./electron/secrets.example.json ./electron/secrets.json

env:
	cp ./.env.example ./.env