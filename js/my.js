function Chart(parent, config){

	var paddings = 25,
		newWidth = config.width - 2*paddings,
		newHeight = config.height - 2*paddings,
		parent = document.querySelector(parent),
		minX = config.axisX.min,
		minY = config.axisY.min,
		svg = create('svg'),
		kx = newWidth/(config.axisX.max-minX),
		ky = newHeight/(config.axisY.max-minY),
		lineH = 3;

parent.innerHTML = '';

function create(tag){
    var svgNS = "http://www.w3.org/2000/svg";
    return  document.createElementNS(svgNS,tag);
}

function setA(el,o){
    for(var i in o){
        el.setAttribute(i,o[i])
    }
}       

function makeLine(x1, y1, x2, y2, width, color, type ){
	var line = create('path'),
		pasthString = '';
	pasthString = 'M'+x1+' '+revertY(y1)+'L'+x2+' '+revertY(y2);
	if (type=='dashed'){
		setA(line,{
			d : pasthString,
			stroke: color,
			'stroke-width': width,
			'stroke-dasharray': "5,5"
		});
	} if (type=='dotted') {
		setA(line,{
			d : pasthString,
			stroke: color,
			'stroke-width': width,
			'stroke-dasharray': "1,1"
		});
	} else {
		setA(line,{
			d : pasthString,
			stroke: color,
			'stroke-width': width
		});
	}

	addToChart(line);
}

function makePoint(x,y, color) {
	var circle =  create('circle');
	setA(circle,{
	   cx: x,
	   cy: y,
	   r: 6,
	   stroke: color,
	   'stroke-width': lineH,
	   fill:"white"
	});
	addToChart(circle);
}

function makePoint2(x,y, color, fill) {
	var path =  create('path'),
		pasthString = '';

	y -=10;
	pasthString = 'M'+x+' '+y+'L'+(x-15)+' '+(y-10)+'L'+(x-15)+' '+(y-35)+'L'+(x+15)+' '+(y-35)+'L'+(x+15)+' '+(y-10) + ' Z';

	setA(path,{
		d : pasthString,
		stroke: color,
		fill : "url(#"+fill+")"
	});
	
	addToChart(path);
}

function makeGradient(id, color){
	var grad =  create('linearGradient'),
		stop =  create('stop');

	setA(grad,{
	   id: id,
	   x1: "0%",
	   y1: "10%",
	   x2: "0%",
	   y2: "100%"
	});

	setA(stop,{
	   offset: "0%",
	   style: "stop-color:rgb(255,255,255);stop-opacity:1"
	});
	grad.appendChild(stop);
	stop =  create('stop');
	setA(stop,{
	   offset: "100%",
	   style: "stop-color:"+color+";stop-opacity:0.55"
	});
	grad.appendChild(stop);
	addToChart(grad);
	return id
}

function makeRect(x, y, width, height, fill){
	var rect =  create('rect');
	setA(rect,{
	   x: x,
	   y: y,
	   width: width,
	   height: height,
	   fill: fill
	});
	addToChart(rect);
}

function makeGraph(points){
	var len = points.length,
		pointX = 0,
		pointY = 0,
		color = config.data[0].color;

	for (var i =0; i<len; i++){
		pointX = (points[i].x-minX)*kx+paddings;
		pointY = (points[i].y-minY)*ky+paddings;
		if (points[i+1]){
			makeLine(pointX, pointY, (points[i+1].x-minX)*kx+paddings, (points[i+1].y-minY)*ky+paddings, lineH, color);
		}
		makeLine(pointX, pointY, pointX, paddings, 1, 'grey', 'dotted');
		makeRect(pointX-12, revertY(paddings+18), 30, 14, 'white');
		makeText(pointX-7, paddings+7, 'black', points[i].x);
		makePoint(pointX, revertY(pointY), color);
		makePoint2(pointX, revertY(pointY), color, makeGradient('black', color));
	}
}

function makeText(x, y, color, ch){
	var text = create('text'),
		textNode = "";
	setA(text,{
		x : x,
		y : revertY(y),
		fill: color
	});
	textNode = document.createTextNode(ch);
	text.appendChild(textNode);
	addToChart(text);
}

function build(){
	setA(svg,{
	   version:'1.1',
	   width: config.width,
	   height: config.height
	})

	createAxis('horizontal', config.axisX, true);
	createAxis('vertical', config.axisY, false, config.middleLineColor);

	parent.style.width = config.width + 'px';
	parent.style.height = config.height + 'px';
	parent.appendChild(svg);
	makeGraph(config.data[0].points);
}

function createAxis(type, data, showLines, color){
	var x = paddings,
		dash = 4, // размер черточки на осях
		koef = 0, 
		rotate = "none",
		count = data.points.length,
		point = paddings,
		path = create('path'),
		pasthString = '',
		text = '',
		color = color || 'black',
		showLines = showLines || false;

	if (type =="horizontal") {
		x += newWidth;
		koef = newWidth/(data.points.length-1);
		
	} else {
		koef = newHeight/(data.points.length-1);
		x += newHeight;
		rotate = 'rotate(270, ' + paddings +' '+(newHeight+paddings)+')'
	}

	pasthString = 'M'+paddings+' '+revertY(paddings)+'L'+(x)+' '+revertY(paddings);

	for (var i = 0; i < count; i++) {
		pasthString += 'M'+point+' '+(revertY(paddings)+dash)+'L'+point+' '+(revertY(paddings)-dash);
		text = ''+ data.points[i];
		if (type =="horizontal") {
			makeText(point-6, paddings-15, color, text)
		} else {
			if (i>0)
				makeLine(paddings, point, newWidth+paddings, point, 1, color, 'dotted');
			makeText(paddings-10, point-4, color, text)
		}
		point += koef;
	};

	if (!showLines) pasthString = 'M0 0';

	setA(path,{
		d : pasthString,
		stroke: color,
		'stroke-width': 1,
		fill: 'none',
		transform: rotate,

	});
	addToChart(path);
}

function revertY(y){return Math.abs(y-config.height)}

function addToChart(el){
	svg.appendChild(el);
}

build();
}

