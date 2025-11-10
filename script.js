const urlBase = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZb-Tj3DNnazVCv0IdZmkNycSkHDsmx4j5z4GwoABBho_xbGzjWzsOLDdZnWLdz06JEXaL-mG6ovUw/pub?gid=1131797479&single=true&output=csv";
const urlReport = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZb-Tj3DNnazVCv0IdZmkNycSkHDsmx4j5z4GwoABBho_xbGzjWzsOLDdZnWLdz06JEXaL-mG6ovUw/pub?gid=359149770&single=true&output=csv";

async function carregarTabela() {
    try {
        // Carrega Base
        const baseResp = await fetch(urlBase);
        const baseData = await baseResp.text();
        const baseLinhas = baseData.split("\n").map(l => l.split(","));
        const baseCabecalho = baseLinhas[0].map(h => h.trim());
        const baseCorpo = baseLinhas.slice(1);

        // Carrega Report
        const reportResp = await fetch(urlReport);
        const reportData = await reportResp.text();
        const reportLinhas = reportData.split("\n").map(l => l.split(","));
        const reportCabecalho = reportLinhas[0].map(h => h.trim());
        const reportCorpo = reportLinhas.slice(1);

        // Índices exatos
        const idxCard = baseCabecalho.indexOf("controleIC[CODIGO_CARD]");
        const idxGrupo = baseCabecalho.indexOf("Grupo");
        const idxStatus = baseCabecalho.indexOf("controleIC[STATUS_CARD]");
        const idxProduto = baseCabecalho.indexOf("Produto");
        const idxDataIni = baseCabecalho.indexOf("controleIC[INICIO_VIGENCIA_IC]");
        const idxDataFim = baseCabecalho.indexOf("controleIC[FIM_VIGENCIA_IC]");
        const idxSaldo = baseCabecalho.indexOf("controleIC[SALDO_IC]");

        const idxReportCard = reportCabecalho.indexOf("COD IC");
        const idxValorDesc = reportCabecalho.indexOf("Valor Desconto");

        console.log("Índices Base:", { idxCard, idxGrupo, idxStatus, idxProduto, idxDataIni, idxDataFim, idxSaldo });
        console.log("Índices Report:", { idxReportCard, idxValorDesc });

        if (idxCard === -1 || idxSaldo === -1) {
            console.error("Colunas essenciais não encontradas. Verifique o cabeçalho.");
            return;
        }

        const agrupado = {};

        // Processa Base
        baseCorpo.forEach(linha => {
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

            if (linha[idxSaldo]) {
                const valor = parseFloat(linha[idxSaldo].replace(",", "."));
                if (!isNaN(valor)) agrupado[card].Saldo += valor;
            }
        });

        // Calcula Baixas com Report
        reportCorpo.forEach(linha => {
            const cardReport = linha[idxReportCard];
            if (!cardReport || !agrupado[cardReport]) return;

            const valorDesc = parseFloat((linha[idxValorDesc] || "0").replace(",", "."));
            if (!isNaN(valorDesc)) agrupado[cardReport].Baixas += valorDesc;
        });

        // Monta tabela
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
