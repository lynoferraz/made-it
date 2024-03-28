
all: sunodo-riv build

sunodo-riv: sunodo-sdk

sunodo-sdk:
	docker build --tag sunodo/sdk:0.2.0-riv --target sunodo-riv-sdk .

sunodo-workspace:
	docker build --tag sunodo/sdk:0.2.0-riv-ws --target sunodo-workspace .

build:
	sunodo build

testimage:
	docker build . --target base -t watest

run-testimage:
	docker run -it --rm --platform=linux/riscv64 watest bash

test-verbose:
	pytest --capture=no --log-cli-level=DEBUG --maxfail=1

test:
	pytest --capture=no --maxfail=1