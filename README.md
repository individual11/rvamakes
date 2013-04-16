#RVAMAKES#

Please fork repo and use pull requests.

Update:

please run the following git cli commands in the root directory of the repository

`git rm --cached codekit-config.json`

`find . -name .DS_Store -print0 | xargs -0 git rm --cached --ignore-unmatch`

this will clean out all the crap