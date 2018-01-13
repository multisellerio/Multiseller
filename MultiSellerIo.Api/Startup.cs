using System;
using System.Linq;
using System.Text;
using Hangfire;
using Hangfire.Dashboard;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using MultiSellerIo.Api.Util.Configurations.Options;
using MultiSellerIo.Api.Util.Mapper;
using MultiSellerIo.Api.Util.Middlewares;
using MultiSellerIo.Api.Util.Token;
using MultiSellerIo.Dal;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Dal.Repository;
using MultiSellerIo.Intergrations.Azure;
using MultiSellerIo.Services.Cache;
using MultiSellerIo.Services.Directory;
using MultiSellerIo.Services.Email;
using MultiSellerIo.Services.Images;
using MultiSellerIo.Services.Product;
using MultiSellerIo.Services.Store;
using MultiSellerIo.Services.User;
using Swashbuckle.AspNetCore.Swagger;

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
            var externalAuthConfig = Configuration.GetSection("ExternalAuth");

            services.AddOptions();

            services.AddCors();

            services.Configure<TokenConfiguration>(Configuration.GetSection("Token"));
            services.Configure<FacebookConfiguration>(externalAuthConfig.GetSection("Facebook"));

            services.AddDbContextPool<MultiSellerIoContext>(options =>
                    options.UseSqlServer(Configuration.GetConnectionString("DbConnection")));

            services.AddIdentity<User, Role>()
                .AddEntityFrameworkStores<MultiSellerIoContext>()
                .AddTokenProvider<TokenProvider>("Default");

            services.AddDistributedRedisCache(options =>
            {
                options.Configuration = Configuration.GetValue<string>("RedisConnection");
            });

            services.AddTransient<string>(provider => Configuration["UiHost"]);

            services.AddScoped<IMultiSellerIoContext, MultiSellerIoContext>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped<ICacheService, CacheService>();

            services.AddScoped<IImageStorageService, ImageStorageService>(provider => new ImageStorageService(new AzureStorageService(storageConfig["ConnectionString"], storageConfig["ImagesContainerName"])));
            services.AddScoped<IImageResizeService, ImageResizeService>();
            services.AddScoped<IImageService, ImageService>();

            services.AddScoped<IEmailService>(provider => new EmailService(Configuration["SendGridToken"]));
            services.AddScoped<IEmailTemplateService, EmailTemplateService>();
            services.AddScoped<IEmailSendingService, EmailSendingService>();

            services.AddScoped<ICountryService, CountryService>();

            services.AddScoped<IUserService, UserService>();

            services.AddScoped<IProductAttributeService, ProductAttributeService>();
            services.AddScoped<IProductCategoryService, ProductCategoryService>();
            services.AddScoped<IProductService, ProductService>();

            services.AddScoped<IStoreService, StoreService>();

            var authorizationConfiguration = Configuration.GetSection("Token");

            var facebookConfig = externalAuthConfig.GetSection("Facebook");
            var googleConfig = externalAuthConfig.GetSection("Google");
            var twitterConfig = externalAuthConfig.GetSection("Twitter");

            services.AddAuthentication()
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;

                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidIssuer = authorizationConfiguration["Issuer"],
                        ValidAudience = authorizationConfiguration["Issuer"],
                        IssuerSigningKey =
                            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authorizationConfiguration["Key"]))
                    };
                })
                .AddFacebook(options =>
                {
                    options.AppId = facebookConfig["AppId"];
                    options.AppSecret = facebookConfig["AppSecret"];
                    options.Fields.Add("email");
                })
                .AddGoogle(options =>
                {
                    options.ClientId = googleConfig["ClientId"];
                    options.ClientSecret = googleConfig["ClientSecret"];
                 })
                .AddTwitter(options =>
                {
                    options.ConsumerKey = twitterConfig["ConsumerKey"];
                    options.ConsumerSecret = twitterConfig["ConsumerSecret"];
                    options.RetrieveUserDetails = true;
                });

            services.AddHangfire(config =>
                config.UseSqlServerStorage(Configuration.GetConnectionString("DbConnection")));

            // Add framework services.
            services.AddMvc();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "Multiseller.io API Documentation", Version = "v1" });
            });
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

            app.UseStaticFiles();

            app.UseCors(builder =>
                builder.WithOrigins(Configuration["Origins"].Split(","))
                .AllowAnyHeader()
                .AllowAnyMethod()
            );

            app.UseMiddleware(typeof(ErrorHandlingMiddleware));

            app.UseAuthentication();

            app.UseHangfireServer();
            app.UseHangfireDashboard(options:new DashboardOptions()
            {
                Authorization = Enumerable.Empty<IDashboardAuthorizationFilter>()
            });

            app.UseMvc();

            app.UseSwagger(c =>
            {
                c.RouteTemplate = "docs/{documentName}/docs.json";
            });
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/docs/v1/docs.json", "Multiseller.io v1 api");
                c.RoutePrefix = "docs";
                c.InjectStylesheet("/css/doc.css");
            });
        }
    }
}
