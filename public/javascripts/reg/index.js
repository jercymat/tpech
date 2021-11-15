$(document).ready(() => {
  $('.collapse').on('show.bs.collapse', (e) => {
    console.log($(e.target).siblings().find($('i')));
    $(e.target).siblings().children('a').html('<i class="fi-xnsuxl-chevron-solid"></i>');
    friconix_update();
  });

  $('.collapse').on('hide.bs.collapse', (e) => {
    $(e.target).siblings().children('a').html('<i class="fi-xnsdxl-chevron-solid"></i>');
    friconix_update();
  });
});

function sendRegData(CLINIC_ID) {
  var url = '/reg/reg_data';
  var queries = `?clinic_id=${CLINIC_ID}`;
  window.location.href = url + queries;
}