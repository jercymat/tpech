var express = require('express');
var router = express.Router();
var async = require('async');
var firebase = require("firebase/app");
var request = require('request');
require("firebase/database");

// Set the configuration for your app
var config = {
  apiKey: "your-api-key",
  authDomain: "your-firebase-auth-domain",
  databaseURL: "your-firebase-database-url"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/hptls', function (req, res, next) {
  async.waterfall([
    (callback) => {
      database
      .ref('/hptls')
        .on('value', snapshot => {
          console.log();
          callback(null, snapshot.val());
        });
    },
    (data, callback) => {
      console.log(data);
      res.json({
        "status": true,
        "data": data
      });
    }
  ]);
});

router.get('/patient', function (req, res, next) {
  async.waterfall([
    (callback) => {
      if (!req.query.id) {
        res.json({
          "status": false,
          "msg": "沒有病患ID"
        });
      } else {
        callback(null);
      }
    },
    (callback) => {
      database
        .ref('/patient')
        .on('value', snapshot => {
          const patients = snapshot.val();
          console.log(patients);
          if (patients.hasOwnProperty(req.query.id)) {
            callback(null, patients[req.query.id]);
          } else {
            res.json({
              "status": false,
              "msg": "找不到此病患資料"
            });
          }
        });
    },
    (data, callback) => {
      console.log(data);
      res.json({
        "status": true,
        "data": data
      });
    }
  ]);
});

router.get('/isPatientReged', function(req, res, next) {
  async.waterfall([
    (callback) => {
      if (!req.query.id) {
        res.json({
          "status": false,
          "msg": "沒有病患ID"
        });
      } else {
        callback(null);
      }
    },
    (callback) => {
      database
        .ref('/patient')
        .once('value', snapshot => {
          callback(null, snapshot.val().hasOwnProperty(req.query.id));
        });
    },
    (found, callback) => {
      res.json({
        "status": true,
        "data": found
      });
    }
  ]);
});

router.get('/regPatient', function (req, res, next) {
  async.waterfall([
    (callback) => {
      if (!req.query.id || !req.query.bdy || !req.query.bdm || !req.query.bdd) {
        res.json({
          "status": false,
          "msg": "欄位缺少"
        }); 
      } else {
        callback(null);
      }
    },
    (callback) => { // 檢查患者是否已註冊
      const port = process.env.PORT || '3000';
      request(
        `http://localhost:${port}/api/isPatientReged?id=${req.query.id}`,
        (error, response, body) => {
          if (error) {
            console.error(`error: ${error}`);
            res.json({
              "status": false,
              "msg": "查詢患者註冊情況錯誤"
            });
          } else {
            const resJson = JSON.parse(body);
            if (resJson.data) {
              res.json({
                "status": false,
                "msg": "此帳號已被註冊"
              });
            } else {
              callback(null);
            }
          }
        }
      );
    },
    (callback) => { // 註冊患者
      database
      .ref('/patient/' + req.query.id)
      .set({
        bdy: req.query.bdy,
        bdm: req.query.bdm,
        bdd: req.query.bdd,
        req_cnt: 0
      });
      callback(null);
    },
    (callback) => {
      res.json({
        "status": true,
        "msg": "病患註冊成功"
      });
    }
  ]);
});

router.get('/register', function(req, res, next) {
  async.waterfall([
    (callback) => {
      if (!req.query.clinic_id || !req.query.patient_id || !req.query.phone) {
        res.json({
          "status": false,
          "msg": "參數缺少"
        });
      } else {
        callback(null);
      }
    },
    (callback) => {
      const port = process.env.PORT || '3000';
      request(
        `http://localhost:${port}/api/getNewClinicID?id=${req.query.patient_id}`,
        (error, response, body) => {
          if (error) {
            console.error(`error: ${error}`);
            res.json({
              "status": false,
              "msg": "取得掛號ID錯誤"
            });
          } else {
            const resJson = JSON.parse(body);
            if (resJson.status) {
              callback(null, resJson.data.reg_id);
            } else {
              res.json({
                "status": false,
                "msg": "取得掛號ID錯誤"
              }); 
            }
          }
        });
    },
    (reg_id, callback) => { // 加上新掛號
      database
      .ref('/regs/' + reg_id)
      .set({
        CLINIC_ID: req.query.clinic_id,
        patient_id: req.query.patient_id,
        notify_number: req.query.phone,
        reg_no: '14'
      });
      callback(null, reg_id);
    },
    (reg_id, callback) => {
      res.json({
        "status": true,
        "data": {
          "reg_id": reg_id
        }
      });
    }
  ]);
});

router.get('/getReg', function(req, res, next) {
  async.waterfall([
    (callback) => {
      if (!req.query.reg_id) {
        res.json({
          "status": false,
          "msg": "沒有掛號ID"
        });
      } else {
        callback(null);
      }
    },
    (callback) => {
      database
      .ref('/regs/' + req.query.reg_id)
      .once('value', snapshot => {
        if (snapshot.exists()) {
          callback(null, snapshot.val());
        } else {
          res.json({
            "status": false,
            "msg": "找不到此掛號紀錄"
          });
        }
      });
    },
    (reg, callback) => {
      console.log(reg);
      res.json({
        "status": true,
        "data": reg
      });
    }
  ]);
});

