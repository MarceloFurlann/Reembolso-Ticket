const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZb-Tj3DNnazVCv0IdZmkNycSkHDsmx4j5z4GwoABBho_xbGzjWzsOLDdZnWLdz06JEXaL-mG6ovUw/pub?output=csv";

async function carregarTabela() {
    try {
        const response = await fetch(urlCSV);
        const data = await response.text();
        const linhas = data.split("\n").map(l => l.split(","));

        if (linhas.length < 2) {
            console.error("Nenhum dado encontrado.");
            return;
        }

        const cabecalho = linhas[0];
        const corpo = linhas.slice(1);

        // Descobre índices pelo nome
        const idxCard = cabecalho.indexOf("Card");
        const idxGrupo = cabecalho.indexOf("Grupo");
        const idxStatus = cabecalho.indexOf("Status do Card");
        const idxProduto = cabecalho.indexOf("Produto");
        const idxDataIni = cabecalho.indexOf("Data Início");
        const idxDataFim = cabecalho.indexOf("Data Fim");
        const idxSaldo = cabecalho.indexOf("Saldo");

        console.log("Índices detectados:", { idxCard, idxGrupo, idxStatus, idxProduto, idxDataIni, idxDataFim, idxSaldo });

        const agrupado = {};

        corpo.forEach(linha => {
            const card = linha[idxCard];
            if (!card) return;

            if (!agrupado[card]) {
                agrupado[card] = {
                    Card: card,
                    Grupo: linha[idxGrupo] || "",
                    Status: linha[idxStatus] || "",
                    Produto: linha[idxProduto] || "",
                    DataInicio: linha[idxDataIni] || "",
                    DataFim: linha[idxDataFim] || "",
                    Saldo: 0,
                    Baixas: 0
                };
            }

            const valor = parseFloat((linha[idxSaldo] || "0").replace(",", "."));
            if (!isNaN(valor)) agrupado[card].Saldo += valor;
        });

        // Simulação de Baixas
        for (let card in agrupado) {
            agrupado[card].Baixas = agrupado[card].Saldo * 0.1;
        }

        const tabela = document.querySelector("#tabela1 tbody");
        tabela.innerHTML = "";

        Object.values(agrupado).forEach(item => {
            const saldoFinal = item.Saldo - item.Baixas;
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.Card}</td>
                <td>${item.Grupo}</td>
                <td>${item.Status}</td>
                <td>${item.Produto}</td>
                <td>${item.DataInicio}</td>
                <td>${item.DataFim}</td>
                <td>R$ ${item.Saldo.toLocaleString("pt-BR")}</td>
                <td>R$ ${item.Baixas.toLocaleString("pt-BR")}</td>
                <td>R$ ${saldoFinal.toLocaleString("pt-BR")}</td>
            `;
            tabela.appendChild(tr);
        });

        console.log("Tabela preenchida com", Object.keys(agrupado).length, "Cards");

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

carregarTabela();
