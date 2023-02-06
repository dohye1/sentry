# Sentry

### [frontend tutorial](https://docs.sentry.io/product/sentry-basics/integrate-frontend/)을 보고 만든 프로젝트

- 문서에서 알려준 방식과 조금 다름
- 문서에서 알려준 코드는 몇년전에 관리되어서 최신 라이브러리와 버전이 맞지않아, 라이브러리의 버전을 올려서 재구성함
- `Sentry.init` 코드도 조금 다름

# MakeFile 생성

~root경로에~ `Makefile`이라는 이름의 파일을 생성해줘여한다.
> 꼭 root경로는 아니어도 된다고함..!

[환경변수 찾는곳](https://docs.sentry.io/product/sentry-basics/integrate-frontend/upload-source-maps/#step-1-prepare-the-build-environment)

```make
# Must have `sentry-cli` installed globally
# Following variables must be passed in

SENTRY_AUTH_TOKEN=추가해주기
SENTRY_ORG=추가해주기
SENTRY_PROJECT=추가해주기

REACT_APP_RELEASE_VERSION=`sentry-cli releases propose-version`

setup_release: create_release upload_sourcemaps associate_commits

create_release:
		sentry-cli releases --auth-token ${SENTRY_AUTH_TOKEN} -o $(SENTRY_ORG) new -p $(SENTRY_PROJECT) $(REACT_APP_RELEASE_VERSION)

upload_sourcemaps:
		sentry-cli releases --auth-token ${SENTRY_AUTH_TOKEN} -o $(SENTRY_ORG) -p $(SENTRY_PROJECT) files $(REACT_APP_RELEASE_VERSION) \
        upload-sourcemaps --url-prefix "~/static/js" --validate build/static/js

associate_commits:
		sentry-cli releases --auth-token ${SENTRY_AUTH_TOKEN} -o $(SENTRY_ORG) -p $(SENTRY_PROJECT) set-commits --auto $(REACT_APP_RELEASE_VERSION)
```
