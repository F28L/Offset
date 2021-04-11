var testScenario = function() {
	this.summary = {
			trav: 22647,
			gcd: 163434,
			co2: 3663456,
			eff: 92.6,
			kgs: 8730,
			cbm: 425
		},
		this.legs = [{
			from: 'Beijing',
			to: 'Miami',
			mode: '',
			co2: 5200,
			trav: 16056,
			gcd: 10139,
			eff: 14.6
		}, {
			from: 'Beijing',
			to: 'Miami',
			co2: 5200,
			trav: 16056,
			gcd: 10139,
			eff: 14.6
		}, {
			from: 'Beijing',
			to: 'Miami',
			co2: 5200,
			trav: 16056,
			gcd: 10139,
			eff: 14.6
		}, {
			from: 'Beijing',
			to: 'Miami',
			co2: 5200,
			trav: 16056,
			gcd: 10139,
			eff: 14.6
		}, {
			from: 'Beijing',
			to: 'Miami',
			co2: 5200,
			trav: 16056,
			gcd: 10139,
			eff: 14.6
		}]
};

var testRoute = {
	"type": "FeatureCollection",
	"crs": {
		"type": "name",
		"properties": {
			"name": "urn:ogc:def:crs:OGC:1.3:CRS84"
		}
	},
	"features": [{
		"_id": "54f9521ef4345dbc2f80c2f7",
		"type": "Feature",
		"properties": {
			"From Node0": 201224,
			"Route Freq": 6128,
			"Impedence0": 23.05,
			"Name0": null,
			"To Node0": 201238,
			"Length0": 0.351
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					114.1000137,
					21.69998932
				],
				[
					114.4173737,
					21.84881973
				]
			]
		},
		"reverse": true,
		"id": 23998
	}, {
		"_id": "54f6dc1db24a676b3f5feac9",
		"type": "Feature",
		"properties": {
			"From Node0": 201238,
			"Route Freq": 20,
			"Impedence0": 707.4,
			"Name0": null,
			"To Node0": 202608,
			"Length0": 10.308
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					114.1000137,
					21.69998932
				],
				[
					112.0494766,
					16.96088028
				],
				[
					110.1000214,
					12.19997978
				]
			]
		},
		"id": 18913
	}, {
		"_id": "54f6dc1db24a676b3f5feb43",
		"type": "Feature",
		"properties": {
			"From Node0": 202608,
			"Route Freq": 21,
			"Impedence0": 738.6,
			"Name0": null,
			"To Node0": 202773,
			"Length0": 10.719
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					110.1000214,
					12.19997978
				],
				[
					107.3207092,
					7.609139919
				],
				[
					104.5999908,
					3
				]
			]
		},
		"id": 19035
	}, {
		"_id": "54f6dc1db24a676b3f5fea5c",
		"type": "Feature",
		"properties": {
			"From Node0": 202773,
			"Route Freq": 3201786,
			"Impedence0": 148.3,
			"Name0": null,
			"To Node0": 202790,
			"Length0": 2.147
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					104.5999908,
					3
				],
				[
					103.6000137,
					1.100000024
				]
			]
		},
		"id": 18804
	}, {
		"_id": "54f6dc1db24a676b3f5fea8d",
		"type": "Feature",
		"properties": {
			"From Node0": 202790,
			"Route Freq": 3,
			"Impedence0": 126.8,
			"Name0": null,
			"To Node0": 202777,
			"Length0": 1.836
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					103.6000137,
					1.100000024
				],
				[
					102,
					2.000010014
				]
			]
		},
		"id": 18853
	}, {
		"_id": "54f6dc1db24a676b3f5fea86",
		"type": "Feature",
		"properties": {
			"From Node0": 202777,
			"Route Freq": 3,
			"Impedence0": 127.3,
			"Name0": null,
			"To Node0": 202771,
			"Length0": 1.844
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					102,
					2.000010014
				],
				[
					100.6000137,
					3.199990034
				]
			]
		},
		"id": 18846
	}, {
		"_id": "54f6dc1db24a676b3f5fea84",
		"type": "Feature",
		"properties": {
			"From Node0": 202771,
			"Route Freq": 10,
			"Impedence0": 360.9,
			"Name0": null,
			"To Node0": 202714,
			"Length0": 5.235
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					100.6000137,
					3.199990034
				],
				[
					97,
					6.999989986
				]
			]
		},
		"id": 18844
	}, {
		"_id": "54f6dc1db24a676b3f5fea6d",
		"type": "Feature",
		"properties": {
			"From Node0": 202714,
			"Route Freq": 5025402,
			"Impedence0": 206.8,
			"Name0": null,
			"To Node0": 202721,
			"Length0": 3.015
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					97,
					6.999989986
				],
				[
					94.00003052,
					6.699989796
				]
			]
		},
		"id": 18821
	}, {
		"_id": "54f9521ef4345dbc2f80c3de",
		"type": "Feature",
		"properties": {
			"From Node0": 202721,
			"Route Freq": 8,
			"Impedence0": 275.26,
			"Name0": null,
			"To Node0": 202727,
			"Length0": 4.007
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					90,
					6.466380119
				],
				[
					94.00003052,
					6.699989796
				]
			]
		},
		"reverse": true,
		"id": 24229
	}, {
		"_id": "54f9521ef4345dbc2f80c328",
		"type": "Feature",
		"properties": {
			"From Node0": 202727,
			"Route Freq": 0,
			"Impedence0": 0,
			"Name0": null,
			"To Node0": 202725,
			"Length0": 0
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					90.00006104,
					6.466549873
				],
				[
					90,
					6.466380119
				]
			]
		},
		"reverse": true,
		"id": 24047
	}, {
		"_id": "54f9521ef4345dbc2f80c3dd",
		"type": "Feature",
		"properties": {
			"From Node0": 202725,
			"Route Freq": 283420,
			"Impedence0": 558.2,
			"Name0": null,
			"To Node0": 202740,
			"Length0": 8.12
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					81.89998627,
					5.899970055
				],
				[
					85.94792938,
					6.198349953
				],
				[
					90.00006104,
					6.466549873
				]
			]
		},
		"reverse": true,
		"id": 24228
	}, {
		"_id": "54f6dc1db24a676b3f5fe89c",
		"type": "Feature",
		"properties": {
			"From Node0": 202740,
			"Route Freq": 3,
			"Impedence0": 123.9,
			"Name0": null,
			"To Node0": 202742,
			"Length0": 1.803
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					81.89998627,
					5.899970055
				],
				[
					80.09999847,
					5.799990177
				]
			]
		},
		"id": 18356
	}, {
		"_id": "54f9521ef4345dbc2f80c291",
		"type": "Feature",
		"properties": {
			"From Node0": 202742,
			"Route Freq": 116021,
			"Impedence0": 467.31,
			"Name0": null,
			"To Node0": 202704,
			"Length0": 6.645
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					73.70467377,
					7.606029987
				],
				[
					80.09999847,
					5.799990177
				]
			]
		},
		"reverse": true,
		"id": 23896
	}, {
		"_id": "54f9521ef4345dbc2f80c290",
		"type": "Feature",
		"properties": {
			"From Node0": 202704,
			"Route Freq": 46,
			"Impedence0": 1596.12,
			"Name0": null,
			"To Node0": 202589,
			"Length0": 23.337
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					51,
					13.00000954
				],
				[
					73.70467377,
					7.606029987
				]
			]
		},
		"reverse": true,
		"id": 23895
	}, {
		"_id": "54f6dc1db24a676b3f5fea08",
		"type": "Feature",
		"properties": {
			"From Node0": 202589,
			"Route Freq": 12,
			"Impedence0": 410.6,
			"Name0": null,
			"To Node0": 202620,
			"Length0": 6.083
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					51,
					13.00000954
				],
				[
					45,
					11.99997044
				]
			]
		},
		"id": 18720
	}, {
		"_id": "54f6dc1db24a676b3f5fea0d",
		"type": "Feature",
		"properties": {
			"From Node0": 202620,
			"Route Freq": 3,
			"Impedence0": 124.5,
			"Name0": null,
			"To Node0": 202598,
			"Length0": 1.838
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					45,
					11.99997044
				],
				[
					43.29999924,
					12.69999027
				]
			]
		},
		"id": 18725
	}, {
		"_id": "54f6dc1db24a676b3f5fea10",
		"type": "Feature",
		"properties": {
			"From Node0": 202598,
			"Route Freq": 5,
			"Impedence0": 181.3,
			"Name0": null,
			"To Node0": 202535,
			"Length0": 2.642
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					43.29999924,
					12.69999027
				],
				[
					42,
					14.99997997
				]
			]
		},
		"id": 18728
	}, {
		"_id": "54f6dc1db24a676b3f5fea12",
		"type": "Feature",
		"properties": {
			"From Node0": 202535,
			"Route Freq": 4961221,
			"Impedence0": 104.4,
			"Name0": null,
			"To Node0": 202498,
			"Length0": 1.526
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					42,
					14.99997997
				],
				[
					41.20000076,
					16.2999897
				]
			]
		},
		"id": 18730
	}, {
		"_id": "54f6dc1db24a676b3f5fea14",
		"type": "Feature",
		"properties": {
			"From Node0": 202498,
			"Route Freq": 87457,
			"Impedence0": 342.4,
			"Name0": null,
			"To Node0": 201799,
			"Length0": 5.009
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					41.20000076,
					16.2999897
				],
				[
					38.90000916,
					20.74999046
				]
			]
		},
		"id": 18732
	}, {
		"_id": "54f6dc1db24a676b3f5fdd0d",
		"type": "Feature",
		"properties": {
			"From Node0": 201799,
			"Route Freq": 11135113,
			"Impedence0": 231.4,
			"Name0": null,
			"To Node0": 201055,
			"Length0": 3.425
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					38.90000916,
					20.74999046
				],
				[
					37,
					23.59999084
				]
			]
		},
		"id": 15397
	}, {
		"_id": "54f6dc1db24a676b3f5fdd7e",
		"type": "Feature",
		"properties": {
			"From Node0": 201055,
			"Route Freq": 8,
			"Impedence0": 282.1,
			"Name0": null,
			"To Node0": 198758,
			"Length0": 4.22
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					37,
					23.59999084
				],
				[
					34.5,
					26.99998093
				]
			]
		},
		"id": 15510
	}, {
		"_id": "54f6dc1db24a676b3f5fdd81",
		"type": "Feature",
		"properties": {
			"From Node0": 198758,
			"Route Freq": 3791546,
			"Impedence0": 77.3,
			"Name0": null,
			"To Node0": 196985,
			"Length0": 1.172
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					34.5,
					26.99998093
				],
				[
					33.75001144,
					27.89998055
				]
			]
		},
		"id": 15513
	}, {
		"_id": "54f6dc1db24a676b3f5fdd83",
		"type": "Feature",
		"properties": {
			"From Node0": 196985,
			"Route Freq": 6910190,
			"Impedence0": 142.5,
			"Name0": null,
			"To Node0": 192099,
			"Length0": 2.136
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					33.75001144,
					27.89998055
				],
				[
					32.59999847,
					29.70000076
				]
			]
		},
		"id": 15515
	}, {
		"_id": "54f6dc1db24a676b3f5fe87f",
		"type": "Feature",
		"properties": {
			"From Node0": 192099,
			"Route Freq": 2,
			"Impedence0": 90.1,
			"Name0": null,
			"To Node0": 182536,
			"Length0": 1.323
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					32.59999847,
					29.70000076
				],
				[
					32.16669846,
					30.95000076
				]
			]
		},
		"id": 18327
	}, {
		"_id": "54f6dc1db24a676b3f5fe887",
		"type": "Feature",
		"properties": {
			"From Node0": 182536,
			"Route Freq": 161755,
			"Impedence0": 3.5,
			"Name0": null,
			"To Node0": 182391,
			"Length0": 0.05
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					32.16669846,
					30.95000076
				],
				[
					32.16669083,
					30.99999046
				]
			]
		},
		"id": 18335
	}, {
		"_id": "54f6dc1db24a676b3f5fe888",
		"type": "Feature",
		"properties": {
			"From Node0": 182391,
			"Route Freq": 1,
			"Impedence0": 48.5,
			"Name0": null,
			"To Node0": 179044,
			"Length0": 0.703
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					32.16669083,
					30.99999046
				],
				[
					32.09999084,
					31.69998932
				]
			]
		},
		"id": 18336
	}, {
		"_id": "54f6dc1db24a676b3f5fe35d",
		"type": "Feature",
		"properties": {
			"From Node0": 179044,
			"Route Freq": 4,
			"Impedence0": 124.1,
			"Name0": null,
			"To Node0": 177994,
			"Length0": 2.11
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[
					32.09999084,
					31.69998932
				],
				[
					34.20000076,
					31.89998055
				]
			]
		},
		"id": 17013
	}]
};
