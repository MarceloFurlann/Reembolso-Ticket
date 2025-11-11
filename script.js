const urlBase = "...";
const urlReport = "...";

let dadosAgrupados = [];

const camposBase = {
    Card: "controleIC[CODIGO_CARD]",
    GN: "GN",
    Grupo: "controleIC[GRUPO_CONSOLIDADOR]",
    Status: "controleIC[STATUS_CARD]",
    Produto: "controleIC[PRODUTO]",
    DataInicio: "controleIC[INICIO_VIGENCIA_IC]",
    DataFim: "controleIC[FIM_VIGENCIA_IC]",
    Saldo: "controleIC[SALDO_IC]"
};

const camposReport = {
    Card: "COD IC",
    ValorDesc: "Valor Desconto"
};

async function carregarTabela() {
    try {
        const baseResp = await fetch(urlBase);
        const baseData = await baseResp.text();
        const sepBase = baseData.includes(";") ? ";" : ",";
        const baseLinhas = baseData.split("\n").map(l => l.split(sepBase));
        const baseCabecalho = baseLinhas[0].map(h => h.trim());
        const baseCorpo = baseLinhas.slice(1);

        const reportResp = await fetch(urlReport);
        const reportData = await reportResp.text();
        const sepReport = reportData.includes(";") ? ";" : ",";
        const reportLinhas = reportData.split("\n").map(l => l.split(sepReport));
        const reportCabecalho = reportLinhas[0].map(h => h.trim());
        const reportCorpo = reportLinhas.slice(1);

        console.log("Cabeçalho Base:", baseCabecalho);
        console.log("Cabeçalho Report:", reportCabecalho);

        const idxBase = {};
        for (let key in camposBase) {
            idxBase[key] = baseCabecalho.indexOf(camposBase[key]);
            if (idxBase[key] === -1) console.error(`❌ Coluna '${camposBase[key]}' não encontrada no CSV base!`);
        }

        const idxReport = {};
        for (let key in camposReport) {
            idxReport[key] = reportCabecalho.indexOf(camposReport[key]);
            if (idxReport[key] === -1) console.error(`❌ Coluna '${camposReport[key]}' não encontrada no CSV report!`);
        }

        const agrupado = {};
        baseCorpo.forEach(linha => {
            const card = linha[idxBase.Card];
            if (!card) return;

            if (!agrupado[card]) {
                agrupado[card] = {
                    Card: card,
                    GN: linha[idxBase.GN] || "",
                    Grupo: linha[idxBase.Grupo] || "",
                    Status: linha[idxBase.Status] || "",
                    Produto: linha[idxBase.Produto] || "",
                    DataInicio: linha[idxBase.DataInicio] || "",
                    DataFim: linha[idxBase.DataFim] || "",
                    Saldo: 0,
                    Baixas: 0
                };
            }

            if (linha[idxBase.Saldo]) {
                const valor = parseFloat(linha[idxBase.Saldo].replace(",", "."));
                if (!isNaN(valor)) agrupado[card].Saldo += valor;
            }
        });

        reportCorpo.forEach(linha => {
            const cardReport = linha[idxReport.Card];
            if (!cardReport || !agrupado[cardReport]) return;

            const valorDesc = parseFloat((linha[idxReport.ValorDesc] || "0").replace(",", "."));
            if (!isNaN(valorDesc)) agrupado[cardReport].Baixas += valorDesc;
        });

        dadosAgrupados = Object.values(agrupado);
        console.log("✅ Dados agrupados:", dadosAgrupados);

        preencherFiltros(dadosAgrupados);
        montarTabela(dadosAgrupados);

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}
