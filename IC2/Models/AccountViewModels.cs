using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace IC2.Models
{

    public class ExternalLoginConfirmationViewModel
    {
        [Required]
        [Display(Name = "Nombre de usuario")]
        public string UserName { get; set; }
    }

    public class ManageUserViewModel
    {
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Contraseña actual")]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "El número de caracteres de {0} debe ser al menos {2}.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Nueva contraseña")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirmar la nueva contraseña")]
        [Compare("NewPassword", ErrorMessage = "La nueva contraseña y la contraseña de confirmación no coinciden.")]
        public string ConfirmPassword { get; set; }
    }

    public class LoginViewModel
    {
        [Required]
        [Display(Name = "Nombre de usuario")]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Contraseña")]
        public string Password { get; set; }

        [Display(Name = "¿Recordar cuenta?")]
        public bool RememberMe { get; set; }
    }

    public class RegisterViewModel
    {
        [Required]
        [Display(Name = "Nombre de usuario")]
        public string UserName { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "El número de caracteres de {0} debe ser al menos {2}.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Contraseña")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirmar contraseña")]
        [Compare("Password", ErrorMessage = "La contraseña y la contraseña de confirmación no coinciden.")]
        public string ConfirmPassword { get; set; }
    }
    public class LoginViewModels
    {
        ICPruebaEntities db = new ICPruebaEntities();
        public List<LoginViewModel> loginViewModels { get; set; }
        public LoginViewModels()
        {
            loginViewModels = new List<LoginViewModel>();
            loginViewModels.Add(new LoginViewModel()
            {
                UserName = "MRN14015",
                Password = "@Karla200"
            });
            loginViewModels.Add(new LoginViewModel()
            {
                UserName = "LDI200",
                Password = "@LDI200"
            });
            loginViewModels.Add(new LoginViewModel()
            {
                UserName = "MVN200",
                Password = "@MVN200"
            });
            loginViewModels.Add(new LoginViewModel()
            {
                UserName = "ROM200",
                Password = "@ROM200"
            });
        }

    }
}
