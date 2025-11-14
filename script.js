<script>
async function montarTabelaConsolidada() {
    const urlPrincipal = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQWOZDNQn8PUWZrAWjXX0W31mDgHWubFfxF9pTKRPOAZcGIuf-M4pOik8Kt6Kj3uEJD8zes1SMQP3ez/pub?gid=1498775002&single=true&output=csv";
    const urlBaixas = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTuI00U9cr-4BjVPW-AQuobUe6VXH-c-aUtEsbK5FLS2z4OGX8Ek363KMCUeywpfX3J_wYkA4bfY7be/pub?gid=1665327090&single=true&output=csv";

    const [dadosPrincipal, dadosBaixas] = await Promise.all([
        fetch(urlPrincipal).then(r => r.text()),
        fetch(urlBaixas).then(r => r.text())
    ]);

    processarTabela(dadosPrincipal, dadosBaixas);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function processarTabela(csvPrincipal, csvBaixas) {
    const linhasPrincipal = csvPrincipal.split("\n").map(l => l.split(","));
    const linhasBaixas = csvBaixas.split("\n").map(l => l.split(","));

    const headersPrincipal = linhasPrincipal[0].map(h => h.trim());
    const headersBaixas = linhasBaixas[0].map(h => h.trim());

    const idxPrincipal = nome => headersPrincipal.indexOf(nome);
    const idxBaixas = nome => headersBaixas.indexOf(nome);

    const agrupado = {};

    for (let i = 1; i < linhasPrincipal.length; i++) {
        const linha = linhasPrincipal[i];
        const card = linha[idxPrincipal("COD IC")]?.trim();
        if (!card) continue;

        if (!agrupado[card]) {
            agrupado[card] = {
                Card: card,
                GN: linha[idxPrincipal("GN")] || "",
                Grupo: linha[idxPrincipal("Grupo")] || "",
                Produto: linha[idxPrincipal("Produto")] || "",
                Status: "",
                Inicio: "",
                Fim: "",
                Saldo: 0,
                Baixas: 0
            };
        }

        const valorNF = (linha[idxPrincipal("Valor da NF")] || "0").replace(/\./g, "").replace(",", ".");
        agrupado[card].Saldo += parseFloat(valorNF) || 0;
    }

    for (let i = 1; i < linhasBaixas.length; i++) {
        const linha = linhasBaixas[i];
        const card = linha[idxBaixas("Card")]?.trim();
        if (!card || !agrupado[card]) continue;

        agrupado[card].Status = linha[idxBaixas("Status")] || "";
        agrupado[card].Inicio = linha[idxBaixas("Inicio")] || "";
        agrupado[card].Fim = linha[idxBaixas("Fim")] || "";

        const valorBaixa = (linha[idxBaixas("Saldo")] || "0").replace(/\./g, "").replace(",", ".");
        agrupado[card].Baixas += parseFloat(valorBaixa) || 0;
    }

    Object.values(agrupado).forEach(item => {
        item.SaldoFinal = item.Saldo - item.Baixas;
    });

    renderTabelaConsolidada(Object.values(agrupado));
}

function renderTabelaConsolidada(dados) {
    const tbody = document.querySelector("#tabelaConsolidada tbody");
    tbody.innerHTML = "";

    dados.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.Card}</td>
                <td>${item.GN}</td>
                <td>${item.Grupo}</td>
                <td>${item.Status}</td>
                <td>${item.Produto}</td>
                <td>${item.Inicio}</td>
                <td>${item.Fim}</td>
                <td>${formatCurrency(item.Saldo)}</td>
                <td>${formatCurrency(item.Baixas)}</td>
                <td>${formatCurrency(item.SaldoFinal)}</td>
            </tr>
        `;
    });
}

montarTabelaConsolidada();
</script>
