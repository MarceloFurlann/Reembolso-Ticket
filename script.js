async function montarTabelaConsolidada() {
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

    const agrupado = {};

    // Agrupa dados principais
    for (let i = 1; i < linhasPrincipal.length; i++) {
        const linha = linhasPrincipal[i];
        const card = linha[0]?.trim(); // Coluna A
        if (!card) continue;

        if (!agrupado[card]) {
            agrupado[card] = {
                card,
                gn: linha[6]?.trim(),        // Coluna G
                grupo: linha[4]?.trim(),     // Coluna E
                status: linha[7]?.trim(),    // Coluna H
                produto: linha[5]?.trim(),   // Coluna F
                dataInicio: linha[9]?.trim(),// Coluna J
                dataFim: linha[10]?.trim(),  // Coluna K
                saldo: 0,
                baixas: 0
            };
        }
        agrupado[card].saldo += parseFloat(linha[3]?.replace(",", ".") || 0); // Coluna D
    }

    // Soma baixas (segunda planilha)
    for (let i = 1; i < linhasBaixas.length; i++) {
        const linha = linhasBaixas[i];
        const card = linha[4]?.trim(); // Coluna E
        const valor = parseFloat(linha[10]?.replace(",", ".") || 0); // Coluna K
        if (agrupado[card]) {
            agrupado[card].baixas += valor;
        }
    }

    // Calcula saldo final
    Object.values(agrupado).forEach(item => {
        item.saldoFinal = item.saldo - item.baixas;
    });

    renderTabelaConsolidada(Object.values(agrupado));
}

function renderTabelaConsolidada(dados) {
    const tabela = document.getElementById("tabelaConsolidada");
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

// Chame essa função para montar a tabela
montarTabelaConsolidada();
