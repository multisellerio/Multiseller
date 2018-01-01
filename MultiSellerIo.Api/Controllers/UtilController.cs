using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MultiSellerIo.Api.Models;
using MultiSellerIo.Api.Util;
using MultiSellerIo.Services.Directory;

namespace MultiSellerIo.Api.Controllers
{
    [Route("api/Util")]
    [MultiSellerAuthorization]
    public class UtilController : Controller
    {
        private readonly ICountryService _countryService;
        public UtilController(ICountryService countryService)
        {
            _countryService = countryService;
        }

        [HttpGet]
        [Route("countries")]
        public async Task<IActionResult> GetCountries(string name)
        {
            var countries = await _countryService.GetCountriesByName(name);
            return Ok(countries.Select(Mapper.Map<CountryBindingModel>).ToList());
        }

        [HttpGet]
        [Route("cities/{stateId}")]
        public async Task<IActionResult> GetCities(long stateId, string name)
        {
            var cities = await _countryService.GetCitiesByName(name, stateId);
            return Ok(cities.Select(Mapper.Map<CityBindingModel>).ToList());
        }

        [HttpGet]
        [Route("states/{countryId}")]
        public async Task<IActionResult> GetStates(long countryId, string name)
        {
            var states = await _countryService.GetStatesByName(name, countryId);
            return Ok(states.Select(Mapper.Map<StateBindingModel>).ToList());
        }
    }
}
