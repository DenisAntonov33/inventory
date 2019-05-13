.PHONY: react electron dist

react:
	yarn react-start

electron:
	yarn electron-start

clean-db:
	rm /Users/sergey/Library/Application\ Support/inventory/database/data-v0.0.1-dev.json

clean-prod-db:
	rm /Users/sergey/Library/Application\ Support/inventory/database/data-v0.0.1.json

dist:
	yarn react-build && yarn electron-dist

test:
	yarn electron-test-w