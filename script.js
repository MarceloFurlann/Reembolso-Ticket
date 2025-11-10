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