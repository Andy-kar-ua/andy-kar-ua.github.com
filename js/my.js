function dataPick(cls){
	var table = document.getElementById(cls),
		cols = table.querySelectorAll('th').length,
		dataBase = []; // сюда будут попадать ячейки таблицы

	var string =  "sort=name=dec&page=1&filter=3&field=",
		params = new Object;

	location.hash = string;
	getParams(string);
		
	var paging = document.getElementById('paging'),
		headers = table.querySelectorAll('th a'),
		len = headers.length;
	for (var i =0; i<len; i++){
		headers[i].setAttribute('data-id', i);
		headers[i].setAttribute('data-checker', 'false');
	}

	function getData(table){
		var all = table.querySelectorAll('tbody td'),
			rows = table.querySelectorAll('tbody tr').length,
			counter = 0;
		for (var i = 0; i < cols; i++){
			counter = i;
			dataBase[i] = [];
			for (var j = 0; j < rows; j++){
				dataBase[i][j]= all[counter];
				counter += cols;
			}
		}
	}

	function revert(dataBase) {
		var el,
			rows = table.querySelectorAll('tbody tr').length;
		for (var i = 0; i < rows; i++){
			for (var j = 0; j<cols; j++){
				el = dataBase[i][cols-j].innerHTML;
				dataBase[i][cols-j].innerHTML = dataBase[i][j].innerHTML;
				dataBase[i][j].innerHTML = el;
			}
		}
	}
	
	var myHashchangeHandler = function(){
		var params = getParams (window.location.hash);
		makePagingActive(params.page);
		makeFieldActive(params);
	} 
	window.addEventListener("hashchange", myHashchangeHandler, false);

	var sum = 8, // сколько строк таблицы выводить
		curentPage = 1, // начальная страница
		holder = table.querySelector('tbody'),
		lines = holder.querySelectorAll('tr');
		paging = document.getElementById('paging'),
		popup = document.getElementById('popup'),
		closePopup = popup.querySelector('.close');

	function hidePopup(){
		popup.style.display = "none";
	}
	hidePopup();

	table.addEventListener('click', function(e){
		var _this = e.target;
		if (_this.tagName == "A" && _this.parentNode.tagName == "TH"){
			setParams('fieldName', _this.getAttribute('data-name'));
			var type = (hasClass(_this,'active')) ? 'inc' : 'dec';
			setParams('fieldType', type);
			if (hasClass(_this, 'active'))  {
				removeClass(_this, 'active');
				addClass(_this, 'active-inc');
			} else if (hasClass(_this, 'active-inc')){
				removeClass(_this, 'active-inc');
				addClass(_this, 'active');
			} else {
				clearFields();
				addClass(_this, 'active');
			}
			e.preventDefault();
		}
		if (hasClass(_this,'open-popup')) {
			popup.style.display = "block";
			e.preventDefault();
		}
	});

	closePopup.addEventListener('click', function(e){
		hidePopup();
		e.preventDefault();
	});

	document.addEventListener('keyup', function(e){
		console.log('pressed');
        if (e.keyCode == '27') {
            hidePopup();
        }
    });

	paging.addEventListener('click', function(e){
		if (e.target.tagName == "A") {
			var num = +e.target.innerHTML;
			makePagingActive(num)
			setParams('page', num);
			e.preventDefault();
		}
	});

	function clearFields(){
		var active = table.querySelector('th .active');
		if (active) removeClass(active, 'active');
		active = table.querySelector('th .active-inc');
		if (active) removeClass(active, 'active-inc');
	}

	function makePagingActive(num){
		removeClass(paging.querySelector('.active'), 'active');
		paging.querySelectorAll('li')[num-1].className = 'active';
	}

	function makeFieldActive(obj){
		var type = obj.fieldType,
			name = obj.fieldName;
		type = (type=='dec') ? 'active' : 'active-inc'
		var field = table.querySelectorAll('th a'),
			len = field.length;

		clearFields();
		for (var i = 0; i < len; i++) {
			if (field[i].getAttribute('data-name')==name){
				field[i].className=type;
			}
		}
	}

	function getParams(string){
		var pices = string.split('&');
		params.fieldName = pices[0].split('=')[1]
		params.fieldType = pices[0].split('=')[2]
		params.page = pices[1].split('=')[1]
		params.filter = pices[2].split('=')[1]
		params.field = pices[3].split('=')[1]
		return params;
	}

	function setParams(type, value){
		params[type] = value;
		var string = 'sort='+params.fieldName+'='+params.fieldType+'&page='+params.page+'&filter='+params.filter+'&field='+params.field;
		window.location.hash = string;
	}

	paging.addEventListener('click', function(e){
		if (e.target.tagName == "A") {
			removeClass(paging.querySelector('.active'), 'active');
			e.target.parentNode.className = 'active';
			var num = +e.target.innerHTML;
			showItems(holder, sum, num);
			e.preventDefault();
		}
	});

	function showItems(where, sum, begin){
		where.innerHTML="";
		for (var i = sum*(begin-1); i< sum*begin; i++ ) {
			where.appendChild(lines[i]);
		}
	}
	
	showItems(holder, sum, curentPage);

	var myForm = document.getElementById('form');
	var	inputF = document.getElementById('input-text'),
		selectF = document.getElementById('select');

	inputF.addEventListener('keyup', function(){
        if (this.value.length > 1) {
            setParams('field', this.value);
        }
    });

    selectF.addEventListener('change', function(){
    	setParams('filter', this.value);
    });

    var topLine = table.querySelector('thead');
	var oldPosition = elementPosition(topLine).top;

	window.onscroll = function (oEvent) {
	  if (oldPosition < document.body.scrollTop) {
	    topLine.style.position = 'fixed';
	    topLine.style.top = '0px';
	  } else {
	    topLine.style.position = 'static';
	  }
	}

}

dataPick('thisTable');

function hasClass(el, cls){
    return ((' ' + el.className + ' ').indexOf(' ' + cls + ' ') !== -1)
}
function addClass(el, cls){
    if (!hasClass(el, cls))
        return el.className += (el.className !='') ? ' ' + cls : el.className = cls;
}
function removeClass(el, cls){
    if (hasClass(el, cls)) {
        elCls = el.className;
        return el.className = elCls.substring(0, el.className.indexOf(cls)) + elCls.substring(el.className.indexOf(cls) + cls.length, el.className.length)
    }
}

function parentHasClass(el, cls) {
    if(!el) return false;
    while (el.parentNode) {
        if (hasClass(el, cls)) {
            return el;
        }
        el = el.parentNode;
    }
}

    
function elementPosition(elem){
    var box = elem.getBoundingClientRect();
    var docElem = document.documentElement;
    var scrollTop = window.pageYOffset;
    var scrollLeft = window.pageXOffset;
    var clientTop = docElem.clientTop;
    var clientLeft = docElem.clientLeft;
    return {
        top: Math.round(box.top +  scrollTop - clientTop),
        left: Math.round(box.left + scrollLeft - clientLeft)
    }
}