var goWrite;
var cnt;
var getList = function(cnt) {
	$.ajax({
		url: 'list/' + (cnt ? cnt : 10),
		method: 'get',
		contentType: "application/json; charset:UTF-8",
		success: function(data, msg, xhr) {
			console.log(data);
		}
	});
}


$(function(){
	goWrite = $('.btnBox').children();
	goWrite.on('click', function(e){
		location.href = "write.do";
	});
	
	getList(5);
});