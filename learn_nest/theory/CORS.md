#CORS

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
- 출처 비교는 브라우저에서 진행함.
- 브라우저가 정책을 차단하므로, 서버에서 다른 출처의 서버로 API요청하는 것은 고려되지 않음.

---

### 