router.get('/getRegByPatientID', function(req, res, next) {
  async.waterfall([
    (callback) => {
      if (!req.query.patient_id) {
        res.json({
          "status": false,
          "msg": "沒有病患ID"
        });
      } else {
        callback(null);
      }
    },
    (callback) => {
      database
      .ref('/regs')
      .orderByChild('patient_id')
      .equalTo(req.query.patient_id)
      .once('value', snapshot => {
        if (snapshot.exists()) {
          callback(null, snapshot.val());
        } else {
          res.json({
            "status": false,
            "msg": "找不到此病患的掛號紀錄"
          });
        }
      });
    },
    (regs, callback) => {
      const refactorRegs = [];
      for (const [k, v] of Object.entries(regs)) {
        v.REG_ID = k;
        refactorRegs.push(v);
      }
      callback(null, refactorRegs);
    },
    (regs, callback) => {
      res.json({
        "status": true,
        "data": regs
      });
    }
  ]);
});

router.get('/deleteReg', function(req, res, next) {
  async.waterfall([
    (callback) => {
      if (!req.query.reg_id) {
        res.json({
          "status": false,
          "msg": "沒有掛號ID"
        });
      } else {
        callback(null);
      }
    },
    (callback) => {
      database
      .ref('/regs/' + req.query.reg_id)
      .remove((err) => {
        if (err) {
          res.json({
            "status": false,
            "msg": "刪除掛號錯誤！"
          });
        } else {
          callback(null);
        }
      });
    },
    (callback) => {
      res.json({
        "status": true,
        "msg": "刪除掛號成功"
      });
    }
  ]);
}); 

router.get('/getNewClinicID', function(req, res, next) {
  async.waterfall([
    (callback) => {
      if (!req.query.id) {
        res.json({
          "status": false,
          "msg": "沒有患者ID"
        });
      } else {
        callback(null);
      }
    },
    (callback) => { // 拿到掛號計數
      database
      .ref(`/patient/${req.query.id}/req_cnt`)
      .once('value', snapshot => {
        if (snapshot.exists()) {
          const req_cnt = snapshot.val();
          callback(null, req_cnt);
        } else {
          res.json({
            "status": false,
            "msg": "查無此病患ID"
          });
        }
      });
    },
    (req_cnt, callback) => {
      const currentCnt = req_cnt + 1;
      const req_id = `R-${req.query.id}-${currentCnt.toString().padStart(5, '0')}`;
      console.log(req_id);

      database
        .ref(`/patient/${req.query.id}/req_cnt`)
        .set(currentCnt);
      
      callback(null, req_id);
    },
    (formal_id, callback) => {
      res.json({
        "status": true,
        "data": {
          "reg_id": formal_id
        }
      });
    }
  ]);
});

router.get('/getHptlDeptsByID', function (req, res, next) {
  async.waterfall([
    (callback) => {
      if (!req.query.id) {
        res.json({
          "status": false,
          "msg": "沒有醫院ID"
        });
      } else {
        callback(null);
      }
    },
    (callback) => {
      database
        .ref('/depts_by_hptl/' + req.query.id)
        .on('value', snapshot => {
          if (snapshot.val() == null) {
            res.json({
              "status": false,
              "msg": "無此醫院ID"
            });
          } else {
            callback(null, snapshot.val());
          }
        });
    },
    (data, callback) => {
      console.log(data);
      res.json({
        "status": true,
        "data": data
      });
    }
  ]);
});

router.get('/getClinicsByDept', function (req, res, next) {
  async.waterfall([
    (callback) => {
      if (!req.query.dept_id) {
        res.json({
          "status": false,
          "msg": "沒有科別ID"
        });
      } else {
        callback(null);
      }
    },
    (callback) => {
      database
        .ref('/clinics_by_dept')
        .on('value', snapshot => {
          var found = false;
          snapshot.val().forEach(depts => {
            if (depts.HDEPT_CODE == req.query.dept_id) {
              callback(null, depts.CLINICS);
              found = true;
            }
          });

          if (!found) {
            res.json({
              "status": false,
              "msg": "此科別尚無門診"
            });
          }
        });
    },
    (data, callback) => {
      res.json({
        "status": true,
        "data": data
      });
    }
  ]);
});

router.get('/getClinicByID', function(req, res, next) {
  async.waterfall([
    (callback) => {
      if (!req.query.clinic_id) {
        res.json({
          "status": false,
          "msg": "沒有醫院ID"
        });
      } else {
        callback(null);
      }
    },
    (callback) => {
      database
        .ref('/clinics_by_dept')
        .on('value', snapshot => {
          var found = false;
          var ids = req.query.clinic_id.split('-');
          console.log(ids);
          snapshot.val().forEach(dept => {
            if (dept.HDEPT_CODE == ids[1]) {
              dept.CLINICS.forEach(clinic => {
                if (clinic.CLINIC_ID == req.query.clinic_id) {
                  found = true;
                  res.json({
                    "status": true,
                    "data": clinic
                  });
                }
              });
            }
          });

          if (!found) {
            res.json({
              "status": false,
              "msg": "查無此門診"
            });
          }
        });
    }
  ]);
});

router.get('/getHptlByID', function (req, res, next) {
  async.waterfall([
    (callback) => {
      if (!req.query.id) {
        res.json({
          "status": false,
          "msg": "沒有醫院ID"
        });
      } else {
        callback(null);
      }
    },
    (callback) => {
      database
        .ref('/hptls')
        .on('value', snapshot => {
          var found = false;
          snapshot.val().forEach(hptl => {
            if (hptl.HOSP_ID == req.query.id) {
              callback(null, hptl);
              found = true;
            }
          });

          if (!found) {
            res.json({
              "status": false,
              "msg": "查無此醫院"
            });
          }
        });
    },
    (hptl, callback) => {
      res.json({
        "status": true,
        "data": hptl
      });
    }
  ]);
});

module.exports = router;
