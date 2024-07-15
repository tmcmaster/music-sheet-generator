<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <!-- Match the root element and transform into song structure -->
    <xsl:template match="/">
        <song timeSignature="4/4">
            <xsl:apply-templates select="score-partwise/part/measure"/>
        </song>
    </xsl:template>

    <!-- Transform each measure into a voice with notes -->
    <xsl:template match="measure">
        <voice num_beats="{//attributes/time/beats}" beat_value="4">
            <xsl:apply-templates select="note"/>
        </voice>
    </xsl:template>

    <!-- Transform each note into a note element with keys and duration -->
    <xsl:template match="note">
        <note>
            <xsl:attribute name="keys">
                <xsl:value-of select="concat(pitch/step, '/', pitch/octave)"/>
            </xsl:attribute>
            <xsl:attribute name="duration">
                <xsl:choose>
                    <xsl:when test="type = 'half'">
                        <xsl:text>h</xsl:text>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:text>q</xsl:text>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>
        </note>
    </xsl:template>

</xsl:stylesheet>
