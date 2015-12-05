<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/">
    <xsl:text xml:space="preserve"/>

    <xsl:apply-templates select="/response/current_observation"/>

  </xsl:template>

  <xsl:template match="current_observation">
    <div style="padding:5px;overflow: auto;">
      <h2 id="display_location" style="margin-top:5px">
        <xsl:value-of select="display_location/full"/>
      </h2>
      <h4 id="time">
        <xsl:value-of select="observation_time"/>
      </h4>

      <div class="F" hidden="true">
        <h1 id='temp_f'>
          <xsl:value-of select="temp_f"/> &#176;F
        </h1>
        <h4 id="feelslike_f">
          Feels Like <xsl:value-of select="feelslike_f"/> &#176;F
        </h4>
        <table style="width:100%;margin-bottom:5px">
          <tr>
            <td style="width:50%">
              <h4 id="weather">
                <xsl:value-of select="weather"/>
              </h4>
            </td>
            <td>
              <h4 id="wind_mph">
                 Wind: <xsl:value-of select="wind_gust_mph"/> mph
              </h4>
            </td>
          </tr>

          <tr>
            <td>
              <h4 id="relative_humidity_f">
                Humidity: <xsl:value-of select="relative_humidity"/>
              </h4>
            </td>
            <td>
              <h4 id="visibility_mi">
                Visibility: <xsl:value-of select="visibility_mi"/> mi
              </h4>
            </td>
          </tr>
        </table>
      </div>

      <div class="C">
        <h1 id="temp_c">
          <xsl:value-of select="temp_c"/> &#176;C
        </h1>

        <h4 id="feelslike_c">
          Feels Like <xsl:value-of select="feelslike_c"/> &#176;C
        </h4>

        <table style="width:100%; margin-bottom:5px">
          <tr>
            <td style="width:50%">
              <h4 id="weather">
                <xsl:value-of select="weather"/>
              </h4>
            </td>
            <td>
              <h4 id="wind_kph">
                 Wind: <xsl:value-of select="wind_gust_kph"/> kmph
              </h4>
            </td>
          </tr>

          <tr>
            <td>
              <h4 id="relative_humidity">
                Humidity: <xsl:value-of select="relative_humidity"/>
              </h4>
            </td>
            <td>
              <h4 id="visibility">
                Visibility <xsl:value-of select="visibility_km"/> km
              </h4>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </xsl:template>
</xsl:stylesheet>