const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5jGUplcM8sRYZ0iUr9MjOTU8Awr1GNlNyXe0gRjatPjplLgpiR4aG68ZxI4mBNQ9zQLynwU3tg7zZ/pub?gid=1319172131&single=true&output=csv";

// Função para normalizar cabeçalho
function normalizar(texto) {
    return texto.replace(/\[|\]/g, "").trim().toLowerCase();
}

async function carregarFiltros() {
    try {
        const resp = await fetch(urlCSV);
        const csvText = await resp.text();

        const sep = csvText.includes(";") ? ";" : ",";
        const linhas = csvText.split("\n").map(l => l.split(sep));

        const cabecalhoOriginal = linhas[0];
        const cabecalho = cabecalhoOriginal.map(h => normalizar(h));
        const corpo = linhas.slice(1);

        console.log("Cabeçalho normalizado:", cabecalho);

        // Busca índices pelo nome normalizado
        const idxCard = cabecalho.indexOf("controleic codigo_card");
        const idxGrupo = cabecalho.indexOf("grupo");
        const idxGN = cabecalho.indexOf("gn");

        console.log(`Índices detectados -> Card: ${idxCard}, Grupo: ${idxGrupo}, GN: ${idxGN}`);

        if (idxCard === -1 || idxGrupo === -1 || idxGN === -1) {
            console.error("Erro: não encontrou uma das colunas (Card, Grupo ou GN). Verifique cabeçalho.");
            return;
        }

        // Extrai valores únicos
        const cards = [...new Set(corpo.map(l => l[idxCard]?.trim()).filter(v => v))];
        const grupos = [...new Set(corpo.map(l => l[idxGrupo]?.trim()).filter(v => v))];
        const gns = [...new Set(corpo.map(l => l[idxGN]?.trim()).filter(v => v))];

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

    new Choices(select, {
        removeItemButton: true,
        searchEnabled: true,
        placeholder: true,
        placeholderValue: `Filtrar por ${id.replace("filtro", "")}`
    });
}

carregarFiltros();
