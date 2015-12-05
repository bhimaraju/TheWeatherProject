using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Weather.Models
{
    public class WeatherFormModel
    {
        public WeatherFormModel(string type, string location)
        {
            Forecast = type;
            Location = location;
        }

        public WeatherFormModel()
        {

        }
        public int Id { get; set; }
        public string Location { get; set; }
        public string Forecast { get; set; }
        public string DayOrNight { get; set; }
    }
}