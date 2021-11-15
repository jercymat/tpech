var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = {
    header_mode: 0,
    branches: ['仁愛', '中興', '和平', '婦幼', '林森', '陽明', '忠孝', '松德', '昆明', '中醫'],
    clinics: [
      '社區心理衛生中心', '政大門診部', '北投門診部', '萬華門診部',
      '內湖門診部','信義門診部', '南港門診部', '大同門診部',
      '中正門診部', '中山門診部', '士林門診部', '士林中醫門診部',
      '大安門診部', '松山門診部'
    ],
    depts: [
      {
        "DGROUP_CODE": "A000",
        "DGROUP_NAME": "內科醫療部",
        "DEPTS": [
          {
            "HDEPT_CODE": "1100",
            "HDEPT_NAME": "皮膚科"
          },
          {
            "HDEPT_CODE": "0202",
            "HDEPT_NAME": "預立醫療照護諮商"
          },
          {
            "HDEPT_CODE": "1200",
            "HDEPT_NAME": "神經內科"
          },
          {
            "HDEPT_CODE": "AC00",
            "HDEPT_NAME": "胸腔內科"
          },
          {
            "HDEPT_CODE": "AH00",
            "HDEPT_NAME": "內科(二)"
          },
          {
            "HDEPT_CODE": "FA00",
            "HDEPT_NAME": "老人醫學及放射診斷科"
          },
          {
            "HDEPT_CODE": "AE00",
            "HDEPT_NAME": "過敏免疫風濕科"
          },
          {
            "HDEPT_CODE": "1200",
            "HDEPT_NAME": "75高齡門診"
          },
          {
            "HDEPT_CODE": "FA00",
            "HDEPT_NAME": "椎體骨折骨泥手術特別門診"
          },
          {
            "HDEPT_CODE": "AF00",
            "HDEPT_NAME": "血液腫瘤科"
          },
          {
            "HDEPT_CODE": "FA00",
            "HDEPT_NAME": "乳房影像特別門診"
          },
          {
            "HDEPT_CODE": "AA00",
            "HDEPT_NAME": "消化內科"
          },
          {
            "HDEPT_CODE": "2291",
            "HDEPT_NAME": "新冠自費檢驗門診"
          },
          {
            "HDEPT_CODE": "0200",
            "HDEPT_NAME": "一般內科"
          },
          {
            "HDEPT_CODE": "1400",
            "HDEPT_NAME": "復健科"
          },
          {
            "HDEPT_CODE": "AD00",
            "HDEPT_NAME": "腎臟內科"
          },
          {
            "HDEPT_CODE": "AG00",
            "HDEPT_NAME": "內分泌及新陳代謝科"
          },
          {
            "HDEPT_CODE": "0003",
            "HDEPT_NAME": "飲食指導"
          },
          {
            "HDEPT_CODE": "AB00",
            "HDEPT_NAME": "心臟血管內科"
          },
          {
            "HDEPT_CODE": "FB00",
            "HDEPT_NAME": "放射腫瘤科"
          },
          {
            "HDEPT_CODE": "FB00",
            "HDEPT_NAME": "放射線腫瘤科"
          },
          {
            "HDEPT_CODE": "AG00",
            "HDEPT_NAME": "糖眼整合門診"
          },
          {
            "HDEPT_CODE": "0003",
            "HDEPT_NAME": "營養諮詢"
          },
          {
            "HDEPT_CODE": "AH00",
            "HDEPT_NAME": "一般內科"
          },
          {
            "HDEPT_CODE": "AF00",
            "HDEPT_NAME": "血液腫瘤科(中西整合)"
          },
          {
            "HDEPT_CODE": "AG00",
            "HDEPT_NAME": "糖尿病腎臟保健整合門診"
          },
          {
            "HDEPT_CODE": "AH00",
            "HDEPT_NAME": "感染科"
          },
          {
            "HDEPT_CODE": "AG00",
            "HDEPT_NAME": "糖尿病心臟保健整合門診"
          },
          {
            "HDEPT_CODE": "AH00",
            "HDEPT_NAME": "感染科(新冠自費檢驗門診)"
          },
          {
            "HDEPT_CODE": "0200",
            "HDEPT_NAME": "一般內科(中西整合)"
          },
          {
            "HDEPT_CODE": "AH00",
            "HDEPT_NAME": "特約門診"
          }
        ]
      },
      {
        "DGROUP_CODE": "B000",
        "DGROUP_NAME": "外科醫療部",
        "DEPTS": [
          {
            "HDEPT_CODE": "0800",
            "HDEPT_NAME": "泌尿科"
          },
          {
            "HDEPT_CODE": "0300",
            "HDEPT_NAME": "一般外科"
          },
          {
            "HDEPT_CODE": "0900",
            "HDEPT_NAME": "耳鼻喉科"
          },
          {
            "HDEPT_CODE": "1000",
            "HDEPT_NAME": "眼科"
          },
          {
            "HDEPT_CODE": "0600",
            "HDEPT_NAME": "骨科"
          },
          {
            "HDEPT_CODE": "BB00",
            "HDEPT_NAME": "心臟血管外科"
          },
          {
            "HDEPT_CODE": "DA00",
            "HDEPT_NAME": "疼痛門診"
          },
          {
            "HDEPT_CODE": "BC00",
            "HDEPT_NAME": "胸腔外科"
          },
          {
            "HDEPT_CODE": "1500",
            "HDEPT_NAME": "整形外科"
          },
          {
            "HDEPT_CODE": "0700",
            "HDEPT_NAME": "神經外科"
          },
          {
            "HDEPT_CODE": "BD00",
            "HDEPT_NAME": "消化外科"
          },
          {
            "HDEPT_CODE": "0300",
            "HDEPT_NAME": "甲狀腺乳房外科"
          },
          {
            "HDEPT_CODE": "0300",
            "HDEPT_NAME": "乳房門診"
          },
          {
            "HDEPT_CODE": "BA00",
            "HDEPT_NAME": "直腸外科"
          },
          {
            "HDEPT_CODE": "DA00",
            "HDEPT_NAME": "疼痛科"
          },
          {
            "HDEPT_CODE": "0300",
            "HDEPT_NAME": "一般外科(消化外、直腸外科)"
          },
          {
            "HDEPT_CODE": "0300",
            "HDEPT_NAME": "乳房外科"
          },
          {
            "HDEPT_CODE": "0300",
            "HDEPT_NAME": "乳房特別門診(一般外科)"
          },
          {
            "HDEPT_CODE": "CA00",
            "HDEPT_NAME": "小兒外科"
          },
          {
            "HDEPT_CODE": "1500",
            "HDEPT_NAME": "美容醫學門診"
          },
          {
            "HDEPT_CODE": "0300",
            "HDEPT_NAME": "一般外科(ABVS全自動乳房超音波)"
          }
        ]
      },
      {
        "DGROUP_CODE": "C000",
        "DGROUP_NAME": "婦幼醫療部",
        "DEPTS": [
          {
            "HDEPT_CODE": "0400",
            "HDEPT_NAME": "小兒科"
          },
          {
            "HDEPT_CODE": "0500",
            "HDEPT_NAME": "婦產科"
          },
          {
            "HDEPT_CODE": "0400",
            "HDEPT_NAME": "兒童保健暨疫苗接種"
          },
          {
            "HDEPT_CODE": "0400",
            "HDEPT_NAME": "健兒門診(含疫苗接種)"
          }
        ]
      },
      {
        "DGROUP_CODE": "D000",
        "DGROUP_NAME": "社區醫療部",
        "DEPTS": [
          {
            "HDEPT_CODE": "010B",
            "HDEPT_NAME": "門診體檢"
          },
          {
            "HDEPT_CODE": "0100",
            "HDEPT_NAME": "家庭醫學科"
          },
          {
            "HDEPT_CODE": "2300",
            "HDEPT_NAME": "職業醫學科"
          },
          {
            "HDEPT_CODE": "0100",
            "HDEPT_NAME": "老人醫學整合門診"
          },
          {
            "HDEPT_CODE": "0100",
            "HDEPT_NAME": "預立醫療照護諮商門診"
          },
          {
            "HDEPT_CODE": "0100",
            "HDEPT_NAME": "門診體檢"
          },
          {
            "HDEPT_CODE": "0100",
            "HDEPT_NAME": "成人健檢"
          },
          {
            "HDEPT_CODE": "0100",
            "HDEPT_NAME": "婚前健檢"
          },
          {
            "HDEPT_CODE": "0100",
            "HDEPT_NAME": "流感疫苗特別門診"
          },
          {
            "HDEPT_CODE": "0100",
            "HDEPT_NAME": "老人健檢"
          },
          {
            "HDEPT_CODE": "0100",
            "HDEPT_NAME": "家庭醫學科(兼一般婦科)"
          },
          {
            "HDEPT_CODE": "0100",
            "HDEPT_NAME": "家庭醫學科(泌尿特別門診)"
          }
        ]
      },
      {
        "DGROUP_CODE": "E000",
        "DGROUP_NAME": "精神醫療部",
        "DEPTS": [
          {
            "HDEPT_CODE": "1300",
            "HDEPT_NAME": "精神科"
          },
          {
            "HDEPT_CODE": "1305",
            "HDEPT_NAME": "表達性治療特別門診"
          },
          {
            "HDEPT_CODE": "1305",
            "HDEPT_NAME": "心理健康諮詢特別門診"
          },
          {
            "HDEPT_CODE": "1300",
            "HDEPT_NAME": "精神科(兒童青少年門診)"
          },
          {
            "HDEPT_CODE": "1301",
            "HDEPT_NAME": "兒童青少年精神科"
          },
          {
            "HDEPT_CODE": "1302",
            "HDEPT_NAME": "成癮防治科"
          },
          {
            "HDEPT_CODE": "1303",
            "HDEPT_NAME": "心身醫學科"
          }
        ]
      },
      {
        "DGROUP_CODE": "F000",
        "DGROUP_NAME": "牙科醫療部",
        "DEPTS": [
          {
            "HDEPT_CODE": "4000",
            "HDEPT_NAME": "牙科(含身心障礙特別門診)"
          },
          {
            "HDEPT_CODE": "4000",
            "HDEPT_NAME": "牙科"
          },
          {
            "HDEPT_CODE": "4000",
            "HDEPT_NAME": "牙科約診(含身心障礙特別門診)"
          }
        ]
      },
      {
        "DGROUP_CODE": "G000",
        "DGROUP_NAME": "中醫醫學部",
        "DEPTS": [
          {
            "HDEPT_CODE": "6003",
            "HDEPT_NAME": "中醫傷科"
          },
          {
            "HDEPT_CODE": "6000",
            "HDEPT_NAME": "中醫科(夜間門診)"
          },
          {
            "HDEPT_CODE": "6006",
            "HDEPT_NAME": "中醫婦科"
          },
          {
            "HDEPT_CODE": "6001",
            "HDEPT_NAME": "中醫內科"
          },
          {
            "HDEPT_CODE": "6002",
            "HDEPT_NAME": "中醫針灸科"
          },
          {
            "HDEPT_CODE": "6001",
            "HDEPT_NAME": "中醫失智門診"
          },
          {
            "HDEPT_CODE": "6006",
            "HDEPT_NAME": "中醫婦(兒)科"
          },
          {
            "HDEPT_CODE": "6006",
            "HDEPT_NAME": "徒手治療特別門診"
          },
          {
            "HDEPT_CODE": "6003",
            "HDEPT_NAME": "中醫傷(皮膚)科"
          },
          {
            "HDEPT_CODE": "6002",
            "HDEPT_NAME": "中醫針灸"
          },
          {
            "HDEPT_CODE": "6001",
            "HDEPT_NAME": "腫瘤整合門診"
          },
          {
            "HDEPT_CODE": "6000",
            "HDEPT_NAME": "中醫科"
          },
          {
            "HDEPT_CODE": "6008",
            "HDEPT_NAME": "中醫兒科"
          },
          {
            "HDEPT_CODE": "6001",
            "HDEPT_NAME": "癌症特別門診"
          },
          {
            "HDEPT_CODE": "6009",
            "HDEPT_NAME": "中西醫整合科"
          },
          {
            "HDEPT_CODE": "6007",
            "HDEPT_NAME": "中醫外科(皮膚)"
          }
        ]
      }
    ]
  };
  res.render('index', data);
});

module.exports = router;
