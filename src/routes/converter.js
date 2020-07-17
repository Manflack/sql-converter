const express = require("express");
const { addListener } = require("nodemon");
const router = express.Router();

const xmlInsertBase = "<insert tableName=\"PROPERTIES\">\r\n<column name=\"application\" value=\"[NOMBRE DEL MODULO]\" />\r\n<column name=\"profile\" value=\"default\" />\r\n<column name=\"label\" value=\"master\" />\r\n<column name=\"prop_key\" value=\"[PROPERTY KEY]\" />\r\n<column name=\"prop_value\" value=\"[PROPERTY VALUE]\" />\r\n</insert>";
const xmlRollbackBase = "<delete tableName=\"PROPERTIES\">\r\n<where>application='[NOMBRE DEL MODULO]' AND prop_key='[PROPERTY KEY]'</where>\r\n</delete>";

router.get("/echo", (req, res) => {
    res.send("echo works");
});

router.post("/", async (req, res) => {
    var sqlStatementFull = req.body.sqlRaw;
    var legoName = req.body.legoName;
    var baseName = req.body.baseName;

    var insertAcumulates = "";
    var rollbackAcumulates = "";

    if (sqlStatementFull) {
        var sqlStatementSplitted = sqlStatementFull.split("\n");

        for (nText = 0; nText < sqlStatementSplitted.length; nText++) {

            sqlStatementSplitted[nText] = sqlStatementSplitted[nText].trim();

            while ((sqlStatementSplitted[nText][0] === "-" && sqlStatementSplitted[nText][1] === "-")
                || sqlStatementSplitted[nText] === 0
                || sqlStatementSplitted[nText].trim().length === 0) {
                nText++;
            }

            sqlStatement = sqlStatementSplitted[nText].toLowerCase();
            sqlStatement = sqlStatement.split(" values ");
            sqlStatement = sqlStatement[1].trim();

            var getContent = false;
            var content = "";
            for (var i = 0; i < sqlStatement.length; i++) {

                if (sqlStatement[i] === "(")
                    getContent = true;

                if (getContent) {
                    content = content + sqlStatement[i];
                    if (sqlStatement[i] === ")") {
                        getContent = false;
                        content = content.replace(/'+/g, "");
                        content = content.trim().substr(1, (content.length) - 2);
                        //console.log(content);

                        var contentSplitted = content.split(",");
                        var key = contentSplitted[0].trim();
                        var value = contentSplitted[1].trim();

                        insertAcumulates = insertAcumulates + xmlInsertBase.replace("[NOMBRE DEL MODULO]", legoName).replace("[PROPERTY KEY]", key).replace("[PROPERTY VALUE]", value) + "\n";
                        rollbackAcumulates = rollbackAcumulates + xmlRollbackBase.replace("[NOMBRE DEL MODULO]", legoName).replace("[PROPERTY KEY]", key) + "\n";

                        content = "";
                    }
                }
            }
        }
    }
    var response = new Array();
    response[0] = insertAcumulates;
    response[1] = rollbackAcumulates;

    //console.log(response);

    res.send(response);
});

module.exports = router;
