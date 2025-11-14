import com.opencsv.CSVReader;
import com.opencsv.CSVWriter;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class FiltroCSV {
    public static void main(String[] args) {
        String inputFile = "Base - Base.csv";
        String outputFile = "resultado_filtrado.csv";

        // Filtros (pode alterar conforme necessário)
        String filtroCard = "IC-05795";
        String filtroGN = "Kenia Hamid";
        String filtroGrupo = "ESPLANADA";

        try (CSVReader reader = new CSVReader(new FileReader(inputFile))) {
            List<String[]> linhas = reader.readAll();
            List<String[]> resultado = new ArrayList<>();

            // Cabeçalho
            String[] cabecalho = linhas.get(0);
            resultado.add(cabecalho);

            // Índices das colunas
            int idxCard = -1, idxGN = -1, idxGrupo = -1;
            for (int i = 0; i < cabecalho.length; i++) {
                if (cabecalho[i].equalsIgnoreCase("Card")) idxCard = i;
                if (cabecalho[i].equalsIgnoreCase("GN")) idxGN = i;
                if (cabecalho[i].equalsIgnoreCase("Grupo")) idxGrupo = i;
            }

            // Filtragem
            for (int i = 1; i < linhas.size(); i++) {
                String[] linha = linhas.get(i);
                boolean matchCard = filtroCard == null || linha[idxCard].equalsIgnoreCase(filtroCard);
                boolean matchGN = filtroGN == null || linha[idxGN].equalsIgnoreCase(filtroGN);
                boolean matchGrupo = filtroGrupo == null || linha[idxGrupo].equalsIgnoreCase(filtroGrupo);

                if (matchCard && matchGN && matchGrupo) {
                    resultado.add(linha);
                }
            }

            // Exporta resultado
            try (CSVWriter writer = new CSVWriter(new FileWriter(outputFile))) {
                writer.writeAll(resultado);
            }

            System.out.println("Arquivo filtrado gerado: " + outputFile);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
