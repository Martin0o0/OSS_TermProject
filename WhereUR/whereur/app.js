var express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
var app = express();
var static = require('serve-static');
//const xlsx = require('xlsx');
const convert = require('xml-js');

const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
const TARGET_URL = 'https://api.line.me/v2/bot/message/reply'
const TOKEN = 'your Token';
const apikey1 = "your key";
const apikey2 = "your key"
const domain = "your dodmain"
const sslport = 23023;

const feebuffer = fs.readFileSync('Expressfee.json');
const datafeejson = feebuffer.toString();
const feedata = JSON.parse(datafeejson);
console.log("Expressfee.json 파일 읽기");

const namebuffer = fs.readFileSync('ExpressIC.json');
const datanamejson = namebuffer.toString();
const namedata = JSON.parse(datanamejson);
console.log("Expressname.json 파일 열기");


app.use(bodyParser.json());
//전역변수 선언
//var count = 0;
var userroadcongest = new Object();
var userroadcongestlength = new Object();
var userroadcongestcount = new Object();


//var jsonForforecast;
// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));

var router = express.Router();

app.set('view engine', 'ejs');

router.route('/process/maprealtime').get(function(req, res){
    console.log('process/mapreatime 호출됨');
    res.end();
});

// router.route('/process/mapconstruction').get(function(req, res){
//     console.log('proess/mapconstruction 호출됨');
// });

app.get('/construction', function(req, res){
    jsonConstrunction(function(object){
        var obj = object;
        console.log(obj);
        res.render('mapconstruction.ejs', {
            construnctionjson:obj
        });
    })
})

app.get('/accident', function(req, res){
    jsonAccident(function(object){
        var obj = object;
        console.log(obj);
        res.render('mapaccident.ejs', {
            accidentjson:obj
        })
    })
} )

function jsonforecast(callback){ //교통예보
    var url2 = 'http://data.ex.co.kr/openapi/safeDriving/forecast';
    var queryParams2  = '?' + encodeURIComponent('key') + '=' + apikey1; /* Service Key*/
    queryParams2 += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json'); /* */
    var obj
    request(
        {
        url: url2 + queryParams2,
        method: 'GET'
    }, function (error, response, body) {
        console.log('Status', response.statusCode);
        console.log('Headers', JSON.stringify(response.headers));
        console.log('Reponse received', body);
        obj = JSON.parse(body);
        console.log(obj);
        callback(obj);
    });
   
};

function jsoncongest(callback){ //교통정체
    var url1 = 'http://data.ex.co.kr/openapi/odtraffic/trafficAmountByCongest';
    var queryParams1 = '?' + encodeURIComponent('key') + '=' + apikey1; /* Service Key*/
    queryParams1 += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json'); /* */

    request({
        url: url1 + queryParams1,
        method: 'GET'
    }, function (error, response, body) {
        console.log('Status', response.statusCode);
        console.log('Headers', JSON.stringify(response.headers));
        console.log('Reponse received', body);
        var obj = JSON.parse(body);
        console.log(obj);
        callback(obj);
    });
}

function jsonICtoICtime(startICcode, endICcode, callback){
    var url3 = 'http://data.ex.co.kr/openapi/trtm/realUnitTrtm';
    var queryParams3 = '?' + encodeURIComponent('key') + '=' + apikey1;;
    queryParams3 += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json');
    queryParams3 += '&' + encodeURIComponent('iStartUnitCode') + '=' + startICcode + '&' + encodeURIComponent('iEndUnitCode') + '=' + endICcode + '&' + encodeURIComponent('numOfRows') + '=10'+ '&' + encodeURIComponent('pageNo') + '=1'
    
    request({
        url: url3 + queryParams3,
        method: 'GET'
    }, function (error, response, body) {
        console.log('Status', response.statusCode);
        console.log('Headers', JSON.stringify(response.headers));
        console.log('Reponse received', body);
        var obj = JSON.parse(body);
        console.log(obj);
        callback(obj);
    });
}

function jsonConstrunction(callback){
    var url4 = 'http://openapi.its.go.kr:8082/api/NEventIdentity';
    var queryParams4 = '?' + encodeURIComponent('key') + '=' + apikey2; /* Service Key*/
    queryParams4 += '&ReqType=2&MinX=127.100000&MaxX=128.890000&MinY=34.100000 &MaxY=39.100000&type=ex'

    request({
        url: url4 + queryParams4,
        method: 'GET'
    }, function (error, response, body) {
        var result = body;
        var xmlToJson = convert.xml2json(result, {compact: true, spaces: 4});
        xmlToJson = JSON.parse(xmlToJson);
        console.log(xmlToJson);
        console.log(typeof(xmlToJson));
        callback(xmlToJson);
    });
}

