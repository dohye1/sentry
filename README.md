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

# Token

## Permission

- [Sentry frontend tutorial](https://docs.sentry.io/product/sentry-basics/integrate-frontend/upload-source-maps/#step-1-prepare-the-build-environment)에서 token의 permission을 아래의 이미지처럼 설정해주라고 한다.

<img width="692" alt="Screenshot 2023-02-06 at 4 45 44 PM" src="https://docs.sentry.io/static/b639f3c7b2715d9185616c53a492c66e/c1b63/upload-source-maps-016.png">

왜냐하면 해당 토큰을 사용해서

Makefile에서 release의 버전을 생성하고, commit의 정보를 수정하는 작업을 하기때문이다.

1. sentry-cli를 사용해 `release` 작업을 해주기때문에 permission > release를 admin으로 설정해줌

```make
create_release:
		sentry-cli releases --auth-token ${SENTRY_AUTH_TOKEN} -o $(SENTRY_ORG) new -p $(SENTRY_PROJECT) $(REACT_APP_RELEASE_VERSION)
```

2. sentry-cli를 사용해 `set-commits` 작업을 해주기때문에 permission > organization를 read&write로 설정해줌

- Organization의 권한을 통해 할수있는 작업중 `retrieve Repositories and Commits`가 있다.

```make
associate_commits:
		sentry-cli releases --auth-token ${SENTRY_AUTH_TOKEN} -o $(SENTRY_ORG) -p $(SENTRY_PROJECT) set-commits --auto $(REACT_APP_RELEASE_VERSION)
```

---

### 그럼 다른 Permission들은 어떤 기준으로 설정해주면되는지 알아보자

- Sentry에서 수행할 작업들을 API를 사용해서 처리할수있는데, 그 endpoint들을 [여기](https://docs.sentry.io/api/crons/)서 확인해볼수있다.

- 예시로 조직의 멤버를 삭제하는 api를 보자
  <img src="https://user-images.githubusercontent.com/64346737/217118427-5da65e0e-69f3-4eb3-8f0a-1bf7984a5f26.png" alt="sentry api"/>

조직의 멤버를 삭제하기위한 api주소와, 해당작업을 수행하기위해 설정해야할 scope들이 명시되어있다.

그래서 내가 작업하고싶은 행위에 대한 scope들을 dashboard에서 설정해주면된다!
