var Client = require('pg');
var client = new Client({ //PostgreSQLのクライアント（ユーザ）接続設定！
		user: 'fvtmfpskeksxyf',
		host: 'ec2-44-194-112-166.compute-1.amazonaws.com',
		database: 'd92qoitiu38r5q',
		password: '21899814b89fc9f58762b44dc375fc2544a219a2a3e68d803201d37e6ebaffc9',
		port: 5432
});
client.connect();

var searchBtn = document.getElementById('send');
var dragBtn = document.getElementById('drag'); //地図操作・コメント登録ボタン
var drawBtn = document.getElementById('draw');//図形描画ボタン
var i;
			
function initMap(){
	var myLatLng = new google.maps.LatLng(33.1897439, 131.6982435);
	var opts = {zoom: 18,
		center: myLatLng,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	var map = new google.maps.Map(document.getElementById("map"), opts);//map変数
	
	let count_area = 1;//領域の個数を数える変数
	let count_marker = 0;
	const markers = new Array();
	var areas = new Map(); //農地の緯度経度と名前を対応させるMap

	var drawingManager = new google.maps.drawing.DrawingManager({//図形描画ツールの設定
			drawingMode: google.maps.drawing.OverlayType.POLYGON,
			drawingControl: true,
			drawingControlOptions: {
			position: google.maps.ControlPosition.TOP_CENTER,
			drawingModes: [//描画する図形の種類設定
				google.maps.drawing.OverlayType.POLYGON,
			],
		},
		polygonOptions: {//多角形の設定
				editable: true,
				clickable: true,
				visible: true
		}
	});
	
	//var polygonObj = new google.maps.polygon(polygonOptions);
	
	drawBtn.addEventListener('click', function(){
			drawingManager.setMap(map);
	});
	
	dragBtn.addEventListener('click', function(){
			drawingManager.setMap(null);
		});
	
	google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {//多角形が描画された時のイベント
			let latAvg = 0;//多角形の中心座標
			let lngAvg = 0;
			let polygonPath = polygon.getPath();//多角形の各頂点のLatLng値
			polygonPath.forEach((value, ii)  => {// 各頂点の緯度経度をログ表示
				console.log(ii + '個目');
				console.log(value['lat']());
				latAvg = latAvg + value['lat']();
				console.log(value['lng']());
				lngAvg = lngAvg + value['lng']();
			});
			
			//農地登録フォーム作成
			var br = document.createElement('br');
			var tb = document.getElementById('submit');
			var title = document.createElement('h1');
			var cent1 = document.createElement('h2');
			var areaName_tb = document.createElement('input');
			var cent2 = document.createElement('h2');
			var suName_tb = document.createElement('input');
			var cent3 = document.createElement('h2');
			var cent4 = new Array();
			for(i=0; i<10; i++) cent4[i] = document.createElement('p');
			var products = new Array();
			for(i=0; i<10; i++) products[i] = document.createElement('input');
			var products_name = new Array();
			for(i=0; i<10; i++) products_name[i] = document.createElement('input');
			var cent5 = document.createElement('h2');
			var selecter = document.createElement('select');
			var opt = new Array();
			for (i=0; i<12; i++) opt[i] = document.createElement('option');
			var sm = document.createElement('button');
			
			areaName_tb.type = 'text';
			areaName_tb.id = 'area_name';
			suName_tb.type = 'text';
			for(i=0; i<10; i++) products[i].type = 'text';
			for(i=0; i<10; i++) products_name[i].type = 'text';
			opt[0].selected = 'selected';
			opt[0].value = 'not selected';
			opt[1].value = '稲作';
			opt[2].value = '畑作';
			sm.type = 'button';
			
			title.textContent = '選択された領域' + count_area + 'の情報登録';
			cent1.textContent = '農地の名前を入力してください（※必須）';
			areaName_tb.placeholder = 'n文字以内で入力';
			cent2.textContent = '土地管理者の名前を入力してください（※必須）';
			suName_tb.placeholder = 'n文字以内で入力';
			cent3.textContent = 'この農地で生産されている主な農作物の種類（※必須）とそのブランド名（※任意）を，最大10個まで入力してください';
			for(i=0; i<10; i++) cent4[i].textContent = (i+1) + '番目の農作物';
			for(i=0; i<10; i++) products[i].placeholder = (i+1) + ' : 種類';
			for(i=0; i<10; i++) products_name[i].placeholder = '（※任意）' + (i+1) + ' : ブランド名';
			cent5.textContent = '土壌の種類を以下のリストから選択してください（※任意）'
			opt[0].textContent = '選択されていません';
			opt[1].textContent = '造成土';
			opt[2].textContent = '有機質土';
			opt[3].textContent = 'ポドソル';
			opt[4].textContent = '黒ボク土';
			opt[5].textContent = '暗褐色土';
			opt[6].textContent = '低地土';
			opt[7].textContent = '赤黄色土';
			opt[8].textContent = '停滞水成土';
			opt[9].textContent = '褐色森林土';
			opt[10].textContent = '未熟土';
			opt[11].textContent = '分からない・答えたくない';
			sm.textContent = 'この内容で登録する';
			
			tb.appendChild(title);
			tb.appendChild(cent1);
			tb.appendChild(areaName_tb);
			tb.appendChild(cent2);
			tb.appendChild(suName_tb);
			tb.appendChild(cent3);
			for(i=0; i<10; i++){
				tb.appendChild(cent4[i]);
				tb.appendChild(products[i]);
				tb.appendChild(products_name[i]);
			}
			tb.appendChild(cent5);
			for(i=0; i<12; i++) selecter.appendChild(opt[i]);
			tb.appendChild(selecter);
			tb.appendChild(br);
			tb.appendChild(sm);
			//以上，農地登録フォーム

			latAvg /= polygonPath.length;
			lngAvg /= polygonPath.length;
			console.log('中心緯度' + latAvg);
			console.log('中心経度' + lngAvg);
			var areaLatLng = new google.maps.LatLng(latAvg, lngAvg); //中心座標を緯度経度型で変数に保存
			
			var info_select = new google.maps.InfoWindow({content: '選択された領域' + count_area, position: new google.maps.LatLng(latAvg, lngAvg), shouldFocus: true});//ウィンドウ
			info_select.open(map);//ウィンドウの表示
			
			sm.addEventListener('click', function(event){//農地登録終了のイベントリスナ
					areas.set(areaName_tb.value, areaLatLng); //農地登録終了後のイベントリスナで発火
					
					var areaContent = '<h1>登録された農地の情報</h1>'; //登録された農地の情報をHTMLにする
					areaContent += '<p>農地の名前：' + areaName_tb.value + '</p>';
					areaContent += '<p>管理者の名前：' + suName_tb.value + '</p>';
					areaContent += '<p>栽培中の作物：</p>';
					for(i=0; i<10; i++){
						if(products[i].value !== ''){
							areaContent += '<p>・' + products[i].value;
							if(products_name[i].value !== '') areaContent += '（ブランド名：' + products_name[i].value + '）</p>';
							else areaContent += '</p>';
						}
					}
					areaContent += '<p>土壌の種類：' + selecter.value + '</p>';
					areaContent += '<button id = "modify">登録内容を変更する</button>';
					areaContent += '<button id = "delete">この農地登録を削除する</button>';
					map.setCenter(areaLatLng);
					info_select.setContent(areaContent); //地図上の情報ウィンドウに登録した項目を表示
					
					tb.style.display = 'none';
					var modify = document.getElementById('modify');
					modify.addEventListener('click', function(event){
							tb.style.display = 'block';
					});
					var del =document.getElementById('delete');
					del.addEventListener('click', function(event){
							drawingManager.polygonOptions: {visible: false};
						});
					var map_loc = document.getElementById('map');
					var map_corner = map_loc.getBoundingClientRect();
					var map_position = map_corner.top;
					scrollTo(0, map_position);
				});
			
			count_area++;
	});
	
	map.addListener("click", function(event){//マップクリック時のマーカー描画
			var marker = new google.maps.Marker({
					position: event.latLng,
					map: map,
					title: "この農地に関する情報を表示"
			});
			
			marker.addListener('click', showInfo);//マーカークリック時のイベントリスナ
			count_marker++;
	});
	
	google.maps.event.addListener(markers, 'click', function(event){//マーカークリック時のイベントリスナ
			//コメント入力フォーム
			var tb = document.getElementById('comment');
			var title = document.createElement('h1');
			var cent1 = document.createElement('p');
			var txtArea = document.createElement('textarea');
			var sm = document.createElement('input');
			
			sm.type = 'submit';
			sm.value = 'この内容で登録する';
			
			title.textContent = '農地' + count_marker + 'にコメントを登録';
			cent1.textContent = '以下のフォームにコメントをお書きください．コメントはアカウント名と共に弊社のサーバに保存され，インターネットで公開されます．';
			txtArea.placeholder = 'n文字以内で入力';
			
			tb.appendChild(title);
			tb.appendChild(cent1);
			tb.appendChild(txtArea);
			tb.appendChild(sm);
	});
}

function showInfo(){
	var tb = document.getElementById('comment');
			var title = document.createElement('h1');
			var cent1 = document.createElement('p');
			var txtArea = document.createElement('textarea');
			var sm = document.createElement('button');
			
			title.textContent = '農地にコメントを登録';
			cent1.textContent = '以下のフォームにコメントをお書きください．コメントはアカウント名と共に弊社のサーバに保存され，インターネットで公開されます．';
			txtArea.placeholder = 'n文字以内で入力';
			sm.textContent = 'この内容で登録する';
			
			tb.appendChild(title);
			tb.appendChild(cent1);
			tb.appendChild(txtArea);
			tb.appendChild(sm);
}