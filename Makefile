import.build:
	git checkout master -- bin
	cp -r bin/* .
	git rm -rf bin