var config = [
{
	width: 550, //ширина графика
	height:430, //высота. Если их изменить то все отрисуется правильно.
	middleLineColor: "rgb(133,205,250)",
	axisX: {
		max: 50,
		points: [15, 20, 25, 30, 35, 40, 45, 50],
		min: 15
		
	},
	axisY: {
		max:3,
		min:0,
		middle: 2.2,
		points: [0, 1, 2, 3],
		points2:[
		         {val:0, lbl:"<i class='tick first'></i>0"},
		         {val:0.6, lbl:"<i class='tick'></i>20"},
		         {val:1.2, lbl:"<i class='tick'></i>40"},
		         {val:1.8, lbl:"<i class='tick'></i>60"},
		         {val:2.4, lbl:"<i class='tick'></i>80"},
		         {val:3, lbl:"<i class='tick last'></i>100%"}
			]
	},
	
	data: [
	       		{
	       			color: "rgb(102,217,2)",
	       			label: "Менеджмент", //пусть при наведении на точку появится подсказочка кому эта точка принадлежит
	       			id: "someid",
	       			points: [
	       			         {x: 18, y: 1.2,  percent:42}, 
	       			         {x: 28.4, y: 2, percent: 70},
	       			         {x: 40.4, y: 0.8, percent: 10}
	       			        ]
	       		}
	       		
	       ]
},
{
	width: 550, //ширина графика
	height:430, //высота. Если их изменить то все отрисуется правильно.
	middleLineColor: "rgb(133,205,250)",
	axisX: {
		max: 50,
		points: [15, 20, 25, 30, 35, 40, 45, 50],
		min: 15
		
	},
	axisY: {
		max:3,
		min:0,
		middle: 2.2,
		points: [0, 1, 2, 3],
		points2:[
		         {val:0, lbl:"<i class='tick first'></i>0"},
		         {val:0.6, lbl:"<i class='tick'></i>20"},
		         {val:1.2, lbl:"<i class='tick'></i>40"},
		         {val:1.8, lbl:"<i class='tick'></i>60"},
		         {val:2.4, lbl:"<i class='tick'></i>80"},
		         {val:3, lbl:"<i class='tick last'></i>100%"}
			]
	},
	
	data: [
	       		
	       		{
	       			color: "rgb(0,150,245)",
	       			label: "Менеджер",
	       			id: "someid2",
	       			points: [{x: 28, y: 2.2, percent: 15}]
	       		}
	       		
	       ]
},
{
	width: 550, //ширина графика
	height:430, //высота. Если их изменить то все отрисуется правильно.
	middleLineColor: "rgb(133,205,250)",
	axisX: {
		max: 50,
		points: [15, 20, 25, 30, 35, 40, 45, 50],
		min: 15
		
	},
	axisY: {
		max:3,
		min:0,
		middle: 2.2,
		points: [0, 1, 2, 3],
		points2:[
		         {val:0, lbl:"<i class='tick first'></i>0"},
		         {val:0.6, lbl:"<i class='tick'></i>20"},
		         {val:1.2, lbl:"<i class='tick'></i>40"},
		         {val:1.8, lbl:"<i class='tick'></i>60"},
		         {val:2.4, lbl:"<i class='tick'></i>80"},
		         {val:3, lbl:"<i class='tick last'></i>100%"}
			]
	},
	
	data: [
	       		
	       		{
	       			color: "rgb(241,220,45)",
	       			label: "Программист",
	       			id: "someid3",
	       			points: [
	       			         {x: 19 , y: 0.2, percent: 12}, 
	       			         {x: 24, y:0.6, percent: 15}, 
	       			         {x: 28, y:3, percent: 1}]
	       		}
	       		
	       ]
}
];

var list = document.querySelector('.sidebar'),
	items = list.querySelectorAll('li'),
	len = items.length;

for (var j = 0; j< len; j++) {
	items[j].setAttribute('data-num', j);
}

list.addEventListener('click', function(e){
	var _this = e.target;
	if (_this.tagName == 'A') {
		var num = +_this.parentNode.getAttribute('data-num');
		if (config[num])
			chart = new Chart("#container", config[num]);
		list.querySelector('.active').classList.remove('active');
		_this.parentNode.classList.add('active');
	}
});

var chart = new Chart("#container", config[0]);

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