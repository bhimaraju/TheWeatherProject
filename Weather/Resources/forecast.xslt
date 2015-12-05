<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">

    <xsl:apply-templates select="/response/forecast/simpleforecast/forecastdays"/>

  </xsl:template>

  <xsl:template match="forecastdays">
    <div style="margin: 5px;overflow: auto;">
      <div class="F" hidden="true" style="display: block;">
        <table style="width:100%;height:100%;">
          <xsl:for-each select="forecastday">
            <tr>
              <td>
                <strong>
                  <xsl:if test="period=1">
                    <xsl:text>Today&#160;</xsl:text>
                  </xsl:if>
                  <xsl:if test="period &gt; 1">
                    <xsl:value-of select="date/weekday"/>&#160;
                  </xsl:if>
                </strong>
              </td>
              <td>
                <strong>
                  <img>
                    <xsl:attribute name="src">
                      <xsl:value-of select="icon_url"/>
                    </xsl:attribute>
                  </img>
                </strong>
              </td>
              <td>
                Max: <xsl:value-of select="high/fahrenheit"/>&#176;F
              </td>
              <td>
                Min: <xsl:value-of select="low/fahrenheit"/>&#176;F
              </td>
            </tr>
            
          </xsl:for-each>
        </table>
      </div>

      <div class="C" hidden="true" style="display: block;">
        <table style="width:100%;height:100%;">
          <xsl:for-each select="forecastday">
            <tr>
              <td>
                <strong>
                  <xsl:if test="period=1">
                    <xsl:text>Today&#160;</xsl:text>
                  </xsl:if>
                  <xsl:if test="period &gt; 1">
                    <xsl:value-of select="date/weekday"/>&#160;
                  </xsl:if>
                </strong>
              </td>
              <td style="width:1px, height:1px">
                <strong>
                  <img>
                    <xsl:attribute name="src">
                      <xsl:value-of select="icon_url"/>
                    </xsl:attribute>
                  </img>
                </strong>
              </td>
              <td>
                Max: <xsl:value-of select="high/celsius"/>&#176;C
              </td>
              <td>
                Min: <xsl:value-of select="low/celsius"/>&#176;C
              </td>
            </tr>
          </xsl:for-each>
        </table>
      </div>
    </div>
  </xsl:template>
</xsl:stylesheet>