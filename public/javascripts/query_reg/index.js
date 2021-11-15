$(document).ready(() => {
  $('form').submit((e) => {
    e.preventDefault();
    const inputs = $(e.currentTarget).find('input');
    var allValidate = true;
    Array.from(inputs).forEach(ipt => {
      const input = $(ipt);
      if (ipt.checkValidity() === false) {
        input.toggleClass('is-invalid', true);
        input.parent().siblings().find('.invalid-feedback').addClass('d-block');
        input.parent().parent().siblings().find('.invalid-feedback').addClass('d-block');
        allValidate = false;
      } else {
        input.toggleClass('is-invalid', false);
        input.parent().siblings().find('.invalid-feedback').removeClass('d-block');
        input.parent().parent().siblings().find('.invalid-feedback').removeClass('d-block');
      }
    });

    if (allValidate) window.location.href = "/query_reg/query_result?id=" + $('#patient-id').val();
  });

  $('.dropdown-item').click((e) => {
    const btn = $(e.currentTarget);
    console.log(btn.parent().siblings('button'));
    btn.parent().siblings('button').text(btn.text());
  });
});