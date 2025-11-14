async function carregarDados() {
    const urlPrincipal = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQWOZDNQn8PUWZrAWjXX0W31mDgHWubFfxF9pTKRPOAZcGIuf-M4pOik8Kt6Kj3uEJD8zes1SMQP3ez/pub?gid=1498775002&single=true&output=csv";
    const urlBaixas = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTuI00U9cr-4BjVPW-AQuobUe6VXH-c-aUtEsbK5FLS2z4OGX8Ek363KMCUeywpfX3J_wYkA4bfY7be/pub?gid=1665327090&single=true&output=csv";

    const [dadosPrincipal, dadosBaixas] = await Promise.all([
        fetch(urlPrincipal).then(r => r.text()),
        fetch(urlBaixas).then(r => r.text())
    ]);

    processarTabela(dadosPrincipal, dadosBaixas);
}

function processarTabela(csvPrincipal, csvBaixas) {
    const linhasPrincipal = csvPrincipal.split("\n").map(l => l.split(","));
    const linhasBaixas = csvBaixas.split("\n").map(l => l.split(","));

    const headerPrincipal = linhasPrincipal[0].map(h => h.trim());
    const headerBaixas = linhasBaixas[0].map(h => h.trim());

    // Índices principais
    const idxCard = headerPrincipal.findIndex(h => h.toLowerCase() === "card");
    const idxGN = headerPrincipal.findIndex(h => h.toLowerCase() === "gn");
    const idxGrupo = headerPrincipal.findIndex(h => h.toLowerCase() === "grupo");
    const idxStatus = headerPrincipal.findIndex(h => h.toLowerCase() === "status");
    const idxProduto = headerPrincipal.findIndex(h => h.toLowerCase() === "produto");
    const idxDataInicio = headerPrincipal.findIndex(h => h.toLowerCase() === "data início");
    const idxDataFim = headerPrincipal.findIndex(h => h.toLowerCase() === "data fim");
    const idxSaldo = headerPrincipal.findIndex(h => h.toLowerCase() === "saldo");

    // Índices baixas
    const idxCardBaixas = headerBaixas.findIndex(h => h.toLowerCase() === "card");
    const idxValorBaixa = headerBaixas.findIndex(h => h.toLowerCase() === "valor baixa");

    const agrupado = {};

    // Agrupa dados principais
    for (let i = 1; i < linhasPrincipal.length; i++) {
        const linha = linhasPrincipal[i];
        const card = linha[idxCard]?.trim();
        if (!card) continue;

        if (!agrupado[card]) {
            agrupado[card] = {
                card,
                gn: linha[idxGN]?.trim(),
                grupo: linha[idxGrupo]?.trim(),
                status: linha[idxStatus]?.trim(),
                produto: linha[idxProduto]?.trim(),
                dataInicio: linha[idxDataInicio]?.trim(),
                dataFim: linha[idxDataFim]?.trim(),
                saldo: 0,
                baixas: 0
            };
        }
        agrupado[card].saldo += parseFloat(linha[idxSaldo]?.replace(",", ".") || 0);
    }

    // Soma baixas
    for (let i = 1; i < linhasBaixas.length; i++) {
        const linha = linhasBaixas[i];
        const card = linha[idxCardBaixas]?.trim();
        const valor = parseFloat(linha[idxValorBaixa]?.replace(",", ".") || 0);
        if (agrupado[card]) {
            agrupado[card].baixas += valor;
        }
    }

    // Calcula saldo final
    Object.values(agrupado).forEach(item => {
        item.saldoFinal = item.saldo - item.baixas;
    });

    renderTabela(Object.values(agrupado));
}

function renderTabela(dados) {
    const tabela = document.getElementById("resultado");
    tabela.innerHTML = `
        <tr>
            <th>Card</th><th>GN</th><th>Grupo</th><th>Status do Card</th>
            <th>Produto</th><th>Data Início</th><th>Data Fim</th>
            <th>Saldo</th><th>Baixas</th><th>Saldo Final</th>
        </tr>
    `;

    dados.forEach(item => {
        tabela.innerHTML += `
            <tr>
                <td>${item.card}</td>
                <td>${item.gn}</td>
                <td>${item.grupo}</td>
                <td>${item.status}</td>
                <td>${item.produto}</td>
                <td>${item.dataInicio}</td>
                <td>${item.dataFim}</td>
                <td>${item.saldo.toFixed(2)}</td>
                <td>${item.baixas.toFixed(2)}</td>
                <td>${item.saldoFinal.toFixed(2)}</td>
            </tr>
        `;
    });
}

carregarDados();
