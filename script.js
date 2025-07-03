let stats = [];
    let sortOrder = {};
    let radarChart;

    document.getElementById("fileInput").addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          parseHTML(e.target.result);
        };
        reader.readAsText(file);
      }
    });

    function parseHTML(html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const rows = doc.querySelectorAll("table tr");
      stats = [];

      rows.forEach((row, index) => {
        if (index === 0) return;
        const cells = row.querySelectorAll("td");
        if (cells.length > 0) {
          let valueRange = cells[68].innerText.match(/\d+/g);
          let avgValue = valueRange ? (parseInt(valueRange[0]) + parseInt(valueRange[1])) / 2 : parseInt(cells[68].innerText) || 0;
          stats.push({
            number: cells[64]?.innerText || '',
            name: cells[1]?.innerText || '',
            position: cells[2]?.innerText || '',
            nation: cells[62]?.innerText || '',
            age: parseInt(cells[66]?.innerText) || 0,
            value: avgValue,
            goals: parseInt(cells[10]?.innerText) || 0,
            assists: parseInt(cells[11]?.innerText) || 0,
            cards_Y: parseInt(cells[74]?.innerText) || 0,
            cards_R: parseInt(cells[75]?.innerText) || 0,
            rating: parseFloat(cells[72]?.innerText) || 0,
            minutes: parseInt(cells[92]?.innerText) || 0,
            homeGrown: cells[84]?.innerText || '',
            matches: parseInt(cells[9]?.innerText) || 0,
          });
        }
      });
      displayStats(stats);
      updateTops(stats);
      drawRadar(stats[0]);
    }

    function displayStats(data) {
      const tableBody = document.getElementById("playerTable");
      tableBody.innerHTML = data.map((player, i) => `
        <tr onclick="drawRadar(stats[${i}])">
          <td>${player.number}</td>
          <td><img class="flag-icon" src="https://flagcdn.com/16x12/${getCountryCode(player.nation)}.png" alt=""> ${player.name}</td>
          <td>${player.position}</td>
          <td>${player.nation}</td>
          <td>${player.age}</td>
          <td><span class="rating-box">€${player.value.toFixed(1)}</span></td>
          <td>${player.goals} / ${player.assists}</td>
          <td>${player.cards_Y}</td>
          <td>${player.cards_R}</td>
          <td>${player.rating.toFixed(2)}</td>
          <td>${player.minutes}</td>
          <td>${player.homeGrown}</td>
          <td>${player.matches}</td>
        </tr>
      `).join('');
    }

    function sortTable(column) {
      if (!sortOrder[column] || sortOrder[column] === 'desc') {
        stats.sort((a, b) => (a[column] > b[column]) ? 1 : -1);
        sortOrder[column] = 'asc';
      } else {
        stats.sort((a, b) => (a[column] < b[column]) ? 1 : -1);
        sortOrder[column] = 'desc';
      }
      displayStats(stats);
    }

    function updateTops(data) {
      const topGoals = [...data].sort((a, b) => b.goals - a.goals).slice(0, 3);
      const topAssists = [...data].sort((a, b) => b.assists - a.assists).slice(0, 3);
      const topMinutes = [...data].sort((a, b) => b.minutes - a.minutes).slice(0, 3);

      document.getElementById("topScorers").innerHTML = topGoals.map(p => `<li class='list-group-item'>${p.name}: ${p.goals} goals</li>`).join('');
      document.getElementById("topAssists").innerHTML = topAssists.map(p => `<li class='list-group-item'>${p.name}: ${p.assists} assists</li>`).join('');
      document.getElementById("topMinutes").innerHTML = topMinutes.map(p => `<li class='list-group-item'>${p.name}: ${p.minutes} minutes</li>`).join('');
    }

    function drawRadar(player) {
      const ctx = document.getElementById('radarChart').getContext('2d');
      const data = {
        labels: ['Goals', 'Assists', 'Rating', 'Minutes', 'Cards (Y)', 'Cards (R)'],
        datasets: [{
          label: player.name,
          data: [player.goals, player.assists, player.rating, player.minutes, player.cards_Y, player.cards_R],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2
        }]
      };
      if (radarChart) radarChart.destroy();
      radarChart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
          scales: {
            r: {
              suggestedMin: 0,
              suggestedMax: Math.max(20, player.minutes)
            }
          }
        }
      });
    }

    function getCountryCode(nation) {
      const map = {
        Để giúp bạn dễ đọc hơn, tôi đã dàn trải đoạn mã ra một cách gọn gàng, tránh việc xuống dòng quá nhiều:

Python

country_codes = {
    "FRA": "fr", "ENG": "gb", "POR": "pt", "Ecuador": "ec", "Senegal": "sn",
    "ARG": "ar", "ESP": "es", "GER": "de", "BRA": "br", "VIE": "vn",
    "JPN": "jp", "RUS": "ru", "USA": "us", "CAN": "ca", "MEX": "mx",
    "AUS": "au", "IND": "in", "CHN": "cn", "ITA": "it", "NED": "nl",
    "BEL": "be", "SWE": "se", "NOR": "no", "DEN": "dk", "FIN": "fi",
    "SUI": "ch", "AUT": "at", "POL": "pl", "GRE": "gr", "TUR": "tr",
    "EGY": "eg", "RSA": "za", "NGA": "ng", "KEN": "ke", "COL": "co",
    "CHI": "cl", "PER": "pe", "URU": "uy", "PAR": "py", "BOL": "bo",
    "VEN": "ve", "CUB": "cu", "JAM": "jm", "NZL": "nz", "PHI": "ph",
    "MYS": "my", "SGP": "sg", "THA": "th", "IDN": "id", "KOR": "kr",
    "PRK": "kp", "ISR": "il", "SAU": "sa", "UAE": "ae", "IRN": "ir",
    "IRQ": "iq", "PAK": "pk", "AFG": "af", "BGD": "bd", "NPL": "np",
    "LKA": "lk", "SYR": "sy", "LIB": "lb", "JOR": "jo", "TUN": "tn",
    "MAR": "ma", "ALG": "dz", "MOR": "ma", "GHA": "gh", "CIV": "ci",
    "CMR": "cm", "UGA": "ug", "TZA": "tz", "ETH": "et", "SOM": "so",
    "DRC": "cd", "SUD": "sd", "SSD": "ss", "ANG": "ao", "MOZ": "mz",
    "ZIM": "zw", "ZAM": "zm", "NAM": "na", "BOT": "bw", "MAD": "mg",
    "MLI": "ml", "NIG": "ne", "CHA": "td", "CAF": "cf", "COD": "cg",
    "GAB": "ga", "EQG": "gq", "BFA": "bf", "BEN": "bj", "TOG": "tg",
    "GMB": "gm", "GNB": "gw", "SLE": "sl", "LBR": "lr", "CPV": "cv",
    "STP": "st", "COM": "km", "SEY": "sc", "MRI": "mu", "MDV": "mv",
    "FJI": "fj", "PNG": "pg", "SLB": "sb", "VUT": "vu", "NCL": "nc",
    "PYF": "pf", "WSM": "ws", "TON": "to", "KIR": "ki", "TUV": "tv",
    "MHL": "mh", "FSM": "fm", "PLW": "pw", "NRU": "nr", "GRL": "gl",
    "ISL": "is", "FRO": "fo", "MLT": "mt", "CYP": "cy", "LUX": "lu",
    "MCO": "mc", "AND": "ad", "SMR": "sm", "VAT": "va", "LIE": "li",
    "BIH": "ba", "SRB": "rs", "HRV": "hr", "SVN": "si", "MKD": "mk",
    "MNE": "me", "ALB": "al", "KOS": "xk", "ROU": "ro", "BGR": "bg",
    "MDA": "md", "UKR": "ua", "BLR": "by", "LTU": "lt", "LVA": "lv",
    "EST": "ee", "GEO": "ge", "ARM": "am", "AZE": "az", "KAZ": "kz",
    "KGZ": "kg", "TJK": "tj", "TKM": "tm", "UZB": "uz", "MNG": "mn",
    "NEP": "np", "BTN": "bt", "LAO": "la", "KHM": "kh", "BRN": "bn",
    "TLS": "tl", "CCK": "cc", "CXR": "cx", "HMD": "hm", "NFK": "nf",
    "ATF": "tf", "BVT": "bv", "IOT": "io", "SGS": "gs", "SPM": "pm",
    "GLP": "gp", "MTQ": "mq", "GUF": "gf", "REU": "re", "MYT": "yt",
    "BLM": "bl", "MAF": "mf", "FLK": "fk", "AIA": "ai", "BMU": "bm",
    "BES": "bq", "CYM": "ky", "CUW": "cw", "DMA": "dm", "DOM": "do",
    "GRD": "gd", "HND": "hn", "HTI": "ht", "KNA": "kn", "LCA": "lc",
    "MSR": "ms", "NIC": "ni", "PAN": "pa", "PRI": "pr", "SXM": "sx",
    "TCA": "tc", "TTO": "tt", "VCT": "vc", "VGB": "vg", "VIR": "vi",
    "ABW": "aw", "BHS": "bs", "BRB": "bb", "CRI": "cr", "ATG": "ag",
    "BLZ": "bz", "GTM": "gt", "SLV": "sv"
      };
      return map[nation] || "un";
    }