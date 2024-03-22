const JSZip = require('jszip');
const fs = require('fs-extra');
const path = require('path');

async function extractAPKG(filePath, outputDir) {
  try {
    const buffer = await fs.readFile(filePath);
    const zip = await JSZip.loadAsync(buffer);

    await Promise.all(Object.keys(zip.files).map(async (filename) => {
      const fileData = await zip.files[filename].async("nodebuffer");
      const outputFile = path.join(outputDir, filename);

      await fs.ensureDir(path.dirname(outputFile));
      await fs.writeFile(outputFile, fileData);
    }));

    console.log("Extração concluída com sucesso!");
  } catch (e) {
    console.error(`Ocorreu um erro durante a extração: ${e}`);
  }
}

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error("Uso: node converterApkgIntoFolder.js '<caminho_do_arquivo.apkg>'");
  process.exit(1);
}

const filePath = args[0];

const fileNameWithoutExtension = path.parse(filePath).name;
const outputDir = fileNameWithoutExtension;

extractAPKG(filePath, `../decks/${outputDir}`);