using System;
using System.Collections.Generic;
using System.Text;
using MultiSellerIo.Core.Enum;

namespace MultiSellerIo.Services.User.Core
{
    public class UpdateProfileData
    {
        public string Username { get; set; }
        public string ProfileImage { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public Gender Gender { get; set; }
    }
}
