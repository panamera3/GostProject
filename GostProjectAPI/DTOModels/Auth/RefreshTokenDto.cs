namespace GostProjectAPI.DTOModels.Auth
{
	public class RefreshTokenDto
	{
		public uint UserID { get; set; }
		public string RefreshToken { get; set; }
	}
}
