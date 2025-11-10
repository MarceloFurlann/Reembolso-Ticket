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

        const cabecalho = linhas[0].map(h => h.trim());
        const corpo = linhas.slice(1);

        // Detecta índices pelo nome exato
        const idxCard = cabecalho.indexOf("controleIC[CODIGO_CARD]");
        const idxGrupo = cabecalho.indexOf("Grupo");
        const idxStatus = cabecalho.indexOf("controleIC[STATUS_CARD]");
        const idxProduto = cabecalho.indexOf("Produto");
        const idxDataIni = cabecalho.indexOf("controleIC[INICIO_VIGENCIA_IC]");
        const idxDataFim = cabecalho.indexOf("controleIC[FIM_VIGENCIA_IC]");
        const idxSaldo = cabecalho.indexOf("controleIC[SALDO_IC]");

        console.log("Índices detectados:", { idxCard, idxGrupo, idxStatus, idxProduto, idxDataIni, idxDataFim, idxSaldo });

        if (idxCard === -1) {
            console.error("Coluna 'controleIC[CODIGO_CARD]' não encontrada.");
            return;
        }

        const agrupado = {};

        corpo.forEach(linha => {
            const card = linha[idxCard];
            if (!card) return;

            if (!agrupado[card]) {
                agrupado[card] = {
                    Card: card,
                    Grupo: idxGrupo !== -1 ? linha[idxGrupo] : "",
                    Status: idxStatus !== -1 ? linha[idxStatus] : "",
                    Produto: idxProduto !== -1 ? linha[idxProduto] : "",
                    DataInicio: idxDataIni !== -1 ? linha[idxDataIni] : "",
                    DataFim: idxDataFim !== -1 ? linha[idxDataFim] : "",
                    Saldo: 0,
                    Baixas: 0
                };
            }

            if (idxSaldo !== -1 && linha[idxSaldo]) {
                const valor = parseFloat(linha[idxSaldo].replace(",", "."));
                if (!isNaN(valor)) agrupado[card].Saldo += valor;
            }
        });

        // Simulação de Baixas (depois vamos integrar com Report)
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
