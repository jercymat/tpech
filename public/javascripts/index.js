var map = false;
var mapInited = false;
const enabledDepts = ['AH00', '0600', '1000'];

$(document).ready(() => {
  // 院區選擇左右滑動
  var pageCount1 = $('.hptl__step').length;
  var wrapperWidth1 = 100 * pageCount1;
  var slideWidth1 = 100 / pageCount1;
  console.log(`${pageCount1}, ${wrapperWidth1}, ${slideWidth1}`);
  $('.hptl__steps_wrapper').width(wrapperWidth1 + '%');
  $('.hptl__step').width(slideWidth1 + '%');

  // 科別選擇左右滑動
  var pageCount2 = $('.dept__step').length;
  var wrapperWidth2 = 100 * pageCount2;
  var slideWidth2 = 100 / pageCount2;
  console.log(`${pageCount2}, ${wrapperWidth2}, ${slideWidth2}`);
  $('.dept__steps_wrapper').width(wrapperWidth2 + '%');
  $('.dept__step').width(slideWidth2 + '%');

  $('.hptl_branch__img:first-of-type').click(() => {
    refreshHptlDepts('F');
  });

  $('.dept__dept_btn').click((e) => {
    refreshSelectedDept($(e.currentTarget).attr('id').substring(6, 10));
  });
});

// 切換地圖選擇/列表選擇
$(document).on('click', '#hptl__btn_switch_map', async () => {
  console.log(map);
  if (map) {
    $('#hptl__btn_switch_map').text('切換地圖顯示');
    console.log('show list');
    $('#hptl__map_select_area').css('opacity', '0');
    await new Promise(r => setTimeout(r, 150));
    $('#hptl__map_select_area').addClass('d-none');
    $('#hptl__list_select_area').removeClass('d-none');
    await new Promise(r => setTimeout(r, 50));
    $('#hptl__list_select_area').css('opacity', '1');
  } else {
    $('#hptl__btn_switch_map').text('切換列表顯示');
    console.log('show map');
    $('#hptl__list_select_area').css('opacity', '0');
    await new Promise(r => setTimeout(r, 150));
    $('#hptl__list_select_area').addClass('d-none');
    $('#hptl__map_select_area').removeClass('d-none');
    if (!mapInited) initMap();
    await new Promise(r => setTimeout(r, 50));
    $('#hptl__map_select_area').css('opacity', '1');
  }

  map = !map;
});

// 初始化地圖
function initMap() {
  const width = $('#hptl__map_wrapper').width(); // 寬高
  const height = $('#hptl__select_mode_containter').height();
  const scale = (height > 500) ? 100000 : 85000; // 用高度判斷地圖放大比例
  console.log(`height - ${height} | width - ${width}`);

  const data = ['1', '2', '3', '4', '5', '6', '7', '9', '10', '11', '12'];

  // 座標變換函式
  var path = d3.geo.path().projection(
    d3.geo
      .mercator()
      .center([121.558, 25.09])
      .scale(scale)
      .translate([width / 2, height / 2])
  );

  // 讓d3抓svg，並寫入寬高
  var svg = d3.select('#hptl__map_wrapper').append('svg')
    .attr('width', width)
    .attr('height', height);

  // 讓d3抓GeoJSON檔，並寫入path的路徑
  d3.json('/images/index/tpe-map.geojson', (error, geometry) => {
    if (error) throw error;
    svg
      .selectAll('path')
      .data(geometry.features)
      .enter().append('path')
      .attr({
        id: (d) => `map-dist-poly-${d.properties.T_UID}`,
        d: path,
        class: (d) => (data.indexOf(d.properties.T_UID) == '-1') ? 'disabled' : '' // 篩選出可以選的行政區
      })
      .on({
        'mouseover': (d) => {
          // d3.select(`#map-dist-poly-${d.properties.T_UID}`).attr('class', 'hover');
          $(`#map-dist-poly-${d.properties.T_UID}`).addClass('hover');
          $(`#map-dist-text-${d.properties.T_UID}`).addClass('hover');
        },
        'mouseout': (d) => {
          // d3.select(`#map-dist-poly-${d.properties.T_UID}`).attr('class', '');
          $(`#map-dist-poly-${d.properties.T_UID}`).removeClass('hover');
          $(`#map-dist-text-${d.properties.T_UID}`).removeClass('hover');
        },
        'click': (d) => {
          console.log('click!');
          $(`#map-dist-poly-${d.properties.T_UID}`).toggleClass('active');
          $(`#map-dist-text-${d.properties.T_UID}`).toggleClass('active');
        }
      });

    svg
      .selectAll('text')
      .data(geometry.features)
      .enter()
      .append('text')
      .attr({
        transform: (d) => `translate(${path.centroid(d)})`,
        id: (d) => `map-dist-text-${d.properties.T_UID}`,
        class: (d) => (data.indexOf(d.properties.T_UID) == '-1') ? 'disabled' : '', // 篩選出可以選的行政區
        'text-anchor': 'middle',
        'font-size': '0.8rem'
      })
      .text((d) => d.properties.T_Name);
  });

  mapInited = true;
}