function jsonAccident(callback){
    var url5 = 'http://openapi.its.go.kr:8082/api/NIncidentIdentity';
    var queryParams5 = '?' + encodeURIComponent('key') + '=' + apikey2; /* Service Key*/
    queryParams5 += '&ReqType=2&MinX=127.100000&MaxX=128.890000&MinY=34.100000 &MaxY=39.100000&type=ex'

    request({
        url: url5,
        method:'GET'
    }, function (error, response, body){
        var result = body;
        var xmlToJson = convert.xml2json(result, {compact: true, spaces:4});
        xmlToJson = JSON.parse(xmlToJson);
        console.log(xmlToJson);
        console.log(typeof(xmlToJson));
        callback(xmlToJson);
    });
}

app.use('/', router);

function ishello(istext){
    if(istext == '안녕'){
        return true;
    }
    else{
        return false;
    }
}

function firstforecast(isforecast){
    if(isforecast == '1'){
        return true;
    }
    else if(isforecast == '2'){
        return true;
    }
    else if(isforecast == '3'){
        return true;
    }
    else if(isforecast == '4'){
        return true;
    }
    else if (isforecast == '5'){
        return true;
    }
    else if (isforecast == '6'){
        return true;
    }
    else if (isforecast == '7'){
        return true;
    }
    else {
        return false;
    }
}

function selecttypeforecast(istype){
    if(istype == '버스'){
        return true;
    }
    else if (istype == '일반'){
        return true;
    }
    else{
        return false;
    }
}

function typeforecast(typetext){
    if(typetext == '버스서울'){
        return true;
    }
    else if (typetext == '버스지방'){
        return true;
    }
    else if (typetext == '일반서울'){
        return true;
    }
    else if(typetext == '일반지방'){
        return true;
    }
    else false;
}

function isroadnumber(typetext){
    if(typetext == '노선정보'){
        return true;
    }
    else{
        return false;
    }
}

function findroadname(typetext){
    if(typetext == '나들목정보'){
        return true;
    }
    else{
        return false;
    }
}

function nexttext(typetext){
    if(typetext == '다음'){
        return true;
    }
}

function inputroadnumber(typetext){
    if(typetext.indexOf("번") >= 0){
        return true;
    }
    else{
        return false;
    }
}
function israodnameExist(typetext){
    if(typetext.indexOf('검색') >= 0){
        return true;
    }
    else{
        return false;
    }
}


function pushmsg(eventObj){
    console.log(eventObj.source.userId);
    console.log(userroadcongest[eventObj.source.userId]);
    console.log(userroadcongestlength[eventObj.source.userId]);
    console.log(userroadcongestcount[eventObj.source.userId]);
    var isend = false;
    if (userroadcongestlength[eventObj.source.userId] < userroadcongestcount[eventObj.source.userId]){
        delete userroadcongest[eventObj.source.userId];
        delete userroadcongestcount[eventObj.source.userId];
        delete userroadcongestlength[eventObj.source.userId];
        isend = true;
    }
    if(isend == false){
    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken":eventObj.replyToken,
                 "messages":[
                        {
                            "type":"text",
                            "text":userroadcongest[eventObj.source.userId][(userroadcongestcount[eventObj.source.userId])]
                        },
                        {   "type":"text",
                            "text":userroadcongest[eventObj.source.userId][userroadcongestcount[eventObj.source.userId] + 1]
                        },
                        {
                            "type":"text",
                            "text":userroadcongest[eventObj.source.userId][userroadcongestcount[eventObj.source.userId] + 2]
                        },
                        {
                            "type":"text",
                            "text":userroadcongest[eventObj.source.userId][userroadcongestcount[eventObj.source.userId] + 3]
                        },
                        {
                            "type":"text",
                            "text":userroadcongest[eventObj.source.userId][userroadcongestcount[eventObj.source.userId] + 4]
                        }
                    ]
                }
            },(error, response, body) => {
                console.log(body)
            });
    }
    else if(isend == true){
        request.post(
            {
                url: TARGET_URL,
                headers: {
                    'Authorization': `Bearer ${TOKEN}`
                },
                json: {
                    "replyToken":eventObj.replyToken,
                     "messages":[
                            {
                                "type":"text",
                                "text":"더이상의 내용은 없습니다."
                            }
                        ]
                    }
                },(error, response, body) => {
                    console.log(body)
                });
    }
    if(userroadcongestlength[eventObj.source.userId] != (userroadcongestcount[eventObj.source.userId] + 5)){
        userroadcongestcount[eventObj.source.userId] = (userroadcongestcount[eventObj.source.userId] + 5);
    }
}
function wanttoknowfee(typetext){
    if(typetext.indexOf("-") >= 0){
        return true;
    }
    else{
        return false;
    }
}

function wanttoknowtime(typetext){
    if(typetext.indexOf(",") >= 0){
        return true;
    }else{
        return false;
    }
}



