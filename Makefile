import.build:
	git checkout master -- bin
	cp -r bin/* .
	git rm -rf bin
	git add .
	git commit -am "updated gh-pages"
	git checkout master
