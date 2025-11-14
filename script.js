const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5jGUplcM8sRYZ0iUr9MjOTU8Awr1GNlNyXe0gRjatPjplLgpiR4aG68ZxI4mBNQ9zQLynwU3tg7zZ/pub?gid=1319172131&single=true&output=csv";

async function carregarFiltros() {
    try {
        const resp = await fetch(urlCSV);
        const csvText = await resp.text();

        // Detecta separador ("," ou ";")
        const sep = csvText.includes(";") ? ";" : ",";
        const linhas = csvText.split("\n").map(l => l.split(sep));

        // Cabeçalho e corpo
        const cabecalho = linhas[0];
        const corpo = linhas.slice(1);

        console.log("Cabeçalho:", cabecalho);

        // Índices das colunas (A = 0, F = 5, AY depende do número de colunas)
        const idxCard = 0; // Coluna A
        const idxGrupo = 5; // Coluna F
        const idxGN = cabecalho.findIndex(h => h.trim().toLowerCase() === "gn"); // Busca GN pelo nome

        console.log(`Índice GN detectado: ${idxGN}`);

        // Extrai valores únicos
        const cards = [...new Set(corpo.map(l => l[idxCard].trim()).filter(v => v))];
        const grupos = [...new Set(corpo.map(l => l[idxGrupo].trim()).filter(v => v))];
        const gns = [...new Set(corpo.map(l => l[idxGN].trim()).filter(v => v))];

        // Preenche selects
        preencherSelect("filtroCard", cards);
        preencherSelect("filtroGN", gns);
        preencherSelect("filtroGrupo", grupos);

    } catch (error) {
        console.error("Erro ao carregar filtros:", error);
    }
}

function preencherSelect(id, valores) {
    const select = document.getElementById(id);
    select.innerHTML = "";
    valores.forEach(v => {
        const option = document.createElement("option");
        option.value = v;
        option.textContent = v;
        select.appendChild(option);
    });

    // Ativa Choices.js
    new Choices(select, {
        removeItemButton: true,
        searchEnabled: true,
        placeholder: true,
        placeholderValue: `Filtrar por ${id.replace("filtro", "")}`
    });
}

carregarFiltros();
