// ---------------------------------------------- P O P U P --------------------------------------------------

var popup = document.getElementById('popup'),
    closePopup = popup.querySelector('.close'),
    popupHolder = popup.querySelector('.popup-holder'),
    popupHtml = popupHolder.innerHTML;

function hidePopup(){
    document.body.style.overflow = 'visible';
    popupHolder.innerHTML = '';
    hide(popup);
}

document.addEventListener('click', function(e){
    var _this = e.target;
    if (_this.classList.contains('open-popup')) {
        popupHolder.innerHTML = popupHtml;
        show(popup);
        dropPick('replace','drop');
        var winHeight = document.documentElement.clientHeight,
            boxHeight = popupHolder.clientHeight;
        if (boxHeight > winHeight) {
            winHeight = boxHeight;
            popup.querySelector('.bg').style.height = boxHeight+40+'px';
            popupHolder.style.top = '20px';
            document.body.style.overflow = 'hidden';
        } else{
            popupHolder.style.top = (winHeight - boxHeight)/2 + 'px';
        }
        var parent = _this.parentNode.parentNode;

        tablePatch.setForm(gtData(parent));
        tablePatch.active = parent;
        e.preventDefault();
    }
})

popup.addEventListener('click', function(e){
    var _this = e.target;
    if (_this.tagName == "A" && _this.classList.contains('close')){
        hidePopup();
        e.preventDefault();
    }
});

document.addEventListener('keyup', function(e){
    if (e.keyCode == '27') {
        hidePopup();
    }
});

popup.querySelector('.bg').addEventListener('click',function(){
    hidePopup();
});

hidePopup();
/* ------------------------------------------ PATCH ------------------------------------------ */
var tablePatch = {

    data: [],
    rows: 0,
    dataLine: 0,
    dataRow: [],
    result: [],
    active: {},

    init: function(cls){
        this.table = document.getElementById(cls);
        this.cols = this.table.querySelectorAll('th').length-1;
        this.rows = this.table.querySelectorAll('tbody tr').length;

        var dataCell = this.table.querySelectorAll('tbody td'),
            data = this.data,
            rows = this.rows,
            counter = 0,
            cols = this.cols;

        for (var i = 0; i<rows; i++){
            data[i] = [];
            for (var j = 0; j< cols; j++){
                data[i][j] = dataCell[counter];
                counter++;
            }
        }
    },

    showItems: function(here, sum, begin){
        where.innerHTML="";
        for (var i = sum*(begin-1); i< sum*begin; i++ ) {
            where.appendChild(lines[i]);
        }
    },

    setForm: function(dataRow){
        var form = document.getElementById('info-form'),
            fields = form.querySelectorAll('input[type="text"]'),
            parentObj = this;
        for (var i = 0; i< fields.length; i++) {
            fields[i].value = dataRow[i];
            if (typeof dataRow[i] == 'object'){
                // TODO Проверка на количество
                var line = dataRow[i].querySelectorAll('li'),
                    len = line.length;
                fields[i].value = getTextContent(line[0]);
                for (var j = 1; j< len; j++){
                    parentObj.addField(fields[i].parentNode, getTextContent(line[j]));
                }
            }
        }
        form.querySelector('textarea').value=dataRow[fields.length];
        form.addEventListener('click', function(e){
            var _this = e.target;
            if (_this.classList.contains('add')){
                parentObj.addField(_this.parentNode, '');
            } else if (_this.classList.contains('remove')){
                e.preventDefault();
                parentObj.removeField(_this);
            }
            if (_this.classList.contains('btn-save')){
                e.preventDefault();
                console.log('here');
                parentObj.setData();
                hidePopup();
            }
        })
    },
    setData: function (){
        var form = document.getElementById('info-form'),
            fields = form.querySelectorAll('input[type="text"]'),
            count = fields.length,
            result = this.result,
            flag = true,
            num = 0,
            j = 0;

        for (var i = 0; i< count; i++){
            var next = fields[j+1] != undefined ? fields[j+1].getAttribute('name') : '';
            if (fields[j].getAttribute('name')==next) {
                result[i] = [];
                 while(fields[j].getAttribute('name')==next){
                    result[i].push(fields[j].value);
                    j++;
                    count--;
                }
                count++;
            } else {
                result.push(fields[j].value);
                j++;
            }
        }
        result[count] = form.querySelector('textarea').value;
        setToTable(this.active, this.result);
    },
    addField: function(element, content){
        var cloned = element.cloneNode(true),
            btn = cloned.querySelector('input[type="button"]'),
            field = cloned.querySelector('input[type="text"]');
        btn.classList.remove('add');
        btn.classList.add('remove');
        btn.setAttribute('value', '-');
        field.value = content;
        element.parentNode.appendChild(cloned);
    },
    removeField: function(element){
        element.parentNode.parentNode.removeChild(element.parentNode);
    }

}
tablePatch.init('thisTable');

