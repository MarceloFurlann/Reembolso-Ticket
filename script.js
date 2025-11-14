const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRBdxutN5MnrzFXRQZqjmE23MEjXBYbiCsXGTYYMFAgpL3SCxeNzg5QScWVNqYA3UExGl_rvzAuDCrB/pub?gid=528293391&single=true&output=csv";

// Função para carregar dados do CSV
async function carregarFiltros() {
    try {
        const response = await fetch(urlCSV);
        const csvText = await response.text();

        // Detecta separador ("," ou ";")
        const sep = csvText.includes(";") ? ";" : ",";
        const linhas = csvText.split("\n").map(l => l.split(sep));

        // Cabeçalho e corpo
        const cabecalho = linhas[0];
        const corpo = linhas.slice(1);

        console.log("Cabeçalho:", cabecalho);

        // Colunas desejadas (A=0, E=4, G=6)
        const colCard = 0;
        const colGrupo = 4;
        const colGN = 6;

        // Extrair valores únicos
        const cards = [...new Set(corpo.map(l => l[colCard].trim()).filter(v => v))];
        const grupos = [...new Set(corpo.map(l => l[colGrupo].trim()).filter(v => v))];
        const gns = [...new Set(corpo.map(l => l[colGN].trim()).filter(v => v))];

        // Preencher selects
        preencherSelect("filtroCard", cards);
        preencherSelect("filtroGrupo", grupos);
        preencherSelect("filtroGN", gns);

    } catch (error) {
        console.error("Erro ao carregar CSV:", error);
    }
}

// Função para preencher um select com Choices.js
function preencherSelect(id, valores) {
    const select = document.getElementById(id);
    select.innerHTML = "";

    valores.forEach(v => {
        const option = document.createElement("option");
        option.value = v;
        option.textContent = v;
        select.appendChild(option);
    });

    new Choices(select, {
        removeItemButton: true,
        searchEnabled: true,
        placeholder: true,
        placeholderValue: `Filtrar por ${id.replace("filtro", "")}`
    });
}

// Chamar função ao carregar página
carregarFiltros();
