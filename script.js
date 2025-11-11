const urlBase = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZb-Tj3DNnazVCv0IdZmkNycSkHDsmx4j5z4GwoABBho_xbGzjWzsOLDdZnWLdz06JEXaL-mG6ovUw/pub?gid=1131797479&single=true&output=csv";
const urlReport = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZb-Tj3DNnazVCv0IdZmkNycSkHDsmx4j5z4GwoABBho_xbGzjWzsOLDdZnWLdz06JEXaL-mG6ovUw/pub?gid=359149770&single=true&output=csv";

let dadosAgrupados = [];

function normalizar(texto) {
    return texto.replace(/\[|\]/g, "").trim().toLowerCase();
}

const camposBase = {
    Card: "controleiccodigo_card",
    GN: "gn",
    Grupo: "grupo",
    Status: "controleicstatus_card",
    Produto: "controleicproduto",
    DataInicio: "controleicinicio_vigencia_ic",
    DataFim: "controleicfim_vigencia_ic",
    Saldo: "controleicsaldo_ic"
};

const camposReport = {
    Card: "cod ic",
    ValorDesc: "valor desconto"
};

async function carregarTabela() {
    try {
        const baseResp = await fetch(urlBase);
        const baseData = await baseResp.text();
        const sepBase = baseData.includes(";") ? ";" : ",";
        const baseLinhas = baseData.split("\n").map(l => l.split(sepBase));
        const baseCabecalho = baseLinhas[0].map(h => normalizar(h));
        const baseCorpo = baseLinhas.slice(1);

        const reportResp = await fetch(urlReport);
        const reportData = await reportResp.text();
        const sepReport = reportData.includes(";") ? ";" : ",";
        const reportLinhas = reportData.split("\n").map(l => l.split(sepReport));
        const reportCabecalho = reportLinhas[0].map(h => normalizar(h));
        const reportCorpo = reportLinhas.slice(1);

        console.log("Cabeçalho Base Normalizado:", baseCabecalho);
        console.log("Cabeçalho Report Normalizado:", reportCabecalho);

        const idxBase = {};
        for (let key in camposBase) {
            idxBase[key] = baseCabecalho.indexOf(camposBase[key]);
        }

        const idxReport = {};
        for (let key in camposReport) {
            idxReport[key] = reportCabecalho.indexOf(camposReport[key]);
        }

        console.log("Índices Base:", idxBase);
        console.log("Índices Report:", idxReport);

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
