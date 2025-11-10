const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZb-Tj3DNnazVCv0IdZmkNycSkHDsmx4j5z4GwoABBho_xbGzjWzsOLDdZnWLdz06JEXaL-mG6ovUw/pub?output=csv";

async function carregarTabela() {
    try {
        const response = await fetch(urlCSV);
        const data = await response.text();
        console.log("Dados CSV carregados:", data.substring(0, 200)); // Log inicial

        const linhas = data.split("\n").map(l => l.split(","));
        console.log("Linhas processadas:", linhas.length);

        const corpo = linhas.slice(1); // Ignora cabeçalho

        // Índices das colunas
        const idxCard = 0;    // Coluna A
        const idxGrupo = 48;  // Coluna AW
        const idxStatus = 51; // Coluna AZ
        const idxProduto = 31;// Coluna AF
        const idxDataIni = 11;// Coluna L
        const idxDataFim = 12;// Coluna M
        const idxSaldo = 21;  // Coluna V

        const agrupado = {};

        corpo.forEach(linha => {
            const card = linha[idxCard];
            if (!card) return;

            if (!agrupado[card]) {
                agrupado[card] = {
                    Card: card,
                    Grupo: linha[idxGrupo],
                    Status: linha[idxStatus],
                    Produto: linha[idxProduto],
                    DataInicio: linha[idxDataIni],
                    DataFim: linha[idxDataFim],
                    Saldo: 0,
                    Baixas: 0
                };
            }

            const valor = parseFloat(linha[idxSaldo].replace(",", "."));
            if (!isNaN(valor)) agrupado[card].Saldo += valor;
        });

        // Simulação de Baixas
        for (let card in agrupado) {
            agrupado[card].Baixas = agrupado[card].Saldo * 0.1;
        }

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
