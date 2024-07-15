<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns="http://www.w3.org/1999/xhtml">

    <xsl:output method="html" indent="yes" omit-xml-declaration="no"/>

    <xsl:template match="/">
        <html>
            <head>
                <title>Transformed Document</title>
                <script src="../library/opensheetmusicdisplay.min.js"/>
                <script>
                   window.onload = function() {
                       const musicXML = document.getElementById('music-xml').innerHTML;
                       const osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay("osmdCanvas");
                       osmd.load(`&lt;?xml version="1.0" encoding="UTF-8"?&gt;\n${musicXML}`);
                       osmd.render();
                   }
                </script>
            </head>
            <body>
                <h1>Document Transformation</h1>
                <div id="osmdCanvas"/>
                <pre id="music-xml" style="display:none">
                    <xsl:text disable-output-escaping="yes">&lt;?xml version="1.0" encoding="UTF-8"?&gt;</xsl:text>

                    <xsl:apply-templates/>
                </pre>
            </body>
        </html>
    </xsl:template>

    <!-- Ignore xml-stylesheet Processing Instructions -->
    <xsl:template match="processing-instruction('xml-stylesheet')"/>

    <xsl:template match="node() | @*">
        <xsl:copy>
            <xsl:apply-templates select="@* | node()"/>
        </xsl:copy>
    </xsl:template>
</xsl:stylesheet>
