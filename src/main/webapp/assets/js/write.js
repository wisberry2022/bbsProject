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


$(function(){
	var arr = [];
	assign = $('.btnBox').children().eq(0);
	reset = $('.btnBox').children().eq(1);
	title = $('.writeBox').find('input').eq(0);
	author = $('.writeBox').find('input').eq(1);
	pwd = $('.writeBox').find('input').eq(2);
	content = $('textarea');
	
	$('.writeBox').find('input').each(function(idx, ele){
		arr.push($(ele));
	} );
	
	// 게시글 등록
	assign.on('click', function(e) {
		var paramObj = getParam(title,author,pwd,content);
	
		$.ajax({
			url:"write.do",
			method: 'post',
			data: paramObj,
			success: function(data, msg, xhr) {
				location.href = "index.do";
			}
		});
	});
	
	reset.on('click',function(e) {
		location.href = "index.do";
	});
});