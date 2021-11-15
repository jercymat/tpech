$(document).ready(function () {
  $('#query_result__leave').click(function (e) { 
    e.preventDefault();
    window.location.href = '/query_reg';
  });

  $(document).on('show.bs.modal', '#modal-confirm-cancel', (e) => {
    const button = $(e.relatedTarget);
    const id = button.data('regid');

    $(this).find('#modal__confirm').attr('data-regid', id);
  });

  $('#modal__confirm').click((e) => { 
    e.preventDefault();
    $('#modal-confirm-cancel').modal('hide');
    const id = $(e.currentTarget).attr('data-regid');
    $.get(`../../api/deleteReg?reg_id=${id}`, (res) => {
      if (res.status) {
        window.location.reload();
      } else {
        console.error('刪除錯誤');
      }
    });
  });
});