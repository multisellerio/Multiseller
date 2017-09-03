using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using MultiSellerIo.Api.Util.Configurations.Options;
using MultiSellerIo.Api.Util.Mapper;
using MultiSellerIo.Api.Util.Middlewares;
using MultiSellerIo.Dal;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Dal.Repository;
using MultiSellerIo.Intergrations.Azure;
using MultiSellerIo.Services.Cache;
using MultiSellerIo.Services.Images;
using MultiSellerIo.Services.Product;
using MultiSellerIo.Services.User;

namespace MultiSellerIo.Api
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var storageConfig = Configuration.GetSection("Storage");

            services.AddOptions();

            services.AddCors();

            services.Configure<TokenConfiguration>(Configuration.GetSection("Token"));

            services.AddDbContextPool<MultiSellerIoContext>(options =>
                    options.UseSqlServer(Configuration.GetConnectionString("DbConnection")));

            services.AddIdentity<User, Role>()
                .AddEntityFrameworkStores<MultiSellerIoContext>()
                .AddDefaultTokenProviders();

            services.AddDistributedRedisCache(options =>
            {
                options.Configuration = Configuration.GetValue<string>("RedisConnection");
            });

            services.AddScoped<IMultiSellerIoContext, MultiSellerIoContext>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped<ICacheService, CacheService>();

            services.AddScoped<IImageStorageService, ImageStorageService>(provider => new ImageStorageService(new AzureStorageService(storageConfig["ConnectionString"], storageConfig["ImagesContainerName"])));
            services.AddScoped<IImageResizeService, ImageResizeService>();
            services.AddScoped<IImageService, ImageService>();

            services.AddScoped<IUserService, UserService>();

            services.AddScoped<IProductAttributeService, ProductAttributeService>();
            services.AddScoped<IProductCategoryService, ProductCategoryService>();

            var authorizationConfiguration = Configuration.GetSection("Token");

            services.AddAuthentication()
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;

                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidIssuer = authorizationConfiguration["Issuer"],
                        ValidAudience = authorizationConfiguration["Issuer"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authorizationConfiguration["Key"]))
                    };
                });

            // Add framework services.
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment() || env.IsEnvironment("Local"))
            {
                app.UseDeveloperExceptionPage();
            }

            //Initial the roles
            var userService = app.ApplicationServices.GetService<IUserService>();
            userService.InitialRoles().Wait();

            //Intial the automapper configurations
            MapperConfig.Initialize();

            app.UseCors(builder =>
                builder.WithOrigins("http://localhost:61334")
                .AllowAnyHeader()
                .AllowAnyMethod()
            );

            app.UseMiddleware(typeof(ErrorHandlingMiddleware));

            app.UseMvc();
        }
    }
}
