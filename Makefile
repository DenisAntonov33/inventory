.PHONY: react electron dist

react:
	yarn react-start

electron:
	yarn electron-start

clean-db:
	rm /Users/sergey/Library/Application\ Support/inventory/database/data.json

dist:
	yarn react-build && yarn electron-dist

test:
	yarn electron-test-w