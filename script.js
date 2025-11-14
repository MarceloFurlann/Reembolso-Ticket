async function carregarCSV() {
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRBdxutN5MnrzFXRQZqjmE23MEjXBYbiCsXGTYYMFAgpL3SCxeNzg5QScWVNqYA3UExGl_rvzAuDCrB/pub?output=csv";

    try {
        const response = await fetch(url);
        const text = await response.text();
        processCSV(text);
    } catch (error) {
        console.error("Erro ao carregar CSV:", error);
    }
}

function processCSV(data) {
    const linhas = data.split("\n").map(l => l.split(","));
    const header = linhas[0].map(h => h.trim());

    console.log("Cabeçalho normalizado:", header);

    const idxCard = header.findIndex(h => h.toLowerCase() === "card");
    const idxGN = header.findIndex(h => h.toLowerCase() === "gn");
    const idxGrupo = header.findIndex(h => h.toLowerCase() === "grupo");

    console.log(`Índices detectados => Card: ${idxCard}, Grupo: ${idxGrupo}, GN: ${idxGN}`);

    if (idxCard === -1 || idxGN === -1 || idxGrupo === -1) {
        alert("Erro: não encontrou uma das colunas (Card, Grupo ou GN). Verifique cabeçalho do CSV.");
        return;
    }

    popularFiltros(linhas, idxCard, idxGN, idxGrupo);
    renderTable(linhas);
}

function popularFiltros(linhas, idxCard, idxGN, idxGrupo) {
    const cards = new Set();
    const gns = new Set();
    const grupos = new Set();

    for (let i = 1; i < linhas.length; i++) {
        cards.add(linhas[i][idxCard].trim());
        gns.add(linhas[i][idxGN].trim());
        grupos.add(linhas[i][idxGrupo].trim());
    }

    preencherSelect("filtroCard", cards);
    preencherSelect("filtroGN", gns);
    preencherSelect("filtroGrupo", grupos);
}

function preencherSelect(id, valores) {
    const select = document.getElementById(id);
    select.innerHTML = "<option value=''>Todos</option>";
    valores.forEach(v => {
        if (v) {
            const option = document.createElement("option");
            option.value = v;
            option.textContent = v;
            select.appendChild(option);
        }
    });
}

carregarCSV();
