<p align="center">
  <h3 align="center">LunchVue</h3>
</p>
<br>

LunchVue(이하 '런치뷰')는 언제 어디서든 인터넷이 된다면 학교 급식표를 쉽고 빠르게 확인할 수 있는 앱입니다.

#### 서버 시작하기

 1. 빌드 및 컴파일을 하기 위해 다음 명령어를 입력하여 소스를 다운받습니다:
 `git clone https://github.com/Kurosnape/LunchVue.git`
 2. 의존성 모듈을 설치합니다:

 ```bash
 npm install
 # OR

 yarn install
 ```

 3. 소스를 컴파일합니다.

 ```bash
 npm run build
 # OR

 yarn run build
 ```

 4. 서버를 시작합니다:
 `npm start`

#### 사용 방법

> 현재 런치뷰는 DB 업데이트가 이루어지지 않아 무작위로 모든 교육청에 파싱 데이터를 불러오도록 하고 있습니다. 추후에 업데이트하도록 하겠습니다.

`.env.example` 파일의 이름을 `.env`로 변경해주세요. 그리고 파일을 열어 PORT 부분을 80으로 변경하세요.

(https로 사용하고 싶으시다면 443 포트로 변경하시고 SSL을 추가로 등록해주세요. 현재 그 부분은 코드로 추가되어 있지 않습니다. 또는 클라우드플레어를 이용하는 방법이 있습니다.)

NODE_ENV 부분을 `production`으로 변경해주세요. 이 작업은 캐시 설정과 더불어 성능 향상을 위해 사용됩니다.

이제 즐기세요!

#### 개발 방법

`yarn run dev:watch`를 통해 서버를 자동으로 watch합니다.
`yarn run sass:watch`를 통해 스타일시트 파일들을 자동으로 watch합니다.
`yarn run webpack:watch`를 통해 스크립트 파일을 자동으로 watch합니다.