// ----------------------------------------------- Table old
function tableSorting(cls){
	var table = document.getElementById(cls),
		cols = table.querySelectorAll('th').length-1;

	var string =  "sort=name=dec&page=1&filter=3&field=",
		params = new Object;

	var headers = table.querySelectorAll('th a'),
		len = headers.length;
	for (var i =0; i<len; i++){
		headers[i].setAttribute('data-id', i);
		headers[i].setAttribute('data-checker', 'false');
	}

	var holder = table.querySelector('tbody'),
		lines = holder.querySelectorAll('tr'),
        rows = lines.length,
        allCells = [];

	table.addEventListener('click', function(e){
		var _this = e.target;
		if (_this.tagName == "A" && _this.parentNode.tagName == "TH"){
			var type = _this.classList.contains('active') ? 'inc' : 'dec',
                index = _this.parentNode.cellIndex;
            grubData();
			if (_this.classList.contains('active'))  {
				_this.classList.remove('active');
				_this.classList.add('active-inc');
                sortInc(allCells,index);
			} else if (_this.classList.contains('active-inc')){
				_this.classList.add('active');
				_this.classList.remove('active-inc');
                sortDec(allCells,index);
			} else {
				clearFields();
				_this.classList.add('active');
                sortDec(allCells,index);
			}
            putData();
			e.preventDefault();
		}
	});

    function grubData(){
        allCells = [];
        for (var i = 0; i<rows; i++){
            allCells[i] = gtData(lines[i]);
        }
    }

    function putData(){
        for (var i = 0; i<rows; i++){
            setToTable(lines[i], allCells[i]);
        }
    }

	function clearFields(){
		var active = table.querySelector('th .active');
		if (active) active.classList.remove('active');
		active = table.querySelector('th .active-inc');
		if (active) active.classList.remove('active-inc');
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

	function makeText(text) {
		inputF.value = text;
	}

    var myForm = document.getElementById('form');
	var	inputF = document.getElementById('input-text'),
		selectF = document.getElementById('select');

	inputF.addEventListener('keyup', function(){
        if (this.value.length > 1) {
        }
    });


    var topLine = table.querySelector('thead tr'),
		oldPosition = elementPosition(topLine).top,
    	alreadyCloned = false;

	window.onscroll = function (oEvent) {
	  if (!alreadyCloned) {
	  	var cloned = topLine.cloneNode(true);
	  	cloned.className = 'cloned';
	  }
	  if (oldPosition < document.body.scrollTop) {
	    if (!alreadyCloned) {
			topLine.parentNode.appendChild(cloned);
			alreadyCloned = true;
        }
	    topLine.style.position = 'fixed';
	    topLine.style.top = '0px';
	  } else {
	  	if (alreadyCloned){
	  		alreadyCloned = false;
	  		topLine.parentNode.removeChild(topLine.parentNode.querySelector('.cloned'));
	  	}
	    topLine.style.position = 'static';
	  }
	}

}
tableSorting('thisTable');

// ---------------------------------------------- D A T A P I C K E R -------------------------------------------

function dataPick(cls){
    var me;
    var date = new Date (),
        tempDate = new Date(),
        mounthList = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май',' Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декаюрь'],
        currentState = 'year',
        calendarHolder = document.createElement('div'),
        btnPrev = document.createElement('span'),
        btnNext = document.createElement('span'),
        btnToday = document.createElement('span'),
        titleYear = document.createElement('span'),
        titleMonth = document.createElement('span'),
        holder = document.createElement('div'),
        tableHolder = document.createElement('div'),
        field;
    
    
    document.addEventListener('click', function(e){
        if (parentHasClass(e.target, cls)) {
            me = parentHasClass(e.target, cls);
			
            field = me.querySelector('input');
            date = (!field.getAttribute('dataValue')=='') ? date = new Date(field.getAttribute('dataValue')) : date = new Date ();
			tempDate = date;
            currentState = 'year';
            calendarHolder.style.left = elementPosition(me).left +'px';
            calendarHolder.style.top = elementPosition(me).top + me.offsetHeight +'px';
			tableYear();
            show(calendarHolder);
        } else {
            currentState = "year";
            hide(calendarHolder);
        }
    });

    document.addEventListener('keypress', function(e){
        if (e.keyCode == '27') {
            hide(calendarHolder);
            currentState = "year";
        }
    });
    
    function parentHasClass(el, cls) {
        if(!el) return false;
        while (el.parentNode) {
            if (el.classList.contains(cls)) {
                return el;
            }
            el = el.parentNode;
        }
    }
    btnPrev.className='btn-prev';
    btnNext.className='btn-next';
    btnToday.className='btn-today';
    btnToday.innerHTML='Today';
    titleYear.className='tYear';
    titleYear.innerHTML = date.getFullYear();
    titleMonth.className='tMounth';
    titleMonth.innerHTML = mounthList[date.getMonth()];
    holder.className = 'title';
    tableHolder.className = 'table-holder';

    holder.appendChild(btnPrev);
    holder.appendChild(btnNext);
    holder.appendChild(btnNext);
    holder.appendChild(titleYear);
    holder.appendChild(titleMonth);
    calendarHolder.className = "datapicker";
    calendarHolder.appendChild(holder);
    calendarHolder.appendChild(tableHolder);
    calendarHolder.appendChild(btnToday);
    calendarHolder.style.display = 'none';
    calendarHolder.style.position = 'absolute';
    document.body.appendChild(calendarHolder);
    tableYear(date);
    
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
    function tableDay(){
        var html = "<table class='calendar-table'><tr><th>Thu</th><th>Wen</th><th>Thi</th><th>Fry</th><th>Sat</th><th>Sun</th><th>Mon</th></tr>",
            dayCount = 32 - new Date(tempDate.getYear(), tempDate.getMonth(), 32).getDate(), // в текущем
            last = 32 - new Date(tempDate.getYear(), tempDate.getMonth()-1, 32).getDate(), // дней в предыдущем месяце
            begin = new Date(tempDate.getYear(), tempDate.getMonth(), 1).getDay();  // номер первого дня этого месяца

        var counter = last - (begin - 1);
        var cls = " class='grey'";
        var flag = false;
        if (counter >= last ) {
            counter = 1;
            cls = "";
            flag = true;
        }
        for (var i=0;i<6; i++) {
            html += "<tr>";
            for (var j=0; j<7;j++){
                if (tempDate.valueOf()==date.valueOf() && tempDate.getDate()==counter && flag){
                    html += "<td class='curent'>"+counter+"</td>";
                } else {
                    html += "<td" +cls+">"+counter+"</td>";
                }
                if (counter == last && !flag){
                    counter = 1;
                    flag = true;
                    cls = "";
                } else if (counter == dayCount && flag) {
                    counter = 1;
                    flag = false;
                    cls = " class='grey'";
                } else {
                    counter +=1;
                }
            }
        }
        html += "</tr></table>";
        calendarHolder.querySelector(".table-holder").innerHTML = html;   // 1
    }
    
    function tableMonth(){
        var html = "<table class='calendar-table'>";
        var counter = 0;
        for (var i = 0; i <= 3; i++) {
            html += "<tr>";
            for (var j = 0; j <= 2; j++) {
                if (tempDate.getMonth()==date.getMonth() && tempDate.getFullYear()==date.getFullYear() && tempDate.getMonth()==counter) {
                    html += "<td class='curent'>" + mounthList[counter] + "</td>"
                } else {
                    html += "<td>" + mounthList[counter] + "</td>"
                }
                counter +=1;
            };
        };
        calendarHolder.querySelector(".table-holder").innerHTML = html;    // 1
    }
    
    function tableYear(){
        var past = date.getFullYear() % 20;
        var html = "<table class='calendar-table'>";
        var counter = 0;
        for (var i = 0; i <= 3; i++) {
            html += "<tr>";
            for (var j = 0; j <= 4; j++) {
                var cur = tempDate.getFullYear() - past + counter;
                if (cur == date.getFullYear()) {
                    html += "<td class='curent'>" + cur + "</td>"
                } else {
                    html += "<td>" + cur + "</td>"
                }
                counter +=1;
            };
        };
        calendarHolder.querySelector(".table-holder").innerHTML = html;    // 1
    }
    
    function findMonth(name){
        for (var i=0; i<= 11; i++){
            if (mounthList[i]==name){
                return i;
            }
        }
        return false;
    }
    
    function refreshView(val){
        switch (currentState){
            case 'year':
                tempDate.setFullYear(tempDate.getFullYear()+val);
                tableYear();
                break
            case 'month':
                tempDate.setFullYear(tempDate.getFullYear()+val);
                tableMonth();
                break
            case 'day':
                tempDate.setMonth(tempDate.getMonth()+val);
                tableDay();
                break
        }
    }
    function refreshTitle(){
        var pickerBox = document.querySelector('.'+cls);
        titleYear.innerHTML = tempDate.getFullYear();
        titleMonth.innerHTML = mounthList[tempDate.getMonth()];
    }
    
    function refreshField(dat){
        var date = dat || tempDate,
            pickerBox = document.querySelector('.'+cls),
            field = me.querySelector('input');
        field.value = date.getFullYear() +' ' + mounthList[date.getMonth()] + ' ' + date.getDate();
        field.setAttribute('dataValue', date);
    }
    
    calendarHolder.onclick = function(e){
        show(calendarHolder);
        e.stopPropagation();
    }
    btnToday.addEventListener('click', function(){
        refreshField(new Date());
    });
    
    titleYear.addEventListener('click', function(){
        currentState = 'year';
        tableYear();
    });
    
    titleMonth.addEventListener('click', function(){
        currentState = 'month';
        tableMonth();
    });
        
    btnNext.onclick = function(){
        switch (currentState){
            case 'year':
                refreshView(20);
                break
            case 'month':
                refreshView(1);
                break
            case 'day':
                refreshView(1);
                break
        }
        refreshTitle();
    }
    btnPrev.onclick = function(){
        switch (currentState){
            case 'year':
                refreshView(-20);
                break
            case 'month':
                refreshView(-1);
                break
            case 'day':
                refreshView(-1);
                break
        }
        refreshTitle()
    }
    tableHolder.onclick = function(e){
        var _this = e.target;
        if (_this.tagName == "TD" && !_this.classList.contains('grey')) {
            switch (currentState) {
                case 'year':
                    currentState = "month";
                    tempDate.setFullYear(+_this.innerHTML);
                    tableMonth(date);
                    
                    break
                case 'month':
                    currentState = "day";
                    tempDate.setMonth(findMonth(_this.innerHTML));
                    tableDay();
                    break
                case 'day':
                    tempDate.setDate(+_this.innerHTML);
                    date = tempDate;
                    tableDay();
                    refreshField();
                    hide(calendarHolder);
                    break
            }
            refreshTitle();
        }
    }
}

dataPick('datap');

/* ********************************************* D R O P ************************/

function dropPick(selekt,cls){
    var element,
        database = [],
        activeBox,
        activeBtn;

    document.addEventListener('keypress', function(e){
        if (e.keyCode == '27') {
            var box = document.querySelectorAll('.drop-box');
            var len = box.length;
            for (var i = 0; i < len; i++){
                if (box[i].style.visibility != 'hidden'){
                    box[i].style.visibility = 'hidden';
                    activeBtn.classList.remove('active');
                }
            }
        }
    });
    
    (function findSelect(){
        var all = document.querySelectorAll('select');
        var len = all.length;
        for (var i = 0; i< len; i++) {
            if (all[i].classList.contains(selekt))
                replace(all[i], i);
        }
    })();
    
    function replace(e, num){
        var link = document.createElement('a'),
            parent = e.parentNode;
        link.className=cls;
        link.innerHTML = "Select city";
        link.setAttribute('dataid', num);
        link.addEventListener('click', function(e){
            var id = this.getAttribute('dataid');
            var box = document.getElementById('dropBox'+id);
            if (box.style.visibility == 'hidden'){
                box.style.left = elementPosition(this).left +'px';
                box.style.top = elementPosition(this).top + this.offsetHeight +'px';
                box.style.visibility = 'visible';
                this.classList.add('active');
                activeBox = box;
                activeBtn = this;
            } else {
                box.style.visibility = 'hidden';
                this.classList.remove('active');
                activeBtn = '';
            }
            e.stopPropagation();
        });
        parent.insertBefore(link,e);
        var len = e.length,
            masBig = [],
            masAll = [];
        for (var i = 0; i< len; i++){
            if (e.options[i].value == 'big') masBig.push(e.options[i].text);
            masAll.push(e.options[i].text);
        }
        database[num] = masAll;
        if (!window.createBoxDone)
            createBox(masBig, masAll, num);
        e.style.display = "none";
    }
    function createBox(mas1, mas2, num){
        window.createBoxDone = 1;
        var box = document.createElement('div'),
            field = document.createElement('input');
        box.id = 'dropBox'+num;
        field.addEventListener('keyup', function(){
            if (this.value.length > 1) {
                var parent = this.parentNode;
                var num = parseInt(parent.id.substring(parent.id.length-1));
                var list = createList(autoComplete(this.value, database[num]));
                parent.replaceChild(list, this.nextSibling);
            }
        });
        box.addEventListener('click', function(e){
            if (e.target.tagName == 'A'){
                activeBtn.previousElementSibling.value = e.target.innerHTML;
                e.target.className = 'active';
                box.style.visibility = 'hidden';
            }
        });
        box.className = "drop-box";
        box.appendChild(createList(mas1));
        box.style.visibility='hidden';
        box.appendChild(field);
        box.appendChild(createList(mas2));
        box.style.position = 'absolute';
        field.type = 'text';
        document.body.appendChild(box);
    }
    
    function createList(mass){
        var list = document.createElement('ul');
        list.className="droplist";
        var html = "",
            length = mass.length;
        if (length == 0) {
            html += '<li>No items found</li>';
        }
        for (var i = 0; i < length; i++){
            html += '<li><a href="#">'+mass[i]+'</a></li>';
        }
        list.innerHTML = html+'</ul>';
        return list;
    }

    document.addEventListener('click', function(e){
        if (!parentHasClass(e.target, 'drop-box')){
            activeBox.style.visibility = 'hidden';
            activeBtn.classList.remove('active');
        }
    });
    
    function Run(element) {
        element.addEventListener('click', function(e){
            if (me.style.display == 'none'){
                me.style.display = 'block';
                element.classList.add('active');
            } else {
                me.style.display = 'none';
                element.classList.remove('active');
            }
            e.stopPropagation();
        });
    }
    
    function autoComplete(string, database) {
        var len = database.length,
            result = [];
            
        for (var i = 0; i<len; i++){
            if (findString(string, database[i])) result.push(database[i]);
        }
        return result;
    }
    function findString(sub, string){
        return string ? string.toUpperCase().indexOf(sub.toUpperCase())>=0 : false
    }
}



/* *********************************************  U T I L S *********************/
function hide(el){
    el.style.display = "none";
}
function show(el){
    el.style.display = "block";
}

function elementPosition(elem){
    var box = elem.getBoundingClientRect(),
        docElem = document.documentElement,
        scrollTop = window.pageYOffset,
        scrollLeft = window.pageXOffset,
        clientTop = docElem.clientTop,
        clientLeft = docElem.clientLeft;
    return {
        top: Math.round(box.top +  scrollTop - clientTop),
        left: Math.round(box.left + scrollLeft - clientLeft)
    }
}

// Get text from DOM object
function getTextContent(element) {
    var text= [];
    for (var i= 0, n= element.childNodes.length; i<n; i++) {
        var child= element.childNodes[i];
        if (child.nodeType===1)
            text.unshift(getTextContent(child));
        else if (child.nodeType===3)
            text.unshift(child.data);
    }
    return text.join('');
}

function createList(list, flag){
    var html = "<ul>",
        len = list.length,
        flag = flag || false;
    for (var i = 0; i<len; i++){
        if (!flag) {
            html += "<li>"+list[i]+"</li>";
        } else {
            html += "<li><a href='"+list[i]+"'>"+list[i]+"</li>";
        }
        ;
    }
    return html+"</ul>";
}

function sortInc(mas,num){
    mas.sort(function(a, b) {
        return a[num] == b[num] ? a > b : a[num] > b[num]
    });
}

function sortDec(mas,num){
    mas.sort(function(a, b) {
        return a[num] == b[num] ? a < b : a[num] < b[num]
    });
}

//   Table row to Array
function gtData(el){
    var dataRow = [],
        row = el.querySelectorAll('td'),
        cols = row.length - 1;
    if(!el) return false;
    while (el.parentNode) {
        if (el.tagName == "TR") {
            
            for (var i = 0; i < cols; i++){
                if (row[i].querySelectorAll('*').length > 1) {
                    dataRow[i] = row[i].querySelector('ul');
                } else {
                    dataRow[i] = row[i].innerHTML;
                }
            }
        }
        el = el.parentNode;
    }
    return dataRow;
}

function setToTable(tr, result){
    var cells = tr.querySelectorAll('td'),
        cols = cells.length -1;
    for (var i = 0; i< cols; i++) {
        if (typeof result[i] != "string") {
            if (!(result[i] instanceof Array)){
                var li = result[i].querySelectorAll('li'),
                    len = li.length,
                    mass = [];
                for (var j = 0; j < len; j++){
                    mass[j] = getTextContent(li[j]);
                }
                result[i] = mass;
            }
            if (i==6){
                cells[i].innerHTML = createList(result[i], 'links');
            } else {
                cells[i].innerHTML = createList(result[i]);
            }
        } else {
            if (i==6){
                cells[i].innerHTML = '<a href="'+result[i]+'">'+result[i]+'</a>';
            } else {
                cells[i].innerHTML = result[i];
            }
        }
    }
}
function parentHasClass(el, cls) {
    if(!el) return false;
    while (el.parentNode) {
        if (el.classList.contains(cls)) {
            return el;
        }
        el = el.parentNode;
    }
}