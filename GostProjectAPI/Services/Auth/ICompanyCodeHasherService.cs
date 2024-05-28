namespace GostProjectAPI.Services.Auth
{
	public interface ICompanyCodeHasherService
	{
		public string Encode(int codeLenght);
	}
}
