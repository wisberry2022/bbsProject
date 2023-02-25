// index에 필요한 변수들
var goWrite, dBtn;
var cnt;
var tbody;
var sArr = [];
// 원하는 섹션만 보여주는 함수
var selectShow = function(idName) {
	sArr.forEach(function(ele){
		if(ele.attr('id') === idName) ele.show();
		else ele.hide();
	});
}

// 선택한 게시글을 가져오는 함수
var set = function() {
	var row = $(this).parent().parent();
	var bbsNum = row.children().eq(0).children().text();
	updateNo = bbsNum;
	
	$.ajax({
		url: 'bbs/:' + bbsNum,
		method: 'get',
		contentType: 'application/json; charset:UTF-8',
		success: function(data, msg, xhr) {
			selectShow('detail');
			var result = data.bbs;
			var dBtm = $('.board').children().eq(0).children().eq(1);
			var dTitle = $('.board').children().eq(0).children('h4');
			var dDate = dBtm.children().eq(0).children().eq(1);
			var dAuthor = dBtm.children().eq(1).children().eq(1);
			var dView = dBtm.children().eq(2).children().eq(1);
			var dContent = $('.board').children().eq(1).children(); 
			dTitle.text(result.title);
			dDate.text(result.writeDate);
			dAuthor.text(result.author);
			dView.text(result.viewcnt);
			dContent.text(result.content);
		}
	});
}

// 게시글 목록 가져오는 함수
var getList = function(cnt) {
	$.ajax({
		url: 'list/' + cnt,
		method: 'get',
		contentType: "application/json; charset:UTF-8",
		success: function(data, msg, xhr) {
			$(data.lists).each(function(idx, ele){
				var record = $('<ul/>').addClass('record');
				record
						.append($('<li/>')
										  .append($('<strong/>').text(ele.num)
										  						.on('click', set)))
						.append($('<li/>')
										  .append($('<strong/>').text(ele.title)
										  						.on('click', set)))
						.append($('<li/>')
										  .append($('<strong/>').text(ele.author)
										  						.on('click', set)))
						.append($('<li/>')
										  .append($('<strong/>').text(ele.date)
										  						.on('click', set)))
						.append($('<li/>')
										  .append($('<strong/>').text(ele.view)
										  						.on('click', set)));
				tbody.append(record);
			});
		}
	});
}


// write에 필요한 변수들
var arr = [];
var assign, reset;
var title, author, pwd, content;

// post 요청시 전달할 데이터를 만들어주는 함수
var getParam = function(...ele) {
	var paramObj = {};
	ele.forEach(function(item,idx){
		paramObj[item.attr('name')] = item.val();
	});
	return paramObj;
}

// detail에 필요한 변수들
var updateNo;
var dBtnBox;
var updateBtn, delBtn;


// modal 관련 변수들
var modalBox;
var updateModal;

$(function(){
	// 초기 설정
	modalBox = $('#modalBox');
	updateModal = modalBox.children().eq(0);
	
	$('section').each(function(idx,ele) {
		sArr.push($(ele));
	});
	selectShow('bbs');
	
	// index에서 사용되는 JS
	goWrite = $('#bbs').find('.btnBox').children();
	goWrite.on('click', function(e){
		history.pushState({link:'write'}, "", location.href);
		selectShow('writing');
	});
	tbody = $('#bbs').find('.table').find('.tbody');
	
	getList(10);
	
	// write에서 사용되는 JS	
	assign = $('#writing .btnBox').children().eq(0);
	reset = $('#writing .btnBox').children().eq(1);
	title = $('#writing .writeBox').find('input').eq(0);
	author = $('#writing .writeBox').find('input').eq(1);
	pwd = $('#writing .writeBox').find('input').eq(2);
	content = $('textarea');
	
	$('.writeBox').find('input').each(function(idx, ele){
		arr.push($(ele));
	} );
	
	// 게시글 등록
	assign.on('click', function(e) {
		e.preventDefault();
		var paramObj = getParam(title,author,pwd,content);
	
		$.ajax({
			url:"bbs",
			method: 'post',
			data: paramObj,
			success: function(data, msg, xhr) {
				selectShow('bbs');
				tbody.children().remove();
				getList(10);
			}
		});
	});
	
	// 뒤로가기
	reset.on('click',function(e) {
		e.preventDefault();
		selectShow('bbs');
	});
	
	// detail에서 사용되는 JS
	updateBtn = $('#detail').find('.btnBox').children().eq(0);
	delBtn = updateBtn.next();
	dBtnBox = $('#detail').find('.btnBox').children();
	dBtnBox.each(function(idx, ele){
		$(ele).on('click', function(){
			modalBox.find('.uBtm strong').text('비밀번호 입력 후 ' + $(ele).text() + ' 가능합니다' );
			modalBox.addClass('active');
		});
	});
	
	// 모달에서 사용하는 JS
	updateModal = $('#modalBox').find('.update');
	
	// 모달 창에 있는 닫기 아이콘 마다 모달 닫기 기능 추가
	$('#modalBox').find('.close').each(function(idx, ele){
		$(ele).on('click', function(e){
			modalBox.removeClass('active');
			modalBox.find('.uBtm').find('input').eq(0).val('');
		});
	});
	
	// 확인 버튼 클릭 시 ajax 총신(수정, 삭제)
	updateModal.find('.uBtm').find('button').on('click', function(){
		var flag;
		var pwd = modalBox.find('.uBtm').find('input').eq(0).val();
		var criteria = $(this).parent().prev().text();
		if(criteria.includes('수정')) {
			flag = "put";
			$.ajax({
				url:'val',
				method:'post',
				data: {num:updateNo, pwd:pwd},
				success: function(data, msg, xhr){
					console.log('success');
				}
			});
		}else if(criteria.includes('삭제')){
			flag = "delete";
		}else{
			modalBox.removeClass('active');	
		}
	});
});