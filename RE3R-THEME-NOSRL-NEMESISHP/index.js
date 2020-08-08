const JSON_ADDRESS = "127.0.0.1";
const JSON_PORT = 7190;
const POLLING_RATE = 333;

const JSON_ENDPOINT = `http://${JSON_ADDRESS}:${JSON_PORT}/`;

window.onload = function () {
	getData();
	setInterval(getData, POLLING_RATE);
};

var Asc = function (a, b) {
	if (a > b) return +1;
	if (a < b) return -1;
	return 0;
};

var Desc = function (a, b) {
	if (a > b) return -1;
	if (a < b) return +1;
	return 0;
};

function getData() {
	fetch(JSON_ENDPOINT)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			appendData(data);
		})
		.catch(function (err) {
			console.log("Error: " + err);
		});
}

function appendData(data) {
	var mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML = "";

	//Toxic
	if (data.PlayerPoisoned)
		mainContainer.innerHTML += `<img src="img/POISON.gif"/><div id="currenthp">HP: <font size="4" color="#7851a9">${data.PlayerCurrentHealth}</div></font>`;
	//Fine
	else if (data.PlayerCurrentHealth <= 1200 && data.PlayerCurrentHealth >= 801)
		mainContainer.innerHTML += `<img src="img/FINE.gif"/><div id="currenthp">HP: <font size="4" color="#7cfc00">${data.PlayerCurrentHealth}</div></font>`;
	//Caution!
	else if (data.PlayerCurrentHealth <= 800 && data.PlayerCurrentHealth >= 361)
		mainContainer.innerHTML += `<img src="img/CAUTION-YELLOW.gif"/><div id="currenthp">HP: <font size="4" color="#daa520">${data.PlayerCurrentHealth}</div></font>`;
	//Dangerops!
	else if (data.PlayerCurrentHealth <= 360 && data.PlayerCurrentHealth >= 1)
		mainContainer.innerHTML += `<img src="img/DANGER.gif"/><div id="currenthp">HP: <font size="4" color="#ff0000">${data.PlayerCurrentHealth}</div></font>`;
	//Default
	else
		mainContainer.innerHTML += `<img src="img/EMPTY.gif"/><div id="currenthp">HP: <font size="4" color="#ff0000">${data.PlayerCurrentHealth}</div></font>`;

	mainContainer.innerHTML += `<div id="deaths">Death Count: ${data.PlayerDeathCount}</div>`;

	mainContainer.innerHTML += `<div id="rank">Rank: ${data.ScoreName}</div>`;

	mainContainer.innerHTML += `<div id="difficulty">Difficulty: ${data.DifficultyName}</div>`;

	mainContainer.innerHTML += `<div id="darank">DA Rank: ${data.Rank}</div>`;

	mainContainer.innerHTML += `<div id="score">DA Score: ${Math.floor(data.RankScore)}</div>`;

	var table = document.createElement("table");
	data.EnemyHealth.sort(function (a, b) {
		return Asc(a.Percentage, b.Percentage) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		if (item.IsAlive) {
			if (item.MaximumHP >= 7500 && item.MaximumHP <= 20000) {
				table.innerHTML += `<tr><td><div class="enemyhp"><div class="enemyhpbar" style="width:${parseFloat(item.Percentage * 100).toFixed(1)}%">
			<div id="currentenemyhp">Nemesis ${item.CurrentHP}</div><div id="percentenemyhp">${parseFloat(item.Percentage * 100).toFixed(1)}%</div></div></div></td></tr>`;
			}
		}
	});
	mainContainer.appendChild(table);
}