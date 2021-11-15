var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');

/* GET home page. */
router.get('/', function (req, res, next) {
  const data = {
    'header_mode': 0,
    'hptl_name': '仁愛醫院',
    'dept_name': '一般內科',
    'query_dates': ['8/24(一)', '8/25(二)', '8/26(三)', '8/27(四)', '8/28(五)', '8/29(六)'],
    'query_clinics': {
      '0824': {
        '1': [],
        '2': [],
        '3': []
      },
      '0825': {
        '1': [],
        '2': [],
        '3': []
      },
      '0826': {
        '1': [],
        '2': [],
        '3': []
      },
      '0827': {
        '1': [],
        '2': [],
        '3': []
      },
      '0828': {
        '1': [],
        '2': [],
        '3': []
      },
      '0829': {
        '1': [],
        '2': [],
        '3': []
      }
    }
  };

  async.waterfall([
    (callback) => { // 撈該科門診總表
      const port = process.env.PORT || '3000';
      const url = `http://localhost:${port}/api/getClinicsByDept?dept_id=${req.query.dept}`;
      console.log(url);
      request(
        url,
        (error, response, body) => {
          if (error) {
            console.error(error);
            callback(null, { data: [] });
          } else {
            const resJson = JSON.parse(body);
            if (resJson.status) {
              callback(null, resJson);
            } else {
              callback(null, { data: []});
            }
          }
        });
    },
    (resJson, callback) => { // 從門診表挑出指定日期
      const clinics = Array.from(resJson.data);
      console.log(clinics.length);
      var clinicIdx = 0;
      if (clinics.length != 0)
        clinics.forEach(clinic => {
          if (clinic.REG_DATE_MM == '08') {
            if (parseInt(clinic.REG_DATE_DD) <= 29 && parseInt(clinic.REG_DATE_DD) >= 24) {
              clinic.SNO = clinicIdx;
              clinicIdx += 1;
              data.query_clinics[`08${clinic.REG_DATE_DD}`][clinic.NOON_CODE].push(clinic);
            }
          }
      });
      
      console.log(data.query_clinics['0825']['1'][1]);
      console.log(data.query_clinics['0825']['1'][2]);
      callback(null);
    },
    (callback) => { // 補上醫院名字
      const port = process.env.PORT || '3000';
      const url = `http://localhost:${port}/api/getHptlByID?id=${req.query.hptl}`;
      request(
        url,
        (error, response, body) => {
          if (error) {
            console.error(error);
            data.hosp_name = 'ERROR';
          } else {
            const resJson = JSON.parse(body);
            const name = resJson.data.HOSP_NAME;
            data.hptl_name = name + '院區';
          }
          callback(null);
        });
    },
    (callback) => { // 補上科別名字
      const port = process.env.PORT || '3000';
      const url = `http://localhost:${port}/api/getHptlDeptsByID?id=${req.query.hptl}`;
      request(
        url,
        (error, response, body) => {
          if (error) {
            console.error(error);
            data.dept_name = 'ERROR';
          } else {
            const resJson = JSON.parse(body);
            var found = false;
            resJson.data.forEach(dgroup => {
              dgroup.DEPTS.forEach(dept => {
                if (!found) {
                  if (dept.HDEPT_CODE == req.query.dept) {
                    found = true;
                    data.dept_name = dept.HDEPT_NAME;
                  }
                }
              });
            });

            if (!data.dept_name) data.dept_name = 'ERROR';
          }
          callback(null, data);
        });
    },
    (dataForRender, callback) => {
      res.render('./reg/index', dataForRender);
    }
  ]);

  console.log(`${req.query.hptl} -- ${req.query.dept}`);
});

