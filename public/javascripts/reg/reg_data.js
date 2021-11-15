$(document).ready(() => {
  $('form').submit((e) => {
    e.preventDefault();
    const inputs = $(e.currentTarget).find('input');
    var allValidate = true;
    Array.from(inputs).forEach((ipt, idx) => {
      const input = $(ipt);
      if (ipt.checkValidity() === false) {
        if ((idx == 4 && $('#customCheck1').prop('checked')) || (idx != 4)) {
          input.toggleClass('is-invalid', true);
          console.log('here1');
          console.log(input.parent().siblings().find('.invalid-feedback'));
          input.parent().siblings().find('.invalid-feedback').addClass('d-block');
          input.parent().parent().siblings().find('.invalid-feedback').addClass('d-block');
          allValidate = false;
        }
      } else {
        input.toggleClass('is-invalid', false);
        console.log('here2');
        console.log(input.parent().siblings().find('.invalid-feedback'));
        if (idx != 4 || (idx == 4 && $('#customCheck1').prop('checked'))) {
          input.parent().siblings().find('.invalid-feedback').removeClass('d-block');
          input.parent().parent().siblings().find('.invalid-feedback').removeClass('d-block');
        }
      }
    });

    if (allValidate) register();
  });

  $('.dropdown-item').click((e) => {
    const btn = $(e.currentTarget);
    console.log(btn.parent().siblings('button'));
    btn.parent().siblings('button').text(btn.text());
  });

  $('#customCheck1').change(function (e) { 
    e.preventDefault();
    console.log($(this).prop('checked'));
    $('#info-form-contact').toggleClass('d-none', !$(this).prop('checked'));
    $('#phone-number').prop('required', $(this).prop('checked'));
  });
});

function register() {
  const clinic_id = $('#clinic_id').text();
  console.log(clinic_id);
  const patient_id = $('#patient-id').val();
  console.log(patient_id);
  const bdy = $('#bd-y').val();
  const bdm = $('#bd-m').val();
  const bdd = $('#bd-d').val();
  console.log(`${bdy}-${bdm}-${bdd}`);
  const phone = ($('#phone-number').val() != '') ? $('#phone-number').val() : '0000000000';
  console.log(phone);

  $.get(`../../api/isPatientReged?id=${patient_id}`, (res) => {
    if (res.status) {
      if (res.data) {
        sendRegData();
      } else {
        regPatient();
      }
    } else {
      console.error('register error!');
    }
  });

  function regPatient() {
    $.get(`../../api/regPatient?id=${patient_id}&bdy=${bdy}&bdm=${bdm}&bdd=${bdd}`, (res) => {
      if (res.status) {
        sendRegData();
      } else {
        console.error('register error 2!');
      }
    });
  }

  function sendRegData() {
    $.get(`../../api/register?clinic_id=${clinic_id}&patient_id=${patient_id}&phone=${phone}`, (res) => {
      if (res.status) {
        console.log('註冊成功！！！');
        window.location.href = '/reg/reg_finish?reg_id=' + res.data.reg_id;
      } else {
        console.error(res);
        console.error('register error 3!');
      }
    });
  }
}