using System.Security.Cryptography;

namespace GostProjectAPI.Services.Auth
{
	public class SHA256CompanyCodeHasherService : ICompanyCodeHasherService
	{
		public string Encode(int codeLenght)
		{
			var randomBytes = new byte[codeLenght*2];
			RandomNumberGenerator.Create().GetBytes(randomBytes);
			byte[] hash = SHA256.Create().ComputeHash(randomBytes);
			return Convert.ToHexString(hash)[..codeLenght];
		}
	}
}
