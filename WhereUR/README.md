Expresswayinfo24.  
=
   
요약 :실시간 교통정보를 알려주는 챗봇
-  


- 라인 메신져 채널 아이콘
![Expresswayinfo](/uploads/ddd3df567660d18e977d072a9417e49c/Expresswayinfo.png)

- 라인 매신져 QR코드
![스크린샷_2020-06-12_오전_11.29.07](/uploads/cc9196a2241574dc538223f70c0b3f02/스크린샷_2020-06-12_오전_11.29.07.png)



챗봇 사용 방법
=
   

1. 우선 처음 사용자는 '안녕'을 입력하셔서 그의 가이드라인을 따라가시는 것을 추천드립니다. 필요한 상황에 맞는 명령어를 순차적으로 확인하는 것을 추천합니다.
2. 무조건 명령어 순차적으로 입력하는 것이 아닌, 필요한 명령어를 바로 입력하여 즉시 기능을 볼 수 있습니다.
3. 종료의 명령어는 딱히 없습니다. 다시 원하는 명령어를 입력하시면 그 명령어에 따르는 답변을 받으실 수 있습니다.
4. 사용자의 입력에 따라 반응함으로, 반드시 '안녕'을 입력하셔서 사용하여 주시기 바랍니다.    

   
<참고사항>
고속도로 노선 번호 중 구간이 완전하지 않은 곳은 기점종점을 바탕으로 고속도로의 이름을 만듭니다. 저는 일단 이러한 사항은 모두 하나의 이름으로 통일하였습니다. 또한 중부내륙선같이 노선번호는 같으나 제1, 제2로 나뉘어 지는 고속도로의 경우 모두 하나의 이름으로 통일하였습니다. 이점 유의해 주세요. 

- 경부 및 남북 구간: 
1-경부선, 15-서해안선, 17-평택파주선, 25-호남 및 논산천안선, 27-순천완주선, 29-세종포천지선, 35-통영대전 및 중부선, 37-제2중부선, 45-중부내륙선, 55-중앙선, 65-동해선

- 동서 구간 : 
10-남해, 12-무안광주 및 광주대구선, 16-울산선, 20-새만금포항선, 30-당진영덕선, 32-아산청주선, 40-평택제천선, 50-영동선, 52-광주원주선, 60-서울양양선

- 순환 및 경인 구간: 
100-서울외각순환선, 300-대전남부선, 400-수도권제2순환, 600-부산외곽순환선, 110-제2 경인선, 120-경인선, 130-인천공항선

- 지선 구간: 
102-남해 제1지선, 104-남해 제2지선, 105-남해 제3지선, 151-서천공주선, 153-평택시흥선, 171-오산화성 및 용인서울선, 204-새만금포항지선2, 251-호남지선, 253-고참담양선, 301-상주영천선, 451-중부내륙지선, 551-중앙지선


혹시나 빠진 고속국도가 있다면 알려주세요.


챗봇 명령어
=

1. 안녕 : 원하는 정보가 있을 시, 명령어를 찾아보기 위해 입력해 주세요.
2. 1 : 현재 주요 도시간 교통 예보 
3. 2 : 실시간 교통혼잡 상황
4. 3 : 실시간 노선별 정체상황
5. 4 : 나들목 간 교통요금
6. 5 : 나들목 간 통행 평균 시간
7. 6 : 실시간 공사 정보
8. 7: 실시간 사고 정보
9. 노선정보 : 전국의 노선번호를 알려줍니다.
10. 나들목정보 : 이름이 포함된 나들목의 이름을 보여줍니다.
   
API List
=

- Kakao Maps API
- Line Messasing API
- 한국도로공사-고속도로 공공데이터 포털
- 국토교통부-교통정보공개서비스
   
      
설치방법
=

우선 키를 발급받아야합니다.
-
- https://apis.map.kakao.com/web/
- https://developers.line.biz/en/services/messaging-api/
- http://openapi.its.go.kr/portal/main.do
- http://data.ex.co.kr/

이 repository를 clone 해주세요.   
-   
- git clone  ssh://git@khuhub.khu.ac.kr:12959/2019102236/Expresswayinfo24.git


npm install
-
 
    npm install 


app.js을 수정해주세요.
-
    const TOKEN = 'your Token'; //"https://developers.line.biz/en/services/messaging-api/"에서 받은  토큰입니다.   
    const apikey1 = "your key"; //"http://data.ex.co.kr/"에서 받은 키입니다.     
    const apikey2 = "your key" //"http://openapi.its.go.kr/portal/main.do"에서 받은 키입니다.   
    const domain = "your dodmain" //당신의 도메인입니다.   
   

다음으로, /public/maprealtime.html을 수정해주세요.   
-
    var API_DOMAIN = 'http://openapi.its.go.kr';   
    var key = 'Your Key';   


이때,  "http://openapi.its.go.kr/portal/main.do"에서 받은 키입니다.

다음으로, /views/mapaccident.ejs에서 수정해주세요.
-
    <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=yourkey"></script>   
    
이때, "https://apis.map.kakao.com/web/"에서 발급은 키입니다.

마찬가지로, /views/mapconstruction.ejs을 수정해주세요.
-
   
    <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=yourkey"></script>
   
 서버를 실행시켜 잘 작동되는지 확인해주세요.
 -
 


역사
=

- 실시간 전국 지방 국도 및 고속국도교통지도 웹사이트 (o) //05.28.
- 실시간 고속국도 교통 예보 (o)//06.03; 
- 실시간 고속국도 정체상황 (o) //06.04; 06.07(최종버그수정);
- 거리간 요금 예상 알림(o) //06.08;
- 고속국도 노선번호 정보알리미(o)//06.04;
- 고속국도 나들목 정보알라미(o)//06.13;
- 고속도로 나들목간 예상소요시간 알리미(o)//06.13;
- 실시간 고속국도 공사정보 (o); //06.17;
- 고속도로 사고 정보 웹사이트(o) //06.18;

License
-
  
MIT License

Copyright (c) 2020 Choi Hyunyeong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



만든이: 최현영, 2019102236
