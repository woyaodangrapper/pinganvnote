using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System.IO;

namespace blog_generated_articles
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            //注册Swagger生成器，定义一个和多个Swagger 文档
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Taoist.Archives", Version = "v1" });
                //Determine base path for the application.  
                //var basePath = Path.GetDirectoryName(typeof(Program).Assembly.Location);
                //Set the comments path for the swagger json and ui.  
                //var xmlPath = Path.Combine(basePath, "Temporary directory analysis.xml");
                //c.IncludeXmlComments(xmlPath);
            });


            {
                #region 跨域
                //services.AddCors(options =>
                //{
                //    options.AddPolicy(AllowSpecificOrigin,
                //        builder =>
                //        {
                //            builder.AllowAnyMethod()
                //                .AllowAnyOrigin()
                //                .AllowAnyHeader();
                //        });
                //});
                //10.6.201.4:8082

                //services
                //.AddCors(builder =>
                //{
                //    builder.AddDefaultPolicy(configure =>
                //    {
                //        configure.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                //    });
                //});


                services.AddCors(options =>
                {
                    options.AddPolicy(AllowSpecificOrigin,

                        builder => builder.AllowAnyOrigin()

                        .WithMethods("GET", "POST", "HEAD", "PUT", "DELETE", "OPTIONS")

                        );

                });

                #endregion
                //配置返回Json
                services.AddControllersWithViews().AddNewtonsoftJson();
            }


        }
        private readonly string AllowSpecificOrigin = "AllowSpecificOrigin";

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseSwagger();

            app.UseSwaggerUI();
            //app.UseSwaggerUI(c =>
            //{
            //    c.SwaggerEndpoint("/swagger/v3/swagger.json", "Taoist.Archives");
            //});


            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }


    }
}