router.get('/reg_data', function(req, res, next) {
  const data = {
    'header_mode': 0,
    'clinic_id': req.query.clinic_id
  };
  
  var clinic = null;

  async.waterfall([
    (callback) => { // 取得門診資料
      const port = process.env.PORT || '3000';
      const url = `http://localhost:${port}/api/getClinicByID?clinic_id=${req.query.clinic_id}`;

      request(
        url,
        (error, response, body) => {
          if (error) {
            console.error(error);
            data.hosp_name = 'ERROR';
            data.dgroup_name = 'ERROR';
            data.dept_name = 'ERROR';
            data.dr_name = 'ERROR';
            data.sect_no = 'ERROR';
            data.reg_date = ['ERR', 'ERR', 'ERR'];
            data.noon_code = 'ERROR';
            data.check_in = 'ERROR';
            data.notice = 'ERROR';
            res.render('./reg/reg_data', data);
          } else {
            const resJson = JSON.parse(body);
            clinic = resJson.data;
            callback(null);
          }
        });
    },
    (callback) => { // 醫院名字
      data.hosp_name = clinic.HOSP_NAME;
      callback(null);
    },
    (callback) => { // 大分科名字
      const port = process.env.PORT || '3000';
      const url = `http://localhost:${port}/api/getHptlDeptsByID?id=${clinic.HOSP_ID}`;
      request(
        url,
        (error, response, body) => {
          if (error) {
            console.error(error);
            data.dept_name = 'ERROR';
          } else {
            const resJson = JSON.parse(body);
            var found = false;
            resJson.data.forEach(dgroup => {
              dgroup.DEPTS.forEach(dept => {
                if (!found) {
                  if (dept.HDEPT_CODE == clinic.HDEPT_CODE) {
                    found = true;
                    data.dgroup_name = dgroup.DGROUP_NAME;
                    data.dept_name = dept.HDEPT_NAME;
                  }
                }
              });
            });

            if (!data.dgroup_name) data.dgroup_name = 'ERROR';
            if (!data.dept_name) data.dept_name = 'ERROR';
          }
          callback(null);
        });
    },
    (callback) => { // 醫生姓名
      data.dr_name = clinic.DR_NAME;
      callback(null);
    },
    (callback) => {
      data.sect_no = clinic.SECT_NO;
      data.reg_date = [
        clinic.REG_DATE_ROCY,
        clinic.REG_DATE_MM,
        clinic.REG_DATE_DD,
      ];
      data.noon_code = ['上午診', '下午診', '晚間診'][parseInt(clinic.NOON_CODE) - 1];
      data.check_in = ['11:00', '17:30', '20:30'][parseInt(clinic.NOON_CODE) - 1];
      data.notice = (clinic.NOTICE) ? clinic.NOTICE : '　';
      console.log(data);
      callback(null, data);
    },
    (dataForRender, callback) => {
      res.render('./reg/reg_data', dataForRender);
    }
  ]);
  // res.render('./reg/reg_data', {'header_mode': 0});
});

router.get('/reg_finish', function(req, res, next) {
  const data = {
    'header_mode': 0
  };

  async.waterfall([
    (callback) => {
      const port = process.env.PORT || '3000';
      const url = `http://localhost:${port}/api/getReg?reg_id=${req.query.reg_id}`;
      request(
        url,
        (error, response, body) => {
          if (error) {
            console.error(error);
            data.patient_id = "ERROR";
            data.hosp_name = 'ERROR';
            data.dept_name = 'ERROR';
            data.dr_name = 'ERROR';
            data.sect_no = 'ERROR';
            data.reg_date = ['ERR', 'ERR', 'ERR'];
            data.reg_no = "ERR";
            data.noon_code = 'ERROR';
            data.check_in = 'ERROR';
            data.notice = 'ERROR';
            res.render('./reg/reg_finish', data);
          } else {
            const resJson = JSON.parse(body);
            data.reg_no = resJson.data.reg_no;
            data.patient_id = resJson.data.patient_id;
            callback(null, resJson.data.CLINIC_ID);
          }
        });
    },
    (clinic_id, callback) => {
      const port = process.env.PORT || '3000';
      const url = `http://localhost:${port}/api/getClinicByID?clinic_id=${clinic_id}`;
      request(
        url,
        (error, response, body) => {
          if (error) {
            console.error(error);
            data.patient_id = "ERROR";
            data.hosp_name = 'ERROR';
            data.dept_name = 'ERROR';
            data.dr_name = 'ERROR';
            data.sect_no = 'ERROR';
            data.reg_date = ['ERR', 'ERR', 'ERR'];
            data.reg_no = "ERR";
            data.noon_code = 'ERROR';
            data.check_in = 'ERROR';
            data.notice = 'ERROR';
            res.render('./reg/reg_finish', data);
          } else {
            const resJson = JSON.parse(body);
            data.hosp_name = resJson.data.HOSP_NAME + '院區';
            data.dept_name = resJson.data.HDEPT_NAME;
            data.dr_name = resJson.data.DR_NAME;
            data.sect_no = resJson.data.SECT_NO;
            data.reg_date = [
              resJson.data.REG_DATE_ROCY,
              resJson.data.REG_DATE_MM,
              resJson.data.REG_DATE_DD
            ];
            data.noon_code = ['上午診', '下午診', '晚間診'][parseInt(resJson.data.NOON_CODE) - 1];
            data.check_in = ['11:00', '17:30', '20:30'][parseInt(resJson.data.NOON_CODE) - 1];
            data.notice = (resJson.data.NOTICE) ? resJson.data.NOTICE : '';
            callback(null);
          }
      });
    },
    (callback) => {
      console.log(data);
      res.render('./reg/reg_finish', data);
    }
  ]);
});

module.exports = router;
