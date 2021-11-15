var express = require('express');
var request = require('request');
var async = require('async');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('./query_reg/index', {
    "header_mode": 4
  });
});

router.get('/query_result', function (req, res, next) {
  const data = {
    "header_mode": 4,
    "regs": [],
    "patient_id": req.query.id
  };

  async.waterfall([
    (callback) => {
      const port = process.env.PORT || '3000';
      request(
        `http://localhost:${port}/api/getRegByPatientID?patient_id=${req.query.id}`,
        (error, response, body) => {
          if (error) {
            console.error('error' + error);
            callback(null, []);
          } else {
            const resJson = JSON.parse(body);
            console.log(resJson);
            if (resJson.status) {
              callback(null, resJson.data);
            } else {
              callback(null, []);
            }
          }
        });
    },
    (regs, callback) => {
      const port = process.env.PORT || '3000';
      const listOfRegTask = [];
      const regTask = (reg, next) => {
        const r = {
          reg_id: reg.REG_ID,
          reg_no: reg.reg_no
        };
        request(
          `http://localhost:${port}/api/getClinicByID?clinic_id=${reg.CLINIC_ID}`,
          (error, response, body) => {
            if (error) {
              console.error('error' + error);
              r.hosp_name = 'ERROR';
              r.dept_name = 'ERROR';
              r.dr_name = 'ERROR';
              r.sect_no = 'ERROR';
              r.reg_date = ['ERR', 'ERR', 'ERR'];
              r.noon_code = 'ERR';
              console.log(r);
              data.regs.push(r);
              next(null);
            } else {
              const resJson = JSON.parse(body);
              r.hosp_name = resJson.data.HOSP_NAME + '院區';
              r.dept_name = resJson.data.HDEPT_NAME;
              r.dr_name = resJson.data.DR_NAME;
              r.sect_no = resJson.data.SECT_NO;
              r.reg_date = [
                resJson.data.REG_DATE_ROCY,
                resJson.data.REG_DATE_MM,
                resJson.data.REG_DATE_DD
              ];
              r.noon_code = ['上午診', '下午診', '晚間診'][ parseInt(resJson.data.NOON_CODE) - 1 ];
              console.log(r);
              data.regs.push(r);
              next(null);
            }
          });
      };

      regs.forEach(reg => {
        listOfRegTask.push(regTask.bind(null, reg));
      });

      async.series(listOfRegTask, (err, res) => {
        callback(null);
      });
    },
    (callback) => {
      console.log(data);
      res.render('./query_reg/query_result', data);
    }
  ]);
});

module.exports = router;
