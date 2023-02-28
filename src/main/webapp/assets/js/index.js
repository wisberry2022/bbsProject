// history stack을 위한 변수들
var pageCursor;


// index에 필요한 변수들
var listCnt, startCnt, endCnt, curCnt, totalPageCnt;
curCnt = 0;
startCnt = curCnt;
var goWrite, dBtn;
var cnt;
cnt = curCnt * 10;
var tbody;
var prev, nxt, pul;
var sArr = [];

// 원하는 섹션만 보여주는 함수(히스토리 스택에 쌓이는 함수)
var selectShow = function(idName, isStack) {
	sArr.forEach(function(ele){
		if(ele.attr('id') === idName) {
			if(isStack){
				history.pushState({link:idName}, "", "#"+idName);
			}
			ele.show();
		}
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
			selectShow('detail', true);
			updateVal = data.bbs;
			var dBtm = $('.board').children().eq(0).children().eq(1);
			var dTitle = $('.board').children().eq(0).children('h4');
			var dDate = dBtm.children().eq(0).children().eq(1);
			var dAuthor = dBtm.children().eq(1).children().eq(1);
			var dView = dBtm.children().eq(2).children().eq(1);
			var dContent = $('.board').children().eq(1).children(); 
			dTitle.text(updateVal.title);
			dDate.text(updateVal.writeDate);
			dAuthor.text(updateVal.author);
			dView.text(updateVal.viewcnt);
			dContent.text(updateVal.content);
		}
	});
}

// 숫자버튼 누를 시 해당 페이지의 게시글 가져오는 함수
var goPage = function(e) {
	curCnt = Number.parseInt($(e.target).text())-1;
	cnt = curCnt*10;
	changeBtnColor(curCnt);
	tbody.children().remove();
	getList(cnt, false);
}

// prev, next 버튼 클릭 시 버튼 컬러 변경 함수
var changeBtnColor = function(tidx){
	pul.children().each(function(idx, ele){
		target = Number.parseInt($(ele).children().eq(0).text())-1;
		if(target === tidx) {
			$(ele).addClass('current');
		}
		else $(ele).removeClass('current');
	});
}

