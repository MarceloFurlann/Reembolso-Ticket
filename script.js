function normalizar(texto) {
    return texto.replace(/\[|\]/g, "").trim().toLowerCase();
}

// Similaridade simples (baseada em caracteres iguais na mesma posição)
function similaridade(a, b) {
    a = normalizar(a);
    b = normalizar(b);
    const maxLen = Math.max(a.length, b.length);
    let matches = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        if (a[i] === b[i]) matches++;
    }
    return matches / maxLen;
}

// Encontra coluna mais parecida
function encontrarColunaEsperada(cabecalho, esperado) {
    let melhorColuna = null;
    let melhorScore = 0;
    cabecalho.forEach(col => {
        const score = similaridade(col, esperado);
        if (score > melhorScore) {
            melhorScore = score;
            melhorColuna = col;
        }
    });
    return melhorScore >= 0.5 ? melhorColuna : null; // Aceita se >= 50%
}

// Mapeia colunas automaticamente
function mapearColunas(cabecalho, camposEsperados) {
    const mapeamento = {};
    for (let key in camposEsperados) {
        const esperado = camposEsperados[key];
        const colunaEncontrada = encontrarColunaEsperada(cabecalho, esperado);
        if (colunaEncontrada) {
            console.log(`✅ Mapeado '${esperado}' -> '${colunaEncontrada}'`);
            mapeamento[key] = cabecalho.indexOf(colunaEncontrada);
        } else {
            console.warn(`❌ Não encontrado: '${esperado}'`);
            mapeamento[key] = -1;
        }
    }
    return mapeamento;
}

// Dentro da função carregarTabela(), substitua os loops por:
const idxBase = mapearColunas(baseCabecalho, {
    Card: "codigo_card",
    GN: "gn",
    Grupo: "grupo",
    Status: "status",
    Produto: "produto",
    DataInicio: "inicio_vigencia_ic",
    DataFim: "fim_vigencia_ic",
    Saldo: "saldo_ic"
});

const idxReport = mapearColunas(reportCabecalho, {
    Card: "cod ic",
    ValorDesc: "valor desconto"
});