app.post('/hook', function (req, res) {
    //console.log(jsonForforecast);
    
    var isstart;
    var isforecast;
    var isselecttypeforecast;
    var isfindroad;
    var isroadname;
    var istypeforecast;
    var isinputnumber;
    var isinputroadname;
    var eventObj = req.body.events[0];
    var source = eventObj.source;
    var message = eventObj.message;
    var isnext;
    var isfee;
    var istime;
   
    // request log
    console.log('======================', new Date() ,'======================');
    console.log('[request]', req.body);
    console.log('[request source] ', source);    
    console.log('[request UserId]', source.userId);
    console.log('[request message]', message);

    console.log(userroadcongest[source.userId]);
    console.log(userroadcongestlength[source.userId]);

    isstart = ishello(message.text);
    if(isstart == true){
        console.log('[request hello] ', message);
        //console.log(count);
        helloworld(eventObj);
    }

    isfindroad = isroadnumber(message.text);
    if(isfindroad == true){
        console.log("노선번호를 궁금해 합니다.")
        roadnumber(eventObj);
    }

    isroadname = findroadname(message.text);
    if(isroadname == true){
        console.log("나들목 이름을 궁금해 합니다.");
        roadname(eventObj);
    }


    isforecast = firstforecast(message.text);
    if(isforecast){
        if(message.text == '1'){
            console.log('[request Order] ', message);
            findroad(eventObj);
        }
        else if (message.text == '2'){
            console.log('[request Order] ', message);
            viewhtml(eventObj);
        }
        else if (message.text == '3'){
            console.log('[request Order] ', message);
            tieupselect(eventObj);
        }
        else if (message.text == '4'){
            console.log("[request Order] ", message);
            leadfee(eventObj);
        }
        else if (message.text == '5') {
            console.log("[request Order] ", message);
            leadtime(eventObj);
        }
        else if (message.text == '6'){
            console.log('[request Order]', message);
            viewconstruction(eventObj);
        }else if (message.text = '7'){
            console.log('[request Order]', message);
            viewaccident(eventObj);
        }
    }

    isselecttypeforecast = selecttypeforecast(message.text);
    if(isselecttypeforecast == true){
        if( message.text == '버스'){
            console.log('버스에보')
            busforecast(eventObj);
        }
        else if(message.text == '일반'){
            console.log('일반예보');
            normalforecast(eventObj);
        }
    }

    istypeforecast = typeforecast(message.text);
    if(istypeforecast == true){
        if( message.text == '버스서울'){
            console.log('버스에보')
            busforecasttoS(eventObj);
        }
        else if(message.text == '버스지방'){
            console.log('버스예보');
            busforecasttoG(eventObj);
        }
        else if(message.text == '일반서울'){
            console.log('일반예보')
            normalforecasttoS(eventObj);
        }
        else if(message.text == '일반지방'){
            console.log('일반에보');
            normalforecasttoG(eventObj);
        }
    }
    
    isinputnumber = inputroadnumber(message.text);
    if(isinputnumber == true){
        roadcongest(eventObj, message.text, source.userId);
    }

    isnext = nexttext(message.text);
    if(isnext == true){
        pushmsg(eventObj);
        //console.log(roadnumberstring);
        //console.log(roadnumberstringLength);
    }

    isfee = wanttoknowfee(message.text);
    if(isfee == true){
        feelead(eventObj, message.text);
    }

    istime = wanttoknowtime(message.text);
    if(istime == true){
        timelead(eventObj, message.text);
    }


    isinputroadname = israodnameExist(message.text);
    if(isinputroadname == true ){
        inputroadname(eventObj, message.text);
    }



    res.sendStatus(200);
});

