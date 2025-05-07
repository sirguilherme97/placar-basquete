const fs = require('fs');
const path = require('path');

// Caminho para o diretório de traduções
const translationsDir = path.join(__dirname, 'src', 'translations');

// Lista de arquivos de tradução
const translationFiles = fs.readdirSync(translationsDir)
  .filter(file => file.endsWith('.ts'));

// Valores para a propriedade "salvar" em diferentes idiomas
const saveTranslations = {
  'ar.ts': 'حفظ',
  'bn.ts': 'সংরক্ষণ করুন',
  'de.ts': 'Speichern',
  'en.ts': 'Save',
  'es.ts': 'Guardar',
  'fa.ts': 'ذخیره',
  'fr.ts': 'Enregistrer',
  'he.ts': 'שמור',
  'hi.ts': 'सहेजें',
  'id.ts': 'Simpan',
  'it.ts': 'Salva',
  'ja.ts': '保存',
  'ko.ts': '저장',
  'pl.ts': 'Zapisz',
  'pt.ts': 'Salvar',
  'ru.ts': 'Сохранить',
  'th.ts': 'บันทึก',
  'tr.ts': 'Kaydet',
  'vi.ts': 'Lưu',
  'zh.ts': '保存'
};

// Processar cada arquivo de tradução
translationFiles.forEach(file => {
  const filePath = path.join(translationsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Verificar se a propriedade "salvar" já existe
  if (!content.includes('salvar:')) {
    // Encontrar a posição após "remover:"
    const removerRegex = /remover:\s*"[^"]*"/;
    const match = content.match(removerRegex);
    
    if (match) {
      // Encontrar o final da linha de "remover"
      const endOfRemover = content.indexOf(match[0]) + match[0].length;
      
      // Inserir a propriedade "salvar" após "remover"
      const saveTranslation = saveTranslations[file] || 'Save';
      const newContent = 
        content.substring(0, endOfRemover) + 
        ',\n  salvar: "' + saveTranslation + '"' + 
        content.substring(endOfRemover);
      
      // Escrever o conteúdo atualizado no arquivo
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Adicionado "salvar" ao arquivo ${file}`);
    } else {
      console.log(`Não foi possível encontrar "remover" no arquivo ${file}`);
    }
  } else {
    console.log(`"salvar" já existe no arquivo ${file}`);
  }
});

console.log('Atualização concluída!'); 