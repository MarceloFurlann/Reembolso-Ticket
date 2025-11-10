const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZb-Tj3DNnazVCv0IdZmkNycSkHDsmx4j5z4GwoABBho_xbGzjWzsOLDdZnWLdz06JEXaL-mG6ovUw/pub?output=csv";

async function carregarDados() {
    try {
        const response = await fetch(urlCSV);
        const data = await response.text();

        // Converte CSV para linhas
        const linhas = data.split("\n").map(l => l.split(","));

        // Cabeçalho
        const cabecalho = linhas[0];
        const corpo = linhas.slice(1);

        // Preenche tabela 1 (exemplo)
        const tabela = document.querySelector("#tabela1 tbody");
        tabela.innerHTML = "";

        let total = 0;

        corpo.forEach(linha => {
            const tr = document.createElement("tr");
            linha.forEach((coluna, index) => {
                const td = document.createElement("td");
                td.textContent = coluna;
                tr.appendChild(td);

                // Se a coluna for valor (ex: última coluna), soma
                if (index === linha.length - 1) {
                    const valor = parseFloat(coluna.replace(",", "."));
                    if (!isNaN(valor)) total += valor;
                }
            });
            tabela.appendChild(tr);
        });

        // Atualiza total no cartão
        document.getElementById("total-geral").textContent = "R$ " + total.toLocaleString("pt-BR");
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

carregarDados();
$(document).ready(function() {
    // Inicializa DataTables para as 3 tabelas
    $('#tabela1').DataTable();
    $('#tabela2').DataTable();
    $('#tabela3').DataTable();

    // Calcula total geral
    function calcularTotal() {
        let total = 0;
        $('table tbody tr').each(function() {
            let valor = parseFloat($(this).find('td:last').text());
            if (!isNaN(valor)) {
                total += valor;
            }
        });
        $('#total-geral').text('R$ ' + total.toLocaleString('pt-BR'));
    }

    calcularTotal();

});

