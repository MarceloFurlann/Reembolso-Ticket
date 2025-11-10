const urlBase = "https://docs.google.com/sp campo.

📌 Pela sua lista:

- **Card** = Coluna A → índice `0`  
- **Data Início** = Coluna L → índice `11`  
- **Data Fim** = Coluna M → índice `12`  
- **Saldo** = Coluna V → índice `21`  
- **Grupo** = Coluna AW → índice `48`  
- **Produto** = Coluna AX → índice `49`  
- **GN** = Coluna AY → índice `50`  
- **Status** = Coluna AZ → índice `51`  

---

### Código ajustado

```js
const urlBase = "https://docs.google.com/spreadsheets/d/e/2readsheets/d/e/2PACX-1vTZb-Tj3DNPACX-1vTZb-Tj3DNnazVCv0IdZmkNycSknazVCv0IdZmkNycSkHDsmx4j5z4GwoABBho_xbGzjWzsOLDdZnWLdz06JEXaL-mG6ovUw/pub?gid=1131797479&single=trueHDsmx4j5z4GwoABBho_xbGzjWzsOLDdZnWLdz06JEXaL-mG6ovUw/pub?gid=1131797479&single=true&output=csv";
const urlReport = "https://docs.google.com/spreadsheets/d/e&output=csv";
const urlReport = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZb-Tj3/2PACX-1vTZb-Tj3DNnazVCv0IdZmkNycSkHDsmx4j5z4GwoABBho_xbGzjWzsOLDdZnWLdz06JEXaL-mG6ovDNnazVCv0IdZmkNycUw/pub?gid=359149770&single=true&output=csv";

let dadosAgrupados =SkHDsmx4j5z4GwoABBho_xbGzjWzsOLDdZnWLdz06JEXaL-mG6ovUw/pub?gid=359149770&single=true&output=csv";

let dadosAgrupados = [];

async function carregarTabela() {
    try {
        const baseResp = await fetch(urlBase);
        const baseData = await baseResp.text();
        const base [];

async function carregarTabela() {
    try {
        const baseResp = await fetch(urlBase);
        const baseData = await baseResp.text();
        const baseLinhas = baseData.split("\n").map(l => l.split(",Linhas = baseData"));
        const baseCorpo = baseLinhas.slice(1);

        const reportResp = await fetch.split("\n").map(l => l.split(","));
        const(urlReport);
        const reportData = await reportResp.text();
        const reportLinhas = reportData baseCorpo = baseLinhas.slice(1);

        const reportResp = await fetch(urlReport);
        const reportData.split("\n").map(l => l.split(","));
        const reportCabecalho = reportLinhas[0]. = await reportResp.text();
        const reportLinhas = reportData.split("\n").map(l => l.split(","));
        const reportCabecalho = reportLinhas[0].map(h => h.trim());
        const reportmap(h => h.trim());
        const reportCorpo = reportLinCorpo = reportLinhas.slice(1);

        // Índices fixos conforme ordem dashas.slice(1);

        colunas no Excel
        const idxCard     = 0;   // // Índices fixos conforme ordem das colunas no Excel
        const idxCard     = 0;   // Coluna A
        Coluna A
        const idxDataIni  = 11;  // Coluna const idxDataIni L
        const idxDataFim  = 12;  // Coluna M
        const idxSaldo    = 21;  // Coluna V
        const  = 11;  // Coluna L
        const idxDataFim  = 12;  // Coluna M
        const idxSaldo    = 21;  // Coluna V
        const idxGrupo    = 48 idxGrupo    = 48;  // Coluna AW
;  // Coluna AW
        const idx        const idxProduto  = 49;  // Coluna AX
        const idxGN       = 50;  // Coluna AY
        constProduto  = 49;  // Coluna AX
        const idxGN       = 50;  // Coluna AY
        const idxStatus   = 51;  // Coluna AZ

        // Report (mantém igual)
        const idxReportCard = reportCabecalho.indexOf idxStatus   = 51;  // Coluna AZ

        // Report (mantém igual)
        const idxReportCard = reportCabecalho.indexOf("COD IC");
        const idxValorDesc  = reportCabecalho("COD IC");
        const idxValorDesc  = reportCabecalho.indexOf("Valor Desconto");

        const agrupado = {};

        base.indexOf("Valor Desconto");

        const agrupado = {};

        baseCorpo.forEach(linha => {
           Corpo.forEach(linha => {
            const card = linha const card = linha[idxCard];
            if (!card) return;

            if (!agrupado[card]) {
                agrupado[card] = {
                    Card: card,
                   [idxCard];
            if (!card) return;

            if (!agrupado[card]) {
                agrupado[card] = {
                    GN: linha[idxGN] || Card: card,
                    GN: linha[idxGN] || "",
                    Grupo: linha[idxGrupo] || "",
                    Grupo: linha[idxGrupo] || "",
                    Status: linha[idxStatus] || "",
                    "",
                    Status: linha[idxStatus] || "",
                    Produto: linha[idxProduto] || "",
                    DataInicio: linha[idxDataIni] || "",
 Produto: linha[idxProduto] || "",
                    DataInicio: linha                    DataFim: linha[idxDataFim] || "",
                    Saldo: 0,
                   [idxDataIni] || "",
                    DataFim: linha[idxDataFim] || "",
                    Saldo: 0,
                    Baixas: 0
                Baixas: 0
                };
            }

 };
            }

            if (linha[idxSaldo]) {
                const valor = parse            if (linha[idxSaldo]) {
                const valor = parseFloat(linha[idxSaldo].replace(",", "."));
                if (!isNaN(valor))Float(linha[idxSaldo].replace(",", "."));
                if (!isNaN(valor)) agrupado[card].Saldo += valor;
            }
        agrupado[card].Saldo += valor;
            }
        });

        reportCorpo.forEach(linha => {
            const cardReport = linha[idxReportCard];
 });

        reportCorpo.forEach(linha => {
            const cardReport = linha[idxReportCard];
            if (!            if (!cardReport || !agrupado[cardReport]) return;

            const valorDesc = parseFloat((linha[idxValorDesc] ||cardReport || !agrupado[cardReport]) return;

            const valorDesc = parseFloat((linha[idxValorDesc] || "0").replace(",", "."));
            if (!isNaN(valorDesc)) agrupado[cardReport].Baixas += valorDesc;
        });

        dadosAgrupados = "0").replace(",", "."));
            if (!isNaN(valorDesc)) agrupado[cardReport].Baixas += valorDesc;
        });

        dadosAgrupados = Object.values(agrupado);
        preencherFiltros(dadosAgrupados);
        montarTabela(dados Object.values(agrupado);
        preencherFiltros(dadosAgrupados);
        montarTabela(dadosAgrupados);

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
Agrupados);

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

function montarTabela(dados) {
    const tabela = document.querySelector("#tabela1 tbody");
    tabela.innerHTML = "";

    }
}

function montarTabela(dados) {
    const tabela = document.querySelector("#tabela1 tbody");
    tabela    dados.forEach(item => {
        const saldoFinal = item.Saldo - item.Baixas;
        const tr = document.createElement(".innerHTML = "";

    dados.forEach(item => {
        const saldoFinal = item.Saldo - item.Baixas;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.Card}</td>
            <td>${item.GN}</td>tr");
        tr.innerHTML = `
            <td>${item.Card}</td>
            <td>${item.GN}</td>
            <td>${item.Grupo}</td>
            <td>${item.Status}</td>
            <td>${item.Produto}</td>
            <td>
            <td>${item.Grupo}</td>
            <td>${item.Status}</td>
            <td>${item.Produto}</td>
            <td>${item.DataInicio${item.DataInicio}</td>
            <td>${item.DataFim}</td>
           }</td>
            <td>${item.DataFim}</td>
            <td>R$ ${item.Saldo.toLocaleString("pt-BR")}</td>
            <td> <td>R$ ${item.Saldo.toLocaleString("pt-BR")}</td>
            <td>R$ ${item.Baixas.toLocaleString("R$ ${item.Baixas.toLocaleString("pt-BR")}</td>
            <td>R$ ${saldoFinalpt-BR")}</td>
            <td>R$ ${saldoFinal.toLocaleString("pt-BR")}</td>
        `;
        tabela.appendChild(tr);
    });
}

function preencherFiltros(dados) {
    const.toLocaleString("pt-BR")}</td>
        `;
        tabela.appendChild(tr);
    });
}