// 拿到該醫院科別並貼上選單
function refreshHptlDepts(id) {
  $.get(`/api/getHptlDeptsByID?id=${id}`, (res) => {
    $('#hptl__step_2 ul').empty();
    $('#hptl__step_2 .tab-content').empty();

    res.data.forEach((dgroup, idx) => {
      var tab = $('<li/>', {
        class: 'nav-item flex-sm-fill'
      }).append($('<a/>', {
        id: `dept-${dgroup.DGROUP_CODE}-tab`,
        class: `nav-link border-0${(idx == 0) ? ' active' : ''}`,
        role: 'tab',
        'data-toggle': 'tab',
        href: `#hptl__dept_${dgroup.DGROUP_CODE}_tab`,
        'aria-controls': `department-${dgroup.DGROUP_CODE}`,
        'aria-selected': (idx == 0) ? 'true' : 'false'
      }).append(dgroup.DGROUP_NAME));

      $('#hptl__step_2 ul').append(tab);

      var tabpanel = $('<div/>', {
        id: `hptl__dept_${dgroup.DGROUP_CODE}_tab`,
        class: `tab-pane fade px-4 py-5${(idx == 0) ? ' show active' : ''}`,
        role: 'tabpanel',
        'aria-labelledby': `dept-${dgroup.DGROUP_CODE}-tab`
      }).append($('<div/>', { class: 'row' }));

      $('#hptl__step_2 .tab-content').append(tabpanel);

      dgroup.DEPTS.forEach(dept => {
        var rawBtn = $('<button/>', {
          id: `dept__btn--${id}-${dept.HDEPT_CODE}`,
          class: 'tpech__btn_popping w-100'
        });
        if (!enabledDepts.includes(dept.HDEPT_CODE)) rawBtn.attr('disabled', 'disabled');

        var deptBtn = $('<div/>', {
          class: 'col-12 col-md-4 col-lg-3 mb-3'
        }).append(rawBtn.append(dept.HDEPT_NAME));

        $(`#hptl__dept_${dgroup.DGROUP_CODE}_tab .row`).append(deptBtn);
      });
    });

    // 院區科別選擇
    $('#hptl__step_2 button:not(#hptl__step_back_btn)').click((e) => {
      var dept_attrs = $(e.currentTarget).attr('id').substring(11).split('-');
      window.location.href = `/reg?hptl=${dept_attrs[0]}&dept=${dept_attrs[1]}`;
    });

    $('#hptl__step_back_btn').click(() => {
      slideHptlSteps(0);
    });

    slideHptlSteps(1);
  });
}

function refreshSelectedDept(id) {
  $('#dept__selected_dept').text(id);

  $('.dept_branch__img:first-of-type').click((e) => {
    window.location.href = `/reg?hptl=F&dept=${$('#dept__selected_dept').text()}`;
  });

  $('#dept__step_back_btn').click(() => {
    slideDeptSteps(0);
  });
  slideDeptSteps(1);
}

// 醫院選擇換頁
function slideHptlSteps(toIndex) {
  var margin = toIndex * -100 + '%';

  if (toIndex == 1) {
    $('#hptl__step_2').removeClass('d-none');
  }

  $('.hptl__steps_wrapper').animate({
    marginLeft: margin
  }, 1000, 'easeInOutQuart', () => {
    if (toIndex == 0) {
      $('#hptl__step_2').addClass('d-none');
    }
  });

  changeTitle(toIndex);

  async function changeTitle(toIndex) {
    $('#hptl__section_title').css('opacity', '0');
    $('#hptl__section_subti').css('opacity', '0');
    await new Promise(r => setTimeout(r, 150));

    if (toIndex == 1) {
      $('#hptl__section_title').text('選擇欲掛號科別');
      $('#hptl__section_subti').text('從下方選擇欲掛號科別');
    } else {
      $('#hptl__section_title').text('依院區掛號');
      $('#hptl__section_subti').text('在下方選擇欲看診之院區或門診部');
    }

    await new Promise(r => setTimeout(r, 50));
    $('#hptl__section_title').css('opacity', '');
    $('#hptl__section_subti').css('opacity', '');
  } 
}

function slideDeptSteps(toIndex) {
  // 院區科別選擇

  var margin = toIndex * -100 + '%';

  if (toIndex == 1) {
    $('#dept__step_2').removeClass('d-none');
  }

  $('.dept__steps_wrapper').animate({
    marginLeft: margin
  }, 1000, 'easeInOutQuart', () => {
    if (toIndex == 0) {
      $('#dept__step_2').addClass('d-none');
    }
  });
}