using System.IO;
using System.Security.Cryptography;

namespace GostProjectAPI.Services.Auth
{
	public class TokenEncryptionService
	{
		private readonly byte[] _key;
		private readonly byte[] _iv;

		public TokenEncryptionService()
		{
			byte[] key = Convert.FromBase64String("JblxZkw7QWUzfFvmDNjeeaW1usiD73EBjH527YpmOVY=");
			byte[] iv = Convert.FromBase64String("PhuIe6IC1I3Be3UYrTxLiw==");

			_key = key;
			_iv = iv;
		}

		public string Encrypt(string plainText)
		{
			using (var aes = Aes.Create())
			{
				aes.Key = _key;
				aes.IV = _iv;

				var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
				using var ms = new MemoryStream();
				using var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write);
				using (var writer = new StreamWriter(cs))
				{
					writer.Write(plainText);
				}
				return Convert.ToBase64String(ms.ToArray());
			}
		}

		public string Decrypt(string cipherText)
		{
			using (var aes = Aes.Create())
			{
				aes.Key = _key;
				aes.IV = _iv;

				var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
				using var ms = new MemoryStream(Convert.FromBase64String(cipherText));
				using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
				using var reader = new StreamReader(cs);
				return reader.ReadToEnd();
			}
		}
	}
}