function preencherFiltros(dados) {
    const cards = [...new Set(dados.map(d => d.Card))];
    const gns =  cards = [...new Set(dados.map(d => d.Card))];
    const gns = [...new Set(dados.map(d => d.GN))];
    const grupos = [...new Set(dados.map(d => d.Grupo))];

    preencherSelect[...new Set(dados.map(d => d.GN))];
    const grupos = [...new Set(dados.map(d => d.Grupo))];

    preencherSelect("filtroCard", cards);
    preencher("filtroCard", cards);
    preencherSelect("filtroGNSelect("filtroGN", gns);
    preencherSelect("filtroGrupo", gns);
    preencherSelect("filtroGrupo", grupos);
}

function preencherSelect(id, valores) {
    const select", grupos);
}

function preencherSelect(id, valores) {
    const select = document.getElementById(id);
    select.innerHTML = "";
    valores.forEach(v => {
        if = document.getElementById(id);
    select.innerHTML = "";
    valores.forEach(v => {
        if (v) {
            (v) {
            const option = document.createElement("option");
            option.value = v;
            option.textContent = v const option = document.createElement("option");
            option.value = v;
            option.textContent = v;
            select.appendChild(option);
        }
    });

    new Choices(select, {
        removeItemButton: true,
        searchEnabled: true,
       ;
            select.appendChild(option);
        }
    });

    new Choices(select, {
        removeItemButton: true,
        searchEnabled: true,
        placeholder: true placeholder: true,
        placeholderValue: `Filtrar por ${id.replace("f,
        placeholderValue: `Filtrar por ${id.replace("filtro", "")}`
    });

    select.addEventListener("change", aplicariltro", "")}`
    });

    select.addEventListener("change", aplicarFiltros);
}

function aplicarFiltros() {
    const filtroFiltros);
}

function aplicarFiltros() {
    const filtroCard = Array.from(document.getElementById("filtroCardCard = Array.from(document.getElementById("filtroCard").selectedOptions").selectedOptions).map(o => o.value);
    const filtroGN = Array.from(document).map(o => o.value.getElementById("filtroGN").selectedOptions).map(o => o.value);
    const filtroGrupo = Array.from(document.getElementById("filtroGrupo").selectedOptions).map(o =>);
    const filtroGN = Array.from(document.getElementById("filtroGN").selectedOptions).map(o => o.value);
    const filtroGrupo = Array.from(document.getElementById("filtro o.value);

    const filtrado = dadosAgrupados.filter(item => {
        const matchCard = filtroCard.lengthGrupo").selectedOptions).map(o => o.value);

    const filtrado = dadosAgrupados.filter(item => {
        const matchCard = filtroCard.length === 0 || filtroCard.includes(item === 0 || filtroCard.includes(item.Card);
        const matchGN = filtroGN.length === 0 || filtroGN.includes(item.GN);
        const matchGrupo = filtroGrupo.length === 0 || filtroGrupo.includes(item.Grupo);
       .Card);
        const matchGN = filtroGN.length === 0 || filtroGN.includes(item.GN);
        const matchGrupo = filtroGrupo.length === 0 || filtroGrupo.includes(item return matchCard && matchGN && matchGrupo;
    });

    montarTabela(filtrado);
}

carregarTabela();
