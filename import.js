var fs = require('fs');
var https = require('https');

const antinonio_file = "antinonio.txt"
const file = fs.createWriteStream(antinonio_file);

const REGEX = /! -+ !\n.*Regras de bloqueio globais.*\n.*!\n/;
const REGEX_N = /! -+ !\n.*Scripts impresa.*\n.*!\n/;

const HEADER = `# This hosts file is a merged collection from https://raw.githubusercontent.com/brunomiguel/antinonio
#
# Date: ${new Date().toISOString()}
#
# Fetch the latest version of this file: https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts
# Project home page: https://github.com/andrepcg/antinonio-pihole
#
# ===============================================================

# ------------------------------------------------------ !
# Regras de bloqueio globais para os sites da rede nonio !
# ------------------------------------------------------ !

`;

https.get('https://raw.githubusercontent.com/brunomiguel/antinonio/master/antinonio.txt', function(response) {
  var stream = response.pipe(file);

  stream.on("finish", function() {
    fs. readFile(antinonio_file, 'utf8', function(err, txt) {
      var without_header = txt.slice(txt.search(REGEX)).replace(REGEX, "");
      var without_footer = without_header.slice(0, without_header.search(REGEX_N));
      var clean_hosts = without_footer.replace(/ \* block/g, '').replace(/\* /g, '0.0.0.0 ')

      fs.writeFile("hosts", HEADER + clean_hosts, function(err) {
        if(err) {
          return console.error(err);
        }

        console.log("Imported hosts from brunomiguel/antinonio");
        fs.unlinkSync(antinonio_file)
      });
    });
  });
});
