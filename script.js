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

    function formatDate(value) {
        if (!value || value.trim() === "") return "";
        const clean = value.replace(/[^0-9]/g, "");
        if (clean.length === 8) {
            return `${clean.slice(0,2)}/${clean.slice(2,4)}/${clean.slice(4)}`;
        }
        return value;
    }

    function processarTabela(csvPrincipal, csvBaixas) {
        const linhasPrincipal = csvPrincipal.split("\n").map(l => l.split(","));
        const linhasBaixas = csvBaixas.split("\n").map(l => l.split(","));

        const agrupado = {};

        for (let i = 1; i < linhasPrincipal.length; i++) {
            const linha = linhasPrincipal[i];
            const card = linha[0]?.trim();
            if (!card) continue;

            if (!agrupado[card]) {
                agrupado[card] = {
                    card,
                    gn: linha[6]?.trim() || "",
                    grupo: linha[4]?.trim() || "",
                    status: linha[7]?.trim() || "",
                    produto: linha[5]?.trim() || "",
                    dataInicio: formatDate(linha[9]?.trim() || ""),
                    dataFim: formatDate(linha[10]?.trim() || ""),
                    saldo: 0,
                    baixas: 0
                };
            }
            agrupado[card].saldo += parseFloat(linha[3]?.replace(",", ".") || 0);
        }

        for (let i = 1; i < linhasBaixas.length; i++) {
            const linha = linhasBaixas[i];
            const card = linha[4]?.trim();
            const valor = parseFloat(linha[10]?.replace(",", ".") || 0);
            if (agrupado[card]) {
                agrupado[card].baixas += valor;
            }
        }

        Object.values(agrupado).forEach(item => {
            item.saldoFinal = item.saldo - item.baixas;
        });

        renderTabelaConsolidada(Object.values(agrupado));
    }

    function renderTabelaConsolidada(dados) {
        const tbody = document.querySelector("#tabelaConsolidada tbody");
        tbody.innerHTML = "";

        dados.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.card}</td>
                    <td>${item.gn}</td>
                    <td>${item.grupo}</td>
                    <td>${item.status}</td>
                    <td>${item.produto}</td>
                    <td>${item.dataInicio}</td>
                    <td>${item.dataFim}</td>
                    <td>${formatCurrency(item.saldo)}</td>
                    <td>${formatCurrency(item.baixas)}</td>
                    <td>${formatCurrency(item.saldoFinal)}</td>
                </tr>
            `;
        });
    }

    montarTabelaConsolidada();
</script>
