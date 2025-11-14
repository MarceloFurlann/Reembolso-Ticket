function processCSV(data) {
    const linhas = data.split("\n").map(l => l.split(","));
    const header = linhas[0].map(h => h.trim());

    // Mapeamento dinâmico
    const idxCard = header.indexOf("Card");
    const idxGN = header.indexOf("GN");
    const idxGrupo = header.indexOf("Grupo");

    console.log(`Índices detectados => Card: ${idxCard}, Grupo: ${idxGrupo}, GN: ${idxGN}`);

    // Validação
    if (idxCard === -1 || idxGN === -1 || idxGrupo === -1) {
        alert("Erro: não encontrou uma das colunas (Card, Grupo ou GN). Verifique cabeçalho do CSV.");
        return;
    }

    // Filtros (pegando valores dos selects)
    const filtroCard = document.getElementById("filtroCard").value.trim();
    const filtroGN = document.getElementById("filtroGN").value.trim();
    const filtroGrupo = document.getElementById("filtroGrupo").value.trim();

    // Filtragem
    const resultado = linhas.filter((linha, i) => {
        if (i === 0) return true; // mantém cabeçalho
        const matchCard = !filtroCard || linha[idxCard].trim() === filtroCard;
        const matchGN = !filtroGN || linha[idxGN].trim() === filtroGN;
        const matchGrupo = !filtroGrupo || linha[idxGrupo].trim() === filtroGrupo;
        return matchCard && matchGN && matchGrupo;
    });

    // Renderiza tabela
    renderTable(resultado);
}
