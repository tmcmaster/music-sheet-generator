<?xml version="1.0" encoding="UTF-8"?>
<!--suppress ALL -->
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="html" indent="yes" />

    <xsl:template match="/">
        <html lang="en">
            <head>
                <title>Sheet Music</title>
                <script type="module" src="../sheet-music.js"></script>
            </head>
            <body>
                <wt-sheet-music>
                    <xsl:apply-templates select="song"/>
                </wt-sheet-music>
            </body>
        </html>
    </xsl:template>

    <xsl:template match="@* | node()">
        <xsl:copy>
            <xsl:apply-templates select="@* | node()"/>
        </xsl:copy>
    </xsl:template>

</xsl:stylesheet>
