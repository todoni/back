#CORS

##### 출처
[[WEB] 📚 악명 높은 CORS 개념 & 해결법 - 정리 끝판왕 👏](https://inpa.tistory.com/entry/WEB-%F0%9F%93%9A-CORS-%F0%9F%92%AF-%EC%A0%95%EB%A6%AC-%ED%95%B4%EA%B2%B0-%EB%B0%A9%EB%B2%95-%F0%9F%91%8F)

- Cross-Origin Resource Sharing
- 정책이다.
- 자바스크립트는 기본적으로 **서로 다른 도메인에 대한 요청을 보안상 제한**한다.
  - 브라우저는 기본 하나의 서버 연결만 허용하도록 설정되어 있음.
  - 태그에 따라 Same-Origin, Cross-Origin 정책이 다름.

---

## Origin?
- Protocol, Host, Port를 합친 URL

![](https://raw.githubusercontent.com/SongSongPaPa/learn_nest/main/learn_nest/theory/assets/origin.png)

---

## Same-Origin Policy VS Cross-Origin Policy
#### SOP
- 동일한 출처에 대한 정책
- 동일한 출처에서만 리소스를 공유할 수 있다.
  
#### COP
- SOP와 반대개념

#### SOP가 필요한 이유

![](https://raw.githubusercontent.com/SongSongPaPa/learn_nest/main/learn_nest/theory/assets/why_sop.png)

#### 출처 비교 주체
- Origin이 같으면 같은 출처라고 판단함.
- 출처 비교는 브라우저에서 진행함.
- 브라우저가 정책을 차단하므로, 서버에서 다른 출처의 서버로 API요청하는 것은 고려되지 않음.

> 그렇다고 죄다 차단해버릴 순 없음.
이를 해결하기 위해 CORS 정책을 지킨 리소스 요청을 보냄.

---

## CORS
- 교차 출처 리소스 공유
- 다른 출처의 리소스 공유에 대한 허용/비허용 정책
- 아무리 보안이 중요하지만, 죄다 막아버릴 순 없으니 **몇가지 예외 조항**을 두고 이 조항에 해당하면 SOP를 위반하더라도 받아드리겠다는 뜻.

#### 브라우저의 CORS 기본 동작
1. 클라이언트에서 HTTP요청의 헤더에 Origin을 담아서 전달.
   - 요청 헤더에 Origin 필드와 출처를 담아 보냄
2. 서버는 응답헤더에 `Access-Control-Allow-Origin`을 담아 클라이언트에 전달.
   - 서바가 받은 요청에 대한 응답을 할 때, 응답해더에 `Access-Control-Allow-Origin`이라는 필드를 추가하고 **이 리소스를 접근하는 것이 허용된 출처 url**을 담아 응답한다.
3. 클라이언트에서 Origin과 서버가 보낸 `Access-Control-Allow-Origin`를 비교한다.
   - 브라우저는 자신이 보낸 Origin과 서버의 응답을 비교한다.
   - 유효하지 않다면 CORS 에러
   - 유효하다면 가져다 씀


> CORS 해결책은 서버의 허용이 필요

---

## CORS 작동방식 세가지

실제로는 세 가지의 시나리오가 있음.

### 예비요청 (Preflight Request)

- 브라우저는 실제로 요청 시 예비요청을 보내고 통신되는지 확인 후 본 요청을 보냄.
- 이때 브라우저가 예비요청을 보내는 것을 `preflight`라고 함. 또한 이때 메소드를 `OPTIONS`라는 요청이 사용됨

![](https://raw.githubusercontent.com/SongSongPaPa/learn_nest/main/learn_nest/theory/assets/preflight.png)

![](https://raw.githubusercontent.com/SongSongPaPa/learn_nest/main/learn_nest/theory/assets/preflight_doc.png)

#### 예비요청 문제점

- 요청에 걸리는 시간이 늘어나 성능에 이슈가 생김
- 브라우저 캐싱을 통해 최적화시킬 수 있음


### 단순요청 (Simple Request)
- 예비요청 없이 바로 서버로 본 요청을 보냄.
- 그 후 응답값의 `Access-Control-Allow-Origin`비교
- 아래 3가지 경우를 만족해야지만 사용가능
  - 요청의 메소드가 GET, HEAD, POST 중 하나
  - Accept, Accept-Language, Content-Language, Content-Type, DPR, Downlink, Save-Data, Viewport-Width, Width 헤더일 경우에만 적용.
  - Content-Type 헤더가 application/x-www-form-urlencoded, multipart/form-data, text/plain중 하나여야 함. 아닐 경우 예비 요청으로 동작.

> 보통 HTTP API 요청은 application/json 형식이라 잘 안쓰임


### 인증된 요청 (Credentialed Request)

클라이언트가 서버에 `자격 인증 정보`를 실어 요청할때 사용되는 요청.

`자격인증정보`
- 세선 ID가 저장되어있는 쿠키 혹은 Authorization 헤더에 설정하는 토큰 값.

</br>

- 즉 클라이언트에서 일반적인 JSON 데이터 외 쿠키같은 인증정보를 포함하여 다른 출처의 서버로 전달할 때 CORS의 세가지 요청 중 하나인 `인증된 요청`으로 동작.

1. 클라이언트에서 인증정보를 보내도록 설정
   - 브라우저가 제공하는 요청API들은 별도의 옵션 없이는 쿠키와 같은 인증 관련 데이터를 함부로 요청데이터에 담지 않도록 되어있음.
   - 이때 credentials옵션을 통해 담을 수 있음.
   - `same-origin` 같은 출처 간 요청에만 인증 정보를 담을 수 있음.
   - `include` 모든 요청에 인증 정보를 담을 수 있음.
   - `omit` 모든 요청에 인증정보 담지 않음.

2. 서버에서, 인증된 요청에 대한 헤더 설정
   - `Access-Control-Allow-Credentials`값을 true로 설정
   - `Access-Control-Allow-Origin`값에 와일드카드 불가
   - `Access-Control-Allow-Methods`값에 와일드카드 불가
   - `Access-Control-Allow-Headers`값에 와일드카드 불가