function helloworld(eventObj){
    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken":eventObj.replyToken,
                "messages":[
                    {
                        "type":"text",
                        "text":"안녕하세요, 교통정보 알리미입니다."
                    },
                    {
                        "type":"text",
                        "text":"무엇이 궁금하신가요??"
                    },
                    {
                        "type":"text",
                        "text":"현재 교통 예보가 궁금하시다면 '1'을, 실시간 교통혼잡 상황을 보실려면 '2'을, 실시간 정체상황을 알고 싶다면 '3'을, 교통요금이 궁금하시다면 '4'을, 나들목간 통행 평균시간이 궁금하시다면 '5'을, 실시간 공사 정보를 확인하고 싶으시면 '6'을, 실시간 사고 정보를 확인하고 싶으시다면 '7'을 입력해주세요."
                    },
                    {
                        "type":"text",
                        "text": "노선정보는 '노선정보'를 입력해주세요., 나들목정보는 '나들목정보' "
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
}

function viewhtml(eventObj){
    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken":eventObj.replyToken,
                "messages":[
                    {
                        "type":"text",
                        "text":"실시간 전국 국도 및 고속국도 교통상황 웹페이지로 안내합니다."
                    },
                    {
                        "type":"text",
                        "text":"http://www.chyoss.tk:24024/public/maprealtime.html"
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
}

function viewconstruction(eventObj){
        request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken":eventObj.replyToken,
                "messages":[
                    {
                        "type":"text",
                        "text":"실시간 고속국도 공사 상황 웹페이지로 안내합니다."
                    },
                    {
                        "type":"text",
                        "text":"https://www.chyoss.tk:23023/construction"
                    },
                    {
                        "type":"text",
                        "text":"파란색 마커을 클릭하여 정보를 확인해 보세요!"
                    },
                    {
                        "type":"text",
                        "text":"파란색 마커가 표시되지 않는다면, 현재 공사중인 곳이 없다는 뜻입니다."
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
}

function viewaccident(eventObj){
    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken":eventObj.replyToken,
                "messages":[
                    {
                        "type":"text",
                        "text":"실시간 고속국도 공사 상황 웹페이지로 안내합니다."
                    },
                    {
                        "type":"text",
                        "text":"https://www.chyoss.tk:23023/accident"
                    },
                    {
                        "type":"text",
                        "text":"파란색 마커를 클릭하여 정보를 확인해 보세요!"
                    },
                    {
                        "type":"text",
                        "text":"파란색 마커가 표시되지 않는다면, 현재 발생한 사고는 없다는 뜻입니다."
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
}


function leadfee(eventObj){
    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken":eventObj.replyToken,
                "messages":[
                    {
                        "type":"text",
                        "text":"요금안내를 시작합니다."
                    },
                    {
                        "type":"text",
                        "text":"출발하신 나들목(IC)의 이름과 도착하실 나들목(IC)의 이름을 순서대로 적어주세요."
                    },
                    {
                        "type":"text",
                        "text":"예)남안동-서안동"
                    },
                    {
                        "type":"text",
                        "text":"예) 예천-서안동"
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
}

function leadtime(eventObj){
    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken":eventObj.replyToken,
                "messages":[
                    {
                        "type":"text",
                        "text":"나들목(영업소)간 평균 통행시간 안내를 시작합니다."
                    },
                    {
                        "type":"text",
                        "text":"불완전한 서비스입니다. 정보 제공처에서 제공을 안할 수 있습니다. 이점 유의해 주세요."
                    },
                    {
                        "type":"text",
                        "text":"출발하실 나들목(IC)의 이름과 도착하실 나들목(IC)의 이름을 순서대로 적어주세요."
                    },
                    {
                        "type":"text",
                        "text":"예)남안동,서안동"
                    },
                    {
                        "type":"text",
                        "text":"예) 예천,서안동"
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
}



function findroad(eventObj){
    jsonforecast(function(object){
        var obj = object;
        var jsonForforecast = obj;
        console.log(jsonForforecast);
        var year = jsonForforecast.list[0].sdate.substr(0,4);
        var month = jsonForforecast.list[0].sdate.substr(4,2);
        var day = jsonForforecast.list[0].sdate.substr(6,2);
        var hour = jsonForforecast.list[0].stime.substr(0,2);
        var min = jsonForforecast.list[0].stime.substr(2,2);
        request.post(
            {
                url: TARGET_URL,
                headers: {
                    'Authorization': `Bearer ${TOKEN}`
                },
                json: {
                    "replyToken":eventObj.replyToken,
                    "messages":[
                        {
                            "type":"text",
                            "text":"교통예보를 시작합니다."
                        },
                        {
                            "type":"text",
                            "text": year + '년 ' + month + "월 " + day + "일 " + hour + ":" + min + "기준입니다."
                        },
                        {
                            "type":"text",
                            "text": '현재 전국 교통량은 대략' + jsonForforecast.list[0].cjunkook + '대 이며, 지방방향 교통량은 대략 ' + jsonForforecast.list[0].cjibangDir + '대, 서울방향 교통량은 대략 ' + jsonForforecast.list[0].cseoulDir + '대입니다.'
                        },
                        {
                            "type":"text",
                            "text":"버스기준으로 보시겠습니까 아니면 일반 승용차 기준으로 보시겠습니까? 버스기준으로 보실려면 '버스'를, 일반 승용차 기준으로 보실려면 '일반'을 입력해 주세요."
                        }
                    ]
                }
            },(error, response, body) => {
                console.log(body)
            });
    });

}


function busforecast(eventObj){
    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken":eventObj.replyToken,
                "messages":[
                    {
                        "type":"text",
                        "text":"버스 예보를 시작합니다."
                    },
                    {
                        "type":"text",
                        "text":"'서울발 지방행' 교통예보는 '버스서울'을,"
                    },
                    {
                        "type":"text",
                        "text":"'지방발 서울행' 교통예보는 '버스지방'을 입력해주세요"
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
}



function normalforecast(eventObj){
    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken":eventObj.replyToken,
                "messages":[
                    {
                        "type":"text",
                        "text":"일반 승용차 예보를 시작합니다."
                    },
                    {
                        "type":"text",
                        "text":"'서울발 지방행' 교통예보는 '일반서울'을,"
                    },
                    {
                        "type":"text",
                        "text":"'지방발 서울행' 교통예보는 '일반지방'을 입력해주세요"
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
}



function busforecasttoS(eventObj){
    jsonforecast(function(object){
        var obj = object;
        var jsonForforecast = obj;
        console.log(jsonForforecast);
        request.post(
            {
                url: TARGET_URL,
                headers: {
                    'Authorization': `Bearer ${TOKEN}`
                },
                json: {
                    "replyToken":eventObj.replyToken,
                    "messages":[
                        {
                            "type":"text",
                            "text":"서울발 버스 소요 시간은 다음과 같습니다."
                        },
                        {
                            "type":"text",
                            "text":'서울발 대전행 : 대략 ' + jsonForforecast.list[0].csudj_bus + '소요 예상 , ' + '서울발 대구행 : 대략 ' + jsonForforecast.list[0].csudg_bus + '소요 예상'
                        },
                        {
                            "type":"text",
                            "text":'서울발 울산행 : 대략 ' + jsonForforecast.list[0].csuus_bus + '소요 예상, ' + '서울발 부산행 : 대략 ' + jsonForforecast.list[0].csubs_bus + '소요 예상'
                        },
                        {
                            "type":"text",
                            "text":'서울발 목포행 : 대략 ' + jsonForforecast.list[0].csump_bus + '소요 예상, ' + '서울발 광주행 : 대략 ' + jsonForforecast.list[0].csugj_bus + '소요 예상'
                        },
                        {
                            "type":"text",
                            "text":'서울발 강릉행 : 대략 ' + jsonForforecast.list[0].csukr_bus + '소요 예상'
                        }
    
                    ]
                }
            },(error, response, body) => {
                console.log(body)
            });

    });

}
    
    

function busforecasttoG(eventObj){
    jsonforecast(function(object){
        var obj = object;
        var jsonForforecast = obj;
        request.post(
            {
                url: TARGET_URL,
                headers: {
                    'Authorization': `Bearer ${TOKEN}`
                },
                json: {
                    "replyToken":eventObj.replyToken,
                    "messages":[
                        {
                            "type":"text",
                            "text":"지방발 버스 소요 시간은 다음과 같습니다."
                        },
                        {
                            "type":"text",
                            "text":"대전발 서울행 : 대략 " + jsonForforecast.list[0].cdjsu_bus + "소요 예상, " + "대구발 서울행 : 대략 " + jsonForforecast.list[0].cdgsu_bus + "소요 예상"
                        },           
                        {
                            "type":"text",
                            "text":"울산발 서울행 : 대략 " + jsonForforecast.list[0].cussu_bus + "소요 예상, " + "부산발 서울행 : 대략 " + jsonForforecast.list[0].cbssu_bus + "소요 예상"
                        },
                        {
                            "type":"text",
                            "text":"목포발 서울행 : 대략 " + jsonForforecast.list[0].cmpsu_bus + "소요 예상, " + "광주발 서울행 : 대략 " + jsonForforecast.list[0].cgjsu_bus + "소요 예상"  
                        },
                        {
                            "type":"text",
                            "text":"강릉발 서울행 : 대략 " + jsonForforecast.list[0].ckrsu_bus + "소요 예상"
                        }
    
                    ]
                }
            },(error, response, body) => {
                console.log(body)
            });

    });

}

function normalforecasttoS(eventObj){
    jsonforecast(function(object){
        var obj = object;
        var jsonForforecast = obj;
        console.log(jsonForforecast);
        request.post(
            {
                url: TARGET_URL,
                headers: {
                    'Authorization': `Bearer ${TOKEN}`
                },
                json: {
                    "replyToken":eventObj.replyToken,
                    "messages":[
                        {
                            "type":"text",
                            "text":"서울발 일반 자가용 소요 시간은 다음과 같습니다."
                        },
                        {
                            "type":"text",
                            "text":'서울발 대전행 : 대략 ' + jsonForforecast.list[0].csudj + '소요 예상 , ' + '서울발 대구행 : 대략 ' + jsonForforecast.list[0].csudg + '소요 예상'
                        },
                        {
                            "type":"text",
                            "text":'서울발 울산행 : 대략 ' + jsonForforecast.list[0].csuus + '소요 예상, ' + '서울발 부산행 : 대략 ' + jsonForforecast.list[0].csubs + '소요 예상'
                        },
                        {
                            "type":"text",
                            "text":'서울발 목포행 : 대략 ' + jsonForforecast.list[0].csump + '소요 예상, ' + '서울발 광주행 : 대략 ' + jsonForforecast.list[0].csugj + '소요 예상'
                        },
                        {
                            "type":"text",
                            "text":'서울발 강릉행 : 대략 ' + jsonForforecast.list[0].csukr + '소요 예상'
                        }
    
                    ]
                }
            },(error, response, body) => {
                console.log(body)
            });

    });


}


function normalforecasttoG(eventObj){
    jsonforecast(function(object){
        var obj = object;
        var jsonForforecast = obj;
        request.post(
            {
                url: TARGET_URL,
                headers: {
                    'Authorization': `Bearer ${TOKEN}`
                },
                json: {
                    "replyToken":eventObj.replyToken,
                    "messages":[
                        {
                            "type":"text",
                            "text":"지방발 일반 자가용 소요 시간은 다음과 같습니다."
                        },
                        {
                            "type":"text",
                            "text":"대전발 서울행 : 대략 " + jsonForforecast.list[0].cdjsu + "소요 예상, " + "대구발 서울행 : 대략 " + jsonForforecast.list[0].cdgsu + "소요 예상"
                        },           
                        {
                            "type":"text",
                            "text":"울산발 서울행 : 대략 " + jsonForforecast.list[0].cussu + "소요 예상, " + "부산발 서울행 : 대략 " + jsonForforecast.list[0].cbssu + "소요 예상"
                        },
                        {
                            "type":"text",
                            "text":"목포발 서울행 : 대략 " + jsonForforecast.list[0].cmpsu + "소요 예상, " + "광주발 서울행 : 대략 " + jsonForforecast.list[0].cgjsu + "소요 예상"  
                        },
                        {
                            "type":"text",
                            "text":"강릉발 서울행 : 대략 " + jsonForforecast.list[0].ckrsu + "소요 예상"
                        }
    
                    ]
                }
            },(error, response, body) => {
                console.log(body)
            });

    });

}

function roadnumber(eventObj){
    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken":eventObj.replyToken,
                "messages":[
                    {
                        "type":"text",
                        "text":"고속도로 노선 번호는 다음과 같습니다."
                    },
                    {
                        "type":"text",
                        "text":"경부 및 남북 구간: 1-경부선, 15-서해안선, 17-평택파주선, 25-호남 및 논산천안선, 27-순천완주선, 29-세종포천지선, 35-통영대전 및 중부선, 37-제2중부선, 45-중부내륙선, 55-중앙선, 65-동해선"
                    },
                    {
                        "type":"text",
                        "text":"동서 구간 : 10-남해선, 12-무안광주 및 광주대구선, 16-울산선, 20-새만금포항선, 30-당진영덕선, 32-아산청주선, 40-평택제천선, 50-영동선, 52-광주원주선, 60-서울양양선"
                    },
                    {
                        "type":"text",
                        "text":"순환 및 경인 구간: 100-서울외각순환선, 300-대전남부선, 400-수도권제2순환, 600-부산외곽순환선, 110-제2 경인선, 120-경인선, 130-인천공항선"
                    },
                    {
                        "type":"text",
                        "text":"지선 구간: 102-남해 제1지선, 104-남해 제2지선, 105-남해 제3지선, 151-서천공주선, 153-평택시흥선, 171-오산화성 및 용인서울선, 204-새만금포항지선2, 251-호남지선, 253-고참담양선, 301-상주영천선, 451-중부내륙지선, 551-중앙지선"
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
}

function roadname(eventObj){
    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken":eventObj.replyToken,
                "messages":[
                    {
                        "type":"text",
                        "text":"나들목 이름이 궁금하시다면 <검색:이름>을 입력해 주세요."
                    },
                    {
                        "type":"text",
                        "text":"예) 검색:서안동"
                    },
                    {
                        "type":"text",
                        "text":"예) 검색:안동"
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
}



function tieupselect(eventObj){
        request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken":eventObj.replyToken,
                "messages":[
                {
                    "type":"text",
                    "text":"실시간 고속도로 정체상황 안내를 시작합니다."
                },
                {
                    "type":"text",
                    "text":"궁금한 노선번호를 입력해 주세요. 그리고 '다음'을 꼭 입력해 주세요. 계속해서 보실려면 '다음'을 눌러주세요."
                },
                {
                    "type":"text",
                    "text":"예) 100번"
                },
                {
                    "type":"text",
                    "text":"반드시 노선번호(숫자)뒤에 '번'을 꼭 입력해주세요."
                }
                ]
            }
        },(error, response, body) => {
            console.log(body)
    });
}

function inputroadname(eventObj, msg){
    var icnamelist = new Array();
    var iclist = "";
    var ExpressICnameLength = namedata.unitLists.length;
    var icnamelist = msg.split(':');
    var isthat = false;
    var iscount = 0;
    console.log(ExpressICnameLength);
    console.log(icnamelist[1]);
    for(var i = 0; i < ExpressICnameLength; i++){
        if(namedata.unitLists[i].unitName.indexOf(icnamelist[1]) >= 0 ){
            isthat = true;
            iscount += 1;
            iclist += "#" + String(iscount) + " " + namedata.unitLists[i].unitName + "  ";
        }
    }

    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken":eventObj.replyToken,
                "messages":[
                    {
                        "type":"text",
                        "text":"검색결과입니다. : " + iclist
                    }

                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
}




function roadcongest(eventObj, msg, userid){
    //jsoncongest의 routeNo는 앞의 세자리가 노선 번호, 마지막 숫자가 제1 중부내륙, 제2 중부내륙 처럼 노선번호는 같으나 노선의 경로가 다른 경우를 나타내며, 혹은 구간구간 개통된 고속도로를 구분지을 때도 구별용으로 사용됨으로 필요가 없음.
    jsoncongest(function(object){
        var obj = object;
        var jsonForcongest = obj;
        var number = msg.replace('번', '').trim();
        var iscount = 0;
        var index = 0;
        console.log(number);
        count = 0;
        //console.log(count);
        var roadnumberstringLength = 0;
        var roadnumberstring = new Array();
        console.log(roadnumberstring);
        
        if(number.length == 1){ //노선번호가 한자수일 경우, 노선을 찾을 때 두자리 혹은 세자리 번호와 겹칠 수 있으므로.
            number = "00" + number;
        }
        else if (number.length == 2){
            number = "0" + number;
        }

        for(var i = 0; i < jsonForcongest.list.length; i++){
            if(jsonForcongest.list[i].routeNo.indexOf(number) >= 0){
                roadnumberstring[iscount] = ("# 노선이름: " + jsonForcongest.list[i].routeName + ", 정체구간: " + jsonForcongest.list[i].conzoneName + ', 기점종점방향: ' + jsonForcongest.list[i].updownTypeCode + ', 교통량: ' + jsonForcongest.list[i].trafficAmout + ', 평균속도: ' + jsonForcongest.list[i].speed);
                iscount += 1;
            }
            
        }

        roadnumberstringLength = roadnumberstring.length;
        if(roadnumberstringLength != 0){
            roadnumberstring[roadnumberstringLength] = "이상입니다.";
            index = (roadnumberstringLength % 5);
            if(index >= 0){
                for(var i = 1; i <= (4-index); i++ ){
                    roadnumberstring[roadnumberstringLength + i] = "Out of range";
                }
            }
            console.log(roadnumberstring);
            userroadcongest[userid] = roadnumberstring;
            userroadcongestlength[userid] = roadnumberstringLength;
            userroadcongestcount[userid] = 0;

    
            
            request.post(
                {
                    url: TARGET_URL,
                    headers: {
                        'Authorization': `Bearer ${TOKEN}`
                    },
                    json: {
                        "replyToken":eventObj.replyToken,
                        "messages":[
                            {
                                "type":"text",
                                "text":"검색하신 노선에서 발견된 정체량은 총 " + String(userroadcongestlength[userid]) + "입니다."
                            },
                            {
                                "type":"text",
                                "text":"계속해서 보실려면 '다음'을 입력해 주세요."
                            },
                            {
                                "type":"text",
                                "text":"마지막 항목이 나올때까지 계속해서 '다음'을 입력해 주세요."
                            }
        
                        ]
                    }
                },(error, response, body) => {
                    console.log(body)
                });

        }
        
        if(roadnumberstringLength == 0){
            var Notfoundroadnumberstring = "검색하신 노선에서 발견된 정체구간은 없습니다.";
            request.post(
                {
                    url: TARGET_URL,
                    headers: {
                        'Authorization': `Bearer ${TOKEN}`
                    },
                    json: {
                        "replyToken":eventObj.replyToken,
                        "messages":[
                            {
                                "type":"text",
                                "text":Notfoundroadnumberstring
                            }
        
                        ]
                    }
                },(error, response, body) => {
                    console.log(body)
                });
            }
    });
}

function feelead(eventObj, msg){

    var isthat = false;
    var feelist = new Array();
    var inputoutputIC = msg.split('-');
    var ExpressfeeLength = feedata.Expressfee.length;
    for(var i = 0; i < ExpressfeeLength; i++){
        if(inputoutputIC[0] == feedata.Expressfee[i].출발지명 && inputoutputIC[1] == feedata.Expressfee[i].도착지명){
            isthat = true;
            feelist[0] = feedata.Expressfee[i][" 요금_1종 "];
            feelist[1] = feedata.Expressfee[i][" 요금_2종 "];
            feelist[2] = feedata.Expressfee[i][" 요금_3종 "];
            feelist[3] = feedata.Expressfee[i][" 요금_4종 "];
            feelist[4] = feedata.Expressfee[i][" 요금_5종 "];
            feelist[5] = feedata.Expressfee[i][" 요금_경차 "];
        }
    }
    if(isthat == true){
        request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken":eventObj.replyToken,
                "messages":[
                {
                    "type":"text",
                    "text":"출발지점: " + inputoutputIC[0] + ", 도착지점: " + inputoutputIC[1]
                },
                {
                    "type":"text",
                    "text":"1종 요금 : " + feelist[0] + ", 2종 요금 : " + feelist[1]
                },
                {
                    "type":"text",
                    "text":"3종 요금 : " + feelist[2] + ", 4종 요금 : " + feelist[3]
                },
                {
                    "type":"text",
                    "text":"5종 요금 : " + feelist[4] + ", 경차 요금 : " + feelist[5]
                }
                ]
            }
        },(error, response, body) => {
            console.log(body)
         });
    }
    else {
        request.post(
            {
                url: TARGET_URL,
                headers: {
                    'Authorization': `Bearer ${TOKEN}`
                },
                json: {
                    "replyToken":eventObj.replyToken,
                    "messages":[
                    {
                        "type":"text",
                        "text":"발견된 지점이 없습니다. 다시 입력해 주세요"
                    }
                    ]
                }
            },(error, response, body) => {
                console.log(body)
             });
    }
}


function timelead(eventObj, msg){
    var isstart = false;
    var isend = false;
    var start = "";
    var end = "";
    var inputoutputIC = msg.split(',');
    inputoutputIC[0].trim();
    inputoutputIC[1].trim();
    console.log(inputoutputIC[0]);
    console.log(inputoutputIC[1]);
    var length = namedata.unitLists.length;
    for(var i = 0; i < length; i++){
        if(namedata.unitLists[i].unitName == inputoutputIC[0]){
            
            start = namedata.unitLists[i].unitCode;
            isstart = true;
        }
        if(namedata.unitLists[i].unitName == inputoutputIC[1]){
            end = namedata.unitLists[i].unitCode;
            isend = true;
        }
    }

    if(isstart == true && isend == true){
        jsonICtoICtime(start, end, function(Object){
            var avgTime = new Array();
            var ICtimejson = Object;
            console.log(ICtimejson);
            if(ICtimejson.count > 0){
                var avgTime = ICtimejson.realUnitTrtmVO[0].timeAvg;
                request.post(
                    {
                        url: TARGET_URL,
                        headers: {
                        'Authorization': `Bearer ${TOKEN}`
                        },
                        json: {
                            "replyToken":eventObj.replyToken,
                            "messages":[
                            {
                                "type":"text",
                                "text":ICtimejson.realUnitTrtmVO[0].startUnitNm + "나들목에서 " + ICtimejson.realUnitTrtmVO[0].endUnitNm + "나들목까지 평균 소요시간은 " + avgTime + "분 입니다."
                            }
                            ]
                        }
                    },(error, response, body) => {
                        console.log(body)
                    });
            
            }
            else{
                request.post(
                    {
                        url: TARGET_URL,
                        headers: {
                        'Authorization': `Bearer ${TOKEN}`
                        },
                        json: {
                            "replyToken":eventObj.replyToken,
                            "messages":[
                            {
                                "type":"text",
                                "text":"죄송합니다. 정보가 없습니다."
                            }
                            ]
                        }
                    },(error, response, body) => {
                        console.log(body)
                    });
            }
        });
    }
    else{
        request.post(
            {
                url: TARGET_URL,
                headers: {
                'Authorization': `Bearer ${TOKEN}`
                },
                json: {
                    "replyToken":eventObj.replyToken,
                    "messages":[
                    {
                        "type":"text",
                        "text":"일치하는 나들목이 없습니다. 다시 입력해 주세요."
                    }
                    ]
                }
            },(error, response, body) => {
                console.log(body)
            });
    }
}


try {
    const option = {
      ca: fs.readFileSync('/etc/letsencrypt/live/' + domain +'/fullchain.pem'),
      key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/privkey.pem'), 'utf8').toString(),
      cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/cert.pem'), 'utf8').toString(),
    };
  
    HTTPS.createServer(option, app).listen(sslport, () => {
      console.log(`[HTTPS] Server is started on port ${sslport}`);
    });
    
    var server = app.listen(24024, function () {
        var host = server.address().address
        var port = server.address().port
        console.log("Example app listening at http://%s:%s", host, port)
    }); 

  } catch (error) {
    console.log('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
    console.log(error);
  }