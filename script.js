const urlBase = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZb-Tj3DNnazVCv0IdZmkNycSkHDsmx4j5z4GwoABBho_xbGzjWzsOLDdZnWLdz06JEXaL-mG6ovUw/pub?gid=1131797479&single=true&output=csv";
const urlReport = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZb-Tj3DNnazVCv0IdZmkNycSkHDsmx4j5z4GwoABBho_xbGzjWzsOLDdZnWLdz06JEXaL-mG6ovUw/pub?gid=359149770&single=true&output=csv";

let dadosAgrupados = [];

async function carregarTabela() {
    try {
        const baseResp = await fetch(urlBase);
        const baseData = await baseResp.text();
        const baseLinhas = baseData.split("\n").map(l => l.split(","));
        const baseCabecalho = baseLinhas[0].map(h => h.trim());
        const baseCorpo = baseLinhas.slice(1);

        const reportResp = await fetch(urlReport);
        const reportData = await reportResp.text();
        const reportLinhas = reportData.split("\n").map(l => l.split(","));
        const reportCabecalho = reportLinhas[0].map(h => h.trim());
        const reportCorpo = reportLinhas.slice(1);

        // Buscar índices pelo nome da coluna
        const idxCard    = baseCabecalho.indexOf("Card");
        const idxGN      = baseCabecalho.indexOf("GN");
        const idxGrupo   = baseCabecalho.indexOf("Grupo");
        const idxStatus  = baseCabecalho.indexOf("Status");
        const idxProduto = baseCabecalho.indexOf("Produto");
        const idxDataIni = baseCabecalho.indexOf("Data Início");
        const idxDataFim = baseCabecalho.indexOf("Data Fim");
        const idxSaldo   = baseCabecalho.indexOf("Saldo");

        // Report
        const idxReportCard = reportCabecalho.indexOf("COD IC");
        const idxValorDesc  = reportCabecalho.indexOf("Valor Desconto");

        const agrupado = {};

        baseCorpo.forEach(linha => {
            const card = linha[idxCard];
            if (!card) return;

            if (!agrupado[card]) {
                agrupado[card] = {
                    Card: card,
                    GN: linha[idxGN] || "",
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

        reportCorpo.forEach(linha => {
            const cardReport = linha[idxReportCard];
            if (!cardReport || !agrupado[cardReport]) return;

            const valorDesc = parseFloat((linha[idxValorDesc] || "0").replace(",", "."));
            if (!isNaN(valorDesc)) agrupado[cardReport].Baixas += valorDesc;
        });

        dadosAgrupados = Object.values(agrupado);
        preencherFiltros(dadosAgrupados);
        montarTabela(dadosAgrupados);

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

function montarTabela(dados) {
    const tabela = document.querySelector("#tabela1 tbody");
    tabela.innerHTML = "";

    dados.forEach(item => {
        const saldoFinal = item.Saldo - item.Baixas;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.Card}</td>
            <td>${item.GN}</td>
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
}

function preencherFiltros(dados) {
    const cards = [...new Set(dados.map(d => d.Card))];
    const gns = [...new Set(dados.map(d => d.GN))];
    const grupos = [...new Set(dados.map(d => d.Grupo))];

    preencherSelect("filtroCard", cards);
    preencherSelect("filtroGN", gns);
    preencherSelect("filtroGrupo", grupos);
}

function preencherSelect(id, valores) {
    const select = document.getElementById(id);
    select.innerHTML = "";
    valores.forEach(v => {
        if (v) {
            const option = document.createElement("option");
            option.value = v;
            option.textContent = v;
            select.appendChild(option);
        }
    });

    new Choices(select, {
        removeItemButton: true,
        searchEnabled: true,
        placeholder: true,
        placeholderValue: `Filtrar por ${id.replace("filtro", "")}`
    });

    select.addEventListener("change", aplicarFiltros);
}

function aplicarFiltros() {
    const filtroCard = Array.from(document.getElementById("filtroCard").selectedOptions).map(o => o.value);
    const filtroGN = Array.from(document.getElementById("filtroGN").selectedOptions).map(o => o.value);
    const filtroGrupo = Array.from(document.getElementById("filtroGrupo").selectedOptions).map(o => o.value);

    const filtrado = dadosAgrupados.filter(item => {
        const matchCard = filtroCard.length === 0 || filtroCard.includes(item.Card);
        const matchGN = filtroGN.length === 0 || filtroGN.includes(item.GN);
        const matchGrupo = filtroGrupo.length === 0 || filtroGrupo.includes(item.Grupo);
        return matchCard && matchGN && matchGrupo;
    });

    montarTabela(filtrado);
}

carregarTabela();
