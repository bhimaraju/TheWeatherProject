using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;
using System.Xml;
using System.Xml.Xsl;
using Weather.Models;
using System.Text;
using System.IO;

namespace Weather.Controllers
{
    public class HomeController : Controller
    {
        //Used to save the xml file to disk
        string uriPath = System.IO.Path.GetDirectoryName(
                                            System.Reflection.Assembly.GetExecutingAssembly().GetName().CodeBase);
        private string bingKey = "YOUR-AZURE-MARKETPLACE/BING-SEARCH-KEY"; //The Bing Key
        private string wundergroundKey = "YOUR-WEATHER-UNDERGROUND-KEY";

        //Loads Index.cshtml
        public ActionResult Index()
        {
            return View();
        }


        //Gets the background image URL using Bing's Image Search API
        [HttpGet]
        public ActionResult BackgroundImage(WeatherFormModel weather)
        {
            if (ModelState.IsValid)
            {
                
                string uri = "https://api.datamarket.azure.com/Bing/Search/v1/Image";

                //Bing's Query String - Sets the weather conditions, day or night time, the number of results, format and some other parameters 
                var param = "?Query=%27" + Url.Encode(weather.Forecast) + "%20" + weather.DayOrNight + "%20sky%20weather" + "%27&Adult=%27Strict%27&ImageFilters=%27Size%3ALarge%2Baspect%3Awide%27&$top=2&$format=json";
                var dataObjects = CallApi(uri, param, bingKey); //Get Response from API
                return Content(JsonConvert.SerializeObject(dataObjects)); //Send data back to client
            }

            return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
        }

        //Works for two client calls - current conditions and 3 day forecast. 
        //Gets XML data from APIs, transforms it to HTML and returns it to the client
        [HttpPost]
        public ActionResult Forecast(WeatherFormModel request)
        {
            if (ModelState.IsValid)
            {
                //Building the uri
                string uri = "http://api.wunderground.com/api/" + wundergroundKey + "/";
                var param = request.Forecast + request.Location + ".xml";

                //Call the API
                string xmlStringFromApi = CallApi(uri, param);


                //Try creating an XML file, transform it to HTML and return the data, if it fails, write error to the console
                try
                {
                    XmlDocument xDoc = new XmlDocument();
                    xDoc.LoadXml(xmlStringFromApi);
                    //                    xDoc.RemoveChild(xDoc.FirstChild);
                    var path = new Uri(uriPath).LocalPath;
                    xDoc.Save(path + "\\Resources\\" + request.Forecast + ".input.xml");
                    XslTransform(request.Forecast);
                    path = new Uri(path).LocalPath + "\\Resources\\" + request.Forecast + ".output.xml";
                    XmlDocument doc = new XmlDocument();
                    doc.Load(path);

                    return Content(doc.InnerXml); //returns html
                }
                catch (XmlException e)
                {
                    Console.WriteLine(e.InnerException);
                    return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
                }
                catch (IOException e)
                {
                    Console.WriteLine(e.InnerException);
                    return new HttpStatusCodeResult(System.Net.HttpStatusCode.InternalServerError); ;
                }
            }
            else
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest); //If the model state is invalid
            }
        }

        //Transforms XML to HTML
        private void XslTransform(string forecastType)
        {

            XslCompiledTransform myXslTransform = new XslCompiledTransform();
            myXslTransform.Load(uriPath + "\\Resources\\" + forecastType + ".xslt"); //determines which xsl file to read from

            //transform and save html file to disk
            myXslTransform.Transform(uriPath + "\\Resources\\" + forecastType + ".input.xml",
                new Uri(uriPath).LocalPath + "\\Resources\\" + forecastType + ".output.xml");

        }

        //Calls the API, basic HTTP authentication optional
        private string CallApi(string uri, string param, string key = null)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(uri);

                //Only for Bing Image Search
                if (key != null)
                {
                    var byteArray = Encoding.ASCII.GetBytes(key + ":" + key);
                    client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));
                }

                // List data response.
                HttpResponseMessage response = client.GetAsync(param).Result;  // Blocking call!
                if (response.IsSuccessStatusCode)
                {
                    // Parse the response body. Blocking!
                    string dataObjects = response.Content.ReadAsStringAsync().Result;
                    //        Console.WriteLine(dataObjects);
                    return dataObjects;
                }
                else
                {
                    Console.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
                }
            }
            catch (HttpRequestException he)
            {
                Console.WriteLine(he.Message);
            }
            catch (WebException we)
            {
                Console.WriteLine(we.Message);
            }
            return null;
        }
    }
}