// 게시글 목록 가져오는 함수
var getList = function(cnt, flag) {
	$.ajax({
		url: 'list/' + cnt,
		method: 'get',
		contentType: "application/json; charset:UTF-8",
		success: function(data, msg, xhr) {
			listCnt = data.lists[0].total;
			totalPageCnt = Math.ceil(listCnt/10);
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
			
			endCnt = startCnt + 5 > totalPageCnt ? totalPageCnt : startCnt+5; 
			
			// 페이지네이션 번호 생성
			if(flag){
				if(['rebuild','reverse'].includes(flag)) {
					pul.children().remove();
				}	
				for(var i = startCnt; i<endCnt; i++){
					var numBtn = $('<strong/>').text(i+1);
					var li = $('<li/>').append(numBtn)
									   .on('click', goPage);
					pul.append(li);							
				}			
				if(['rebuild','first'].includes(flag)) pul.children().eq(0).addClass('current');
				if('reverse' === flag) pul.children().last().addClass('current');
			}
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

// update&delete에 필요한 변수들
var updateVal;
// update시 사용했던 input 필드의 값들 초기화하기
var initialVal = function(...ele) {
	ele.forEach(function(item, idx){
		$(item).eq(0).val('');
	});
}

// modal 관련 변수들
var modalBox;
var updateModal;
var updateParam = {};
// 비밀번호 미일 치 시 등장하는 경고창 없에는 함수 
var initialWarn = function() {
	if(modalBox.find('.uBtm').find('.warn').length) {
		modalBox.find('.uBtm').find('.warn').each(function(_, ele){
			$(ele).remove();
		});
	}
}

$(function(){
	// 뒤로가기&앞으로가기
	onpopstate = function(e) {
		pageCursor = location.href.split("#")[1];
		selectShow(pageCursor, false);
	}

	// 초기 설정
	modalBox = $('#modalBox');
	updateModal = modalBox.children().eq(0);
	
	$('section').each(function(idx,ele) {
		sArr.push($(ele));
	});
	
	selectShow('bbs', true);
	
	// index에서 사용되는 JS
	prev = $('#pagination>.prev');
	nxt = $('#pagination>.next');
	pul = $('#pagination>ul');
	
	// 이전버튼
	prev.on('click', function(){
		if(curCnt != 0) {
			curCnt -= 1;
			cnt = curCnt*10;
			changeBtnColor(curCnt);
			tbody.children().remove();
			if(curCnt % 5 == 4) {
				startCnt-=5;
				getList(cnt, 'reverse');
			}
			else getList(cnt, false);
		}  
	});
	
	// 다음버튼
	nxt.on('click', function(){
		if(curCnt != totalPageCnt-1) {
			curCnt += 1;
			cnt = curCnt*10;
			changeBtnColor(curCnt);
			tbody.children().remove();
			if(curCnt % 5 == 0) {
				startCnt+=5;
				getList(cnt, 'rebuild');
			}
			else getList(cnt, false);
		}
	});
	
	
	goWrite = $('#bbs').find('.btnBox').children();
	goWrite.on('click', function(e){
		selectShow('writing', true);
	});
	tbody = $('#bbs').find('.table').find('.tbody');
	
	// 사이트 접속 시, 게시물 리스트 받아오기
	getList(cnt, 'first');
	
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
		var currentSec = $('#writing').find('.after').text();
		
		if(currentSec === '글쓰기'){
			$.ajax({
				url:"bbs",
				method: 'post',
				data: paramObj,
				success: function(data, msg, xhr) {
					selectShow('bbs', true);
					tbody.children().remove();
					getList(0, 'rebuild');
					initialVal(title, author, pwd, content);
				}
			});
		}else if(currentSec === '수정하기'){
			updateParam = getParam(title, author, pwd, content);
			$.ajax({
				url: "bbs/:" + updateNo,
				method: 'put',
				contentType: 'text/plain; charset:UTF-8',
				data: updateParam,
				success: function(data, msg, xhr) {
					selectShow('bbs', true);
					$('#writing').find('.after').text('글쓰기');
					initialVal(title, author, pwd, content);
					tbody.children().remove();
					getList(0, false);
				}
			});
		}
	});
	
	// 취소버튼
	reset.on('click',function(e) {
		var currentSec = $('#writing').find('.after').text();
		e.preventDefault();
		selectShow('bbs', false);
		initialVal(title, author, pwd, content);
		if(currentSec === '수정하기') $('#writing').find('.after').text('글쓰기'); 
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
			initialWarn();
		});
	});
	
	// 확인 버튼 클릭 시 ajax 총신(수정, 삭제)
	updateModal.find('.uBtm').find('button').on('click', function(){
		var uPwd = modalBox.find('.uBtm').find('input').eq(0).val();
		var criteria = $(this).parent().prev().text();
		if(criteria.includes('수정')) {
			$.ajax({
				url:'val',
				method:'post',
				data: {num:updateNo, pwd:uPwd},
				success: function(data, msg, xhr){
					// 수정 모달 - 비밀번호 일치 시
					modalBox.find('.uBtm').find('input').eq(0).val('');
					$('#modalBox').find('.close').click();
					selectShow('writing', false);
					$('#writing').find('.after').text('수정하기');
					title.val(updateVal.title);
					author.val(updateVal.author);
					pwd.val(uPwd);
					content.text(updateVal.content);
				},
				error: function(xhr){
					// 수정 모달 - 비밀번호 미일치 시
					if(xhr.status === 400){
						initialWarn();
						var warn = $('<span/>').addClass('warn').text('비밀번호 미일치');
						updateModal.find('.uBtm').append(warn);
						modalBox.find('.uBtm').find('input').eq(0).val('');
					}	
				}
			});
		}else if(criteria.includes('삭제')){
			$.ajax({
				url:'val',
				method:'post',
				data: {num:updateNo, pwd:uPwd},
				success: function(data, msg, xhr){
					// 삭제 모달  - 비밀번호 일치 시
					$.ajax({
						url:'bbs/:' + updateNo,
						method: 'delete',
						success: function(data, msg, xhr){
							selectShow('bbs', true);
							tbody.children().remove();
							getList(0, false);
							$('#modalBox').find('.close').click();
							modalBox.find('.uBtm').find('input').eq(0).val('');
						}
					});
				},
				error: function(xhr){
					// 삭제 모달  - 비밀번호 미일치 시
					if(xhr.status === 400){
						initialWarn();
						var warn = $('<span/>').addClass('warn').text('비밀번호 미일치');
						updateModal.find('.uBtm').append(warn);
						modalBox.find('.uBtm').find('input').eq(0).val('');
					}						
				}
			});
			
		}else{
			modalBox.removeClass('active');	
		}
	});
});