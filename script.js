let playersData = [];
let currentSort = { column: 'dorsal', order: 'asc' };

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
    playersData = [];

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.querySelectorAll("td");
        if (cells.length > 0) {
            // Logic mới để lấy giá trị từ cột AP (cột 94)
            let valueText = cells[94]?.innerText || '0';
            let value = 0;
            if (valueText.includes('M')) {
                value = parseFloat(valueText.replace('€', '').replace('M', ''));
            } else if (valueText.includes('K')) {
                value = parseFloat(valueText.replace('€', '').replace('K', '')) / 1000; // Chuyển K thành M
            }

            playersData.push({
                name: cells[1]?.innerText || 'N/A',
                position: cells[2]?.innerText || '',
                morale: cells[7]?.innerText || '-',
                matches: cells[9]?.innerText.split(' ')[0] || 0,
                goals: parseInt(cells[10]?.innerText) || 0,
                assists: parseInt(cells[11]?.innerText) || 0,
                workRate: parseInt(cells[13]?.innerText) || 0,
                technique: parseInt(cells[16]?.innerText) || 0,
                pace: parseInt(cells[27]?.innerText) || 0,
                personality: cells[60]?.innerText || '-',           // Cột 60: Personality
                nation: cells[62]?.innerText || '',
                dorsal: parseInt(cells[64]?.innerText) || 0,
                age: parseInt(cells[66]?.innerText) || 0,
                value: value,                                        // Lấy từ cột AP (94)
                avgRating: parseFloat(cells[72]?.innerText) || 0,
                ca: parseInt(cells[92]?.innerText) || 0,
                pa: parseInt(cells[93]?.innerText) || 0,
            });
        }
    }
    renderTable(playersData);
    updateSidebar(playersData);
}

// --- CÁC HÀM TIỆN ÍCH ---
const getCaColor = (value) => {
    if (value >= 180) return '#28a745'; // Elite
    if (value >= 160) return '#d4edda'; // Superb
    if (value >= 140) return '#cce5ff'; // Good
    if (value >= 120) return '#fff3cd'; // Average
    if (value > 0) return '#f8d7da';    // Below Average
    return '#f8f9fa';
};

const getAttributeColor = (value) => {
    if (value >= 18) return '#28a745';
    if (value >= 15) return '#d4edda';
    if (value >= 12) return '#cce5ff';
    if (value >= 10) return '#fff3cd';
    if (value > 0) return '#f8d7da';
    return '#f8f9fa';
};

const getStockingColor = (avgRating) => {
    if (avgRating >= 8.0) return '#198754';
    if (avgRating >= 7.5) return '#28a745';
    if (avgRating >= 7.0) return '#ffc107';
    if (avgRating > 0) return '#dc3545';
    return '#6c757d';
};

// Danh sách quốc gia mở rộng
const getCountryCode = (nation) => {
    const map = {"AFG":"af","ALB":"al","ALG":"dz","AND":"ad","ANG":"ao","ATG":"ag","ARG":"ar","ARM":"am","AUS":"au","AUT":"at","AZE":"az","BAH":"bs","BHR":"bh","BAN":"bd","BRB":"bb","BLR":"by","BEL":"be","BLZ":"bz","BEN":"bj","BTN":"bt","BOL":"bo","BIH":"ba","BOT":"bw","BRA":"br","BRU":"bn","BUL":"bg","BFA":"bf","BDI":"bi","CAM":"kh","CMR":"cm","CAN":"ca","CPV":"cv","CTA":"cf","CHA":"td","CHI":"cl","CHN":"cn","COL":"co","COM":"km","CGO":"cg","COD":"cd","CRC":"cr","CIV":"ci","CRO":"hr","CUB":"cu","CYP":"cy","CZE":"cz","DEN":"dk","DJI":"dj","DMA":"dm","DOM":"do","ECU":"ec","EGY":"eg","SLV":"sv","EQG":"gq","ERI":"er","EST":"ee","ETH":"et","FIJ":"fj","FIN":"fi","FRA":"fr","GAB":"ga","GAM":"gm","GEO":"ge","GER":"de","GHA":"gh","GRE":"gr","GRN":"gd","GUA":"gt","GUI":"gn","GNB":"gw","GUY":"gy","HAI":"ht","HON":"hn","HKG":"hk","HUN":"hu","ISL":"is","IND":"in","IDN":"id","IRN":"ir","IRQ":"iq","IRL":"ie","ISR":"il","ITA":"it","JAM":"jm","JPN":"jp","JOR":"jo","KAZ":"kz","KEN":"ke","PRK":"kp","KOR":"kr","KOS":"xk","KUW":"kw","KGZ":"kg","LAO":"la","LAT":"lv","LBN":"lb","LES":"ls","LBR":"lr","LBY":"ly","LIE":"li","LTU":"lt","LUX":"lu","MAC":"mo","MKD":"mk","MAD":"mg","MWI":"mw","MAS":"my","MDV":"mv","MLI":"ml","MLT":"mt","MTN":"mr","MRI":"mu","MEX":"mx","MDA":"md","MGL":"mn","MNE":"me","MAR":"ma","MOZ":"mz","MYA":"mm","NAM":"na","NEP":"np","NED":"nl","NCL":"nc","NZL":"nz","NCA":"ni","NIG":"ne","NGA":"ng","NOR":"no","OMA":"om","PAK":"pk","PLE":"ps","PAN":"pa","PNG":"pg","PAR":"py","PER":"pe","PHI":"ph","POL":"pl","POR":"pt","PUR":"pr","QAT":"qa","ROU":"ro","RUS":"ru","RWA":"rw","SKN":"kn","LCA":"lc","VIN":"vc","SAM":"ws","SMR":"sm","STP":"st","KSA":"sa","SEN":"sn","SRB":"rs","SEY":"sc","SLE":"sl","SGP":"sg","SVK":"sk","SVN":"si","SOL":"sb","SOM":"so","RSA":"za","ESP":"es","SRI":"lk","SUD":"sd","SSD":"ss","SUR":"sr","SWE":"se","SUI":"ch","SYR":"sy","TAH":"pf","TPE":"tw","TJK":"tj","TAN":"tz","THA":"th","TLS":"tl","TOG":"tg","TGA":"to","TRI":"tt","TUN":"tn","TUR":"tr","TKM":"tm","UGA":"ug","UKR":"ua","UAE":"ae","ENG":"gb-eng","SCO":"gb-sct","WAL":"gb-wls","NIR":"gb-nir","USA":"us","URU":"uy","UZB":"uz","VAN":"vu","VEN":"ve","VIE":"vn","YEM":"ye","ZAM":"zm","ZIM":"zw"};
    return map[nation] || "un";
};

// --- CÁC HÀM HIỂN THỊ ---
function renderTable(data) {
    const tableBody = document.getElementById("playerTable");
    if (!data || data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="13" class="text-center">Vui lòng tải file dữ liệu để xem thông tin.</td></tr>`;
        return;
    }

    tableBody.innerHTML = data.map(player => `
        <tr>
            <td>${player.dorsal || '-'}</td>
            <td>
                <div>
                    <img class="flag-icon" src="https://flagcdn.com/16x12/${getCountryCode(player.nation)}.png" alt="${player.nation}">
                    <span class="player-name">${player.name}</span>
                </div>
                <span class="player-position">${player.position}</span>
            </td>
            <td><span class="ca-box" style="background-color: ${getCaColor(player.ca)};">${player.ca}</span></td>
            <td>${player.age}</td>
            <td>${player.morale}</td>
            <td>${player.personality}</td>
            <td><span class="attribute-box" style="background-color: ${getAttributeColor(player.workRate)};">${player.workRate}</span></td>
            <td><span class="attribute-box" style="background-color: ${getAttributeColor(player.technique)};">${player.technique}</span></td>
            <td><span class="attribute-box" style="background-color: ${getAttributeColor(player.pace)};">${player.pace}</span></td>
            <td>${player.value > 0 ? `€${player.value.toFixed(1)}M` : 'N/A'}</td>
            <td>${player.matches}</td>
            <td>${player.goals} / ${player.assists}</td>
            <td><span class="stocking-box" style="background-color: ${getStockingColor(player.avgRating)};">${player.avgRating > 0 ? player.avgRating.toFixed(2) : '-'}</span></td>
        </tr>
    `).join('');
}

function updateSidebar(data) {
    if (!data || data.length === 0) {
        document.getElementById("topScorers").innerHTML = "";
        document.getElementById("topPlayers").innerHTML = "";
        return;
    }
    const topScorers = [...data].sort((a, b) => b.goals - a.goals).slice(0, 3);
    const scorersHtml = `
        <table class="sidebar-table">
            ${topScorers.map(p => `<tr><td>${p.name}</td><td class="text-end"><strong>${p.goals}</strong></td></tr>`).join('')}
        </table>`;
    document.getElementById("topScorers").innerHTML = scorersHtml;

    const topPlayers = [...data].sort((a, b) => b.ca - a.ca).slice(0, 3);
    const topPlayersHtml = `
         <table class="sidebar-table">
            ${topPlayers.map(p => `<tr><td>${p.name}</td><td><span class="rating-value">${p.ca}</span></td></tr>`).join('')}
        </table>`;
    document.getElementById("topPlayers").innerHTML = topPlayersHtml;
}

// --- SỰ KIỆN VÀ KHỞI TẠO ---
document.getElementById("filterInput").addEventListener("keyup", function(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredPlayers = playersData.filter(player => 
        player.name.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredPlayers);
});

window.sortTable = (column) => {
    if (playersData.length === 0) return;
    
    const order = (column === currentSort.column && currentSort.order === 'asc') ? 'desc' : 'asc';
    currentSort = { column, order };

    const sortedPlayers = [...playersData].sort((a, b) => {
        const valA = a[column];
        const valB = b[column];
        
        if (typeof valA === 'string') {
            return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
            if (valA < valB) return order === 'asc' ? -1 : 1;
            if (valA > valB) return order === 'asc' ? 1 : -1;
            return 0;
        }
    });
    
    renderTable(sortedPlayers);
};

renderTable([]);