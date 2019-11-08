using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(IC2.Startup))]
namespace IC2
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
