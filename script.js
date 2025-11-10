const urlCSV = "https://docs.google.com/spreadsheets/d/e/.../pub?gid=XXXX&single=true&output=csv";

async function carregarDados() {
    try {
        const response = await fetch(urlCSV);
        const data = await response.text();

        // Converte CSV para linhas
        const linhas = data.split("\n").map(l => l.split(","));

        // Cabeçalho
        const cabecalho = linhas[0];
        const corpo = linhas.slice(1);

        // Preenche tabela
        const tabela = document.querySelector("#tabela1 tbody");
        tabela.innerHTML = "";

        let total = 0;

        corpo.forEach(linha => {
            const tr = document.createElement("tr");
            linha.forEach((coluna, index) => {
                const td = document.createElement("td");
                td.textContent = coluna;
                tr.appendChild(td);

                // Se a última coluna for valor, soma
                if (index === linha.length - 1) {
                    const valor = parseFloat(coluna.replace(",", "."));
                    if (!isNaN(valor)) total += valor;
                }
            });
            tabela.appendChild(tr);
        });

        // Atualiza total no cartão
        document.getElementById("total-geral").textContent = "R$ " + total.toLocaleString("pt-BR");

        // Inicializa DataTables após carregar dados
        $('#tabela1').DataTable();
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

carregarDados();

