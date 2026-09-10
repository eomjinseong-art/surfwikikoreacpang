# 쿠팡 파트너스 정적 사이트 플레이북

서핑용품(surfwikikoreacpang)을 기준으로, **같은 구조·같은 플랫폼**에 주제만 바꿔 사이트를 운영하는 방법이다.

작업 한 줄 요약: **구글 시트에 파트너스 링크를 넣으면, 로컬 스크립트가 상품명·사진을 모아 GitHub에 올리고, Vercel이 정적 HTML을 서비스한다. 사는 법은 같은 도메인의 용품가이드, 스팟·파도·숙소는 서프위키Ai.**

---

## 1. 이 조합을 고른 이유

| 선택 | 이유 |
|---|---|
| 정적 HTML + JSON | 서버/DB 없이 GitHub + Vercel로 끝난다. |
| 구글 시트 = 상품 원장 | 비개발자도 링크만 넣으면 된다. |
| 사진은 레포에 jpg로 저장 | 쿠팡 CDN 핫링크는 막히거나 사라진다. |
| 수집은 로컬 PC만 | GitHub Actions IP는 쿠팡/네이버에서 막히는 경우가 많다. |
| 용품가이드는 정적 페이지 | 쇼핑몰과 디자인·배포를 하나로 유지한다. |
| 지도·숙소는 서프위키Ai | 이 사이트는 구매만 담당한다. |

---

## 2. 브랜드와 연결

- 샵: 서핑용품
- 레포: `eomjinseong-art/surfwikikoreacpang`
- 지식/지도: [서프위키Ai](https://surfwikikorea.vercel.app/)
- 숨숨마을(`B-cat-Cpang`)과는 **원격·시트·Apps Script를 섞지 않는다.**

헤더: 서핑용품 | 용품가이드 | 오늘의 특가  
하단: 로켓와우 | 서핑 숙소, 그 아래 서프위키Ai

---

## 3. 구글 시트 계약

시트 ID: `1mEVtl-VkfA0nzFCS-w9KuZGnA0tyZP2A-MkG_M928Hg`  
탭 이름: **광고용**

| 필수 | 별칭 |
|---|---|
| 1열 = 행 번호 `NO` | 사진 파일명 `product-001.jpg`와 같다 |
| 쿠팡 파트너스 링크 | `쿠팡파트너스 링크`, `상품 링크` |

한 행 = 한 파트너스 단축링크. `숙소` 탭은 1차에서 수집하지 않는다. 하단 버튼만 숙소 1번 링크를 쓴다.

공개 CSV:

```
https://docs.google.com/spreadsheets/d/1mEVtl-VkfA0nzFCS-w9KuZGnA0tyZP2A-MkG_M928Hg/gviz/tq?tqx=out:csv&sheet=%EA%B4%91%EA%B3%A0%EC%9A%A9
```

---

## 4. 수집

본인 PC에서만:

```bash
npm run sync
```

분류만 다시:

```bash
npm run catalog
```

자리표시 제목은 `서핑 용품 추천 N`이다. 사이트는 jpg가 있고 이 제목이 아닌 행만 보여 준다.

Apps Script 웹앱 URL은 `.github/scripts/sync-coupang-products.mjs`의 `appsScriptUrl`에 둔다. 고양이 시트 웹앱을 재사용하지 않는다.

---

## 5. 카테고리

`index.html`의 `CATEGORIES`와 `classifyCategory()`를 같이 맞춘다.

```
보드/핀
슈트/래시가드
왁스/그립
리쉬/안전
가방/캐리어
관리/수리
액세서리
기타
```

---

## 6. GitHub · Vercel

- 배포 브랜치: `main`
- 원격은 `surfwikikoreacpang`만. `B-cat-Cpang`에 push하지 않는다.
- Vercel은 **새 프로젝트**로 이 레포를 Import. `b-cat-cpang`에 연결하지 않는다.
- jpg는 반드시 커밋한다.

---

## 7. 하지 말 것

- 고양이 사진·JSON을 남긴 채 링크만 바꾸고 sync
- 쿠팡 상품 페이지를 Actions에서 크롤링
- 제휴 고지를 빼기
- 숙소 트립 링크를 상품 sync에 섞기
- 용품가이드에 스팟·파도 본문을 길게 쓰기 (서프위키Ai로)
