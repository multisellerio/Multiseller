using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Dal.Repository;

namespace MultiSellerIo.Services.Directory
{
    public interface ICountryService
    {
        Task<List<City>> GetCitiesByName(string name, long stateId);
        Task<List<State>> GetStatesByName(string name, long countryId);
        Task<List<Country>> GetCountriesByName(string name);
    }

    public class CountryService : ICountryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CountryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<Country>> GetCountriesByName(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return await _unitOfWork.CountriesRepository.GetAll()
                    .ToListAsync();
            }

            return await _unitOfWork.CountriesRepository.GetAll()
                .Where(country => country.CountryName.Contains(name.ToLower()))
                .ToListAsync();
        }

        public async Task<List<City>> GetCitiesByName(string name, long stateId)
        {
            if (string.IsNullOrEmpty(name))
            {
                return await _unitOfWork.CitiesRepository.GetAll()
                    .Where(city => city.StateId == stateId)
                    .ToListAsync();
            }

            return await _unitOfWork.CitiesRepository.GetAll()
                .Where(city => city.StateId == stateId && city.CityName.Contains(name.ToLower()))
                .ToListAsync();
        }

        public async Task<List<State>> GetStatesByName(string name, long countryId)
        {
            if (string.IsNullOrEmpty(name))
            {
                return await _unitOfWork.StatesRepository.GetAll()
                    .Where(state => state.CountryId == countryId)
                    .ToListAsync();
            }

            return await _unitOfWork.StatesRepository.GetAll()
                .Where(state => state.CountryId == countryId && state.StateName.Contains(name.ToLower()))
                .ToListAsync();
        }
    }
}
