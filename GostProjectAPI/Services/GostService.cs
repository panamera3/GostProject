using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using GostProjectAPI.Data;
using GostProjectAPI.Data.Entities;
using GostProjectAPI.DTOModels;
using GostProjectAPI.DTOModels.Gosts;
using GostProjectAPI.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Office.Interop.Word;
using System.ComponentModel.Design;
using System.Data;
using System.Linq.Expressions;
using System.Reflection;
using UglyToad.PdfPig;

namespace GostProjectAPI.Services
{
	public class GostService
	{
		private readonly IMapper _mapper;
		private readonly GostDBContext _dbContext;
		private readonly KeysService _keysService;
		private readonly CurrentUserService _currentUserService;

		private readonly IAmazonS3 _s3Client;

		public GostService(GostDBContext dbContext, IMapper mapper, KeysService keysService, IAmazonS3 s3Client, CurrentUserService currentUserService)
		{
			_dbContext = dbContext;
			_mapper = mapper;
			_keysService = keysService;

			_s3Client = s3Client;
			_currentUserService = currentUserService;
		}

		public async Task<List<Gost>?> GetGostsAsync()
		{
			var companyId = _currentUserService.CompanyId;
			//var gosts = await _dbContext.Gosts.Where(g => g.AcceptanceLevel != AcceptanceLevel.Local || g.DeveloperId == companyId).ToListAsync();
			var gosts = await _dbContext.Gosts.Where(g => g.DeveloperId == companyId).ToListAsync();
			return gosts;
		}

		public async Task<List<Gost>?> GetGostsRangeAsync(GetGostsInRangeDto getGostsInRangeDto)
		{
			var gosts = (await GetGostsAsync()).Where(g => getGostsInRangeDto.GostIDs.Contains(g.ID)).ToList();
			return gosts;
		}

		public async Task<PagedList<Gost>> GetGostsAsync(GetGostsDto getParams)
		{
			var companyId = _currentUserService.CompanyId;
			var gosts = (await GetGostsAsync()).AsQueryable();

			// var filteredByCompanyGosts = gosts.Where(g => g.AcceptanceLevel != AcceptanceLevel.Local || g.DeveloperId == getParams.CompanyID);
			var filteredByCompanyGosts = gosts.Where(g => g.DeveloperId == companyId).Where(g => g.IsArchived == getParams.Archived);

			var filteredGosts = filteredByCompanyGosts;

			if (getParams?.Filter?.Designation is not null)
			{
				filteredGosts = filteredGosts.Where(o => o.Designation.Contains(getParams.Filter.Designation)).AsQueryable();
			}
			if (getParams?.Filter?.Denomination is not null)
			{
				filteredGosts = filteredGosts.Where(o => o.Denomination.Contains(getParams.Filter.Denomination)).AsQueryable();
			}
			if (getParams?.Filter?.OKSCode is not null)
			{
				filteredGosts = filteredGosts.Where(o => o.OKSCode.Contains(getParams.Filter.OKSCode)).AsQueryable();
			}
			if (getParams?.Filter?.OKPDCode is not null)
			{
				filteredGosts = filteredGosts.Where(o => o.OKPDCode.Contains(getParams.Filter.OKPDCode)).AsQueryable();
			}
			if (getParams?.Filter?.Text is not null)
			{
				filteredGosts = filteredGosts.Where(o => o.Text.Contains(getParams.Filter.Text)).AsQueryable();
			}
			if (getParams?.Filter?.Content is not null)
			{
				filteredGosts = filteredGosts.Where(o => o.Content.Contains(getParams.Filter.Content)).AsQueryable();
			}
			if (getParams?.Filter?.DeveloperName is not null)
			{
				filteredGosts = filteredGosts.Where(o => o.DeveloperName.Contains(getParams.Filter.DeveloperName)).AsQueryable();
			}
			if (getParams?.Filter?.AcceptanceLevel is not null)
			{
				filteredGosts = filteredGosts.Where(o => o.AcceptanceLevel == getParams.Filter.AcceptanceLevel).AsQueryable();
			}
			if (getParams?.Filter?.ActionStatus is not null)
			{
				filteredGosts = filteredGosts.Where(o => o.ActionStatus == getParams.Filter.ActionStatus).AsQueryable();
			}
			if (getParams?.Filter?.GostIdReplaced is not null)
			{
				filteredGosts = filteredGosts.Where(o => o.GostIdReplaced == getParams.Filter.GostIdReplaced).AsQueryable();
			}
			if (getParams?.Filter?.AcceptanceYear is not null)
			{
				filteredGosts = filteredGosts.Where(o => o.AcceptanceYear == getParams.Filter.AcceptanceYear).AsQueryable();
			}
			if (getParams?.Filter?.IntrodutionYear is not null)
			{
				filteredGosts = filteredGosts.Where(o => o.IntrodutionYear == getParams.Filter.IntrodutionYear).AsQueryable();
			}
			if (getParams?.Filter?.Keywords?.Any() == true)
			{
				filteredGosts = filteredGosts.Where(g => _dbContext.Keywords.Any(kw => kw.GostId == g.ID && getParams.Filter.Keywords.Contains(kw.Name))).AsQueryable();
			}
			if (getParams?.Filter?.Keyphrases?.Any() == true)
			{
				filteredGosts = filteredGosts.Where(g => _dbContext.Keyphrases.Any(kw => kw.GostId == g.ID && getParams.Filter.Keyphrases.Contains(kw.Name))).AsQueryable();
			}


			var sortedGosts = filteredGosts.ToList().AsQueryable();

			if (getParams.SortField != null)
			{
				PropertyInfo propertyInfo = typeof(Gost).GetProperty(getParams.SortField, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);

				var parameter = Expression.Parameter(typeof(Gost), "g");
				var property = Expression.Property(parameter, propertyInfo);
				var convertedProperty = Expression.Convert(property, typeof(object));
				var lambda = Expression.Lambda<Func<Gost, object>>(convertedProperty, parameter);

				sortedGosts = getParams.SortDirection switch
				{
					"DESC" => sortedGosts.OrderByDescending(lambda).AsQueryable(),
					_ => sortedGosts.OrderBy(lambda).AsQueryable()
				};
			}

			var searchedGosts = sortedGosts;
			var foundGosts = new List<Gost>();

			if (getParams?.SearchInFilePrompt != null)
			{
				var searchPrompt = getParams.SearchInFilePrompt;

				foreach (var gost in searchedGosts)
				{
					var gostFile = await _dbContext.GostFiles.FirstOrDefaultAsync(gf => gf.GostId == gost.ID);
					var isWordInFile = false;

					if (gostFile == null)
						continue;

					isWordInFile = Path.GetExtension(gostFile.Path) switch
					{
						".pdf" => await SearchInPdfFileAsync(gostFile.Path, searchPrompt),
						var extension when extension == ".docx" || extension == ".doc" => await SearchInWordFileAsync(gostFile.Path, searchPrompt)
					};

					if (isWordInFile)
						foundGosts.Add(gost);
				}

				searchedGosts = foundGosts.AsQueryable();
			}

			var pagedGosts = await searchedGosts.ToPagedListAsync(getParams.Pagination);

			return pagedGosts;
		}

		public async Task<GostFile> AddFileToGostAsync(IFormFile gostFile, uint gostID)
		{
			var config = new AmazonS3Config
			{
				ServiceURL = "https://s3.timeweb.cloud",
				AuthenticationRegion = "ru-1",
			};
			var s3Client = new AmazonS3Client("OEROXDNUP3Q8L16FYNMV", "SJwow3RoWBjQ5CAKqF7tfe5FLOs1ucKTs9jdJNsI", config);

			string bucketName = "66f0e91a-gost_storage";
			string fileExtension = Path.GetExtension(gostFile.FileName);
			string fileName = Path.GetFileNameWithoutExtension(gostFile.FileName);
			string uniqueIdentifier = Guid.NewGuid().ToString()[..8];
			string keyName = $"{fileName}_{uniqueIdentifier}{fileExtension}";

			var existingFile = await _dbContext.GostFiles
				.Where(f => f.Path.Contains(keyName))
				.FirstOrDefaultAsync();

			if (existingFile != null)
			{
				uniqueIdentifier = Guid.NewGuid().ToString()[..8];
				keyName = $"{fileName}_{uniqueIdentifier}{fileExtension}";
			}

			using (var newMemoryStream = new MemoryStream())
			{
				await gostFile.CopyToAsync(newMemoryStream);
				newMemoryStream.Position = 0;

				var uploadRequest = new TransferUtilityUploadRequest
				{
					InputStream = newMemoryStream,
					Key = keyName,
					BucketName = bucketName,
					ContentType = gostFile.ContentType
				};

				var fileTransferUtility = new TransferUtility(s3Client);
				await fileTransferUtility.UploadAsync(uploadRequest);
			}

			var path = $"https://s3.timeweb.cloud/{bucketName}/{keyName}";

			var gostFileEntity = new GostFile
			{
				Path = path,
				GostId = gostID
			};

			await _dbContext.GostFiles.AddAsync(gostFileEntity);
			await _dbContext.SaveChangesAsync();

			return gostFileEntity;

			/*
			для добавления не в бакет, а в локальную папку

			string filePath = _env.IsDevelopment() ? _fileUploadPaths.Global : _fileUploadPaths.Local;
			string path = Path.Join(filePath, gostFile.FileName);
			using var fileStream = new FileStream(path, FileMode.Create);
			await gostFile.CopyToAsync(fileStream);


			var gostFileEntity = new GostFile
			{
				Path = path,
				GostId = gostID
			};

			await _dbContext.GostFiles.AddAsync(gostFileEntity);
			await _dbContext.SaveChangesAsync();

			return gostFileEntity;
			*/
		}

		private async System.Threading.Tasks.Task DeleteFileFromGostAsync(uint gostID)
		{
			var config = new AmazonS3Config
			{
				ServiceURL = "https://s3.timeweb.cloud",
				AuthenticationRegion = "ru-1",
			};
			var s3Client = new AmazonS3Client("OEROXDNUP3Q8L16FYNMV", "SJwow3RoWBjQ5CAKqF7tfe5FLOs1ucKTs9jdJNsI", config);

			string bucketName = "66f0e91a-gost_storage";

			var existingFile = await _dbContext.GostFiles
				.Where(f => f.GostId == gostID)
				.FirstOrDefaultAsync();

			if (existingFile != null)
			{
				var deleteRequest = new DeleteObjectRequest
				{
					BucketName = bucketName,
					Key = existingFile.Path[(existingFile.Path.LastIndexOf('/') + 1)..]
				};
				await s3Client.DeleteObjectAsync(deleteRequest);

				_dbContext.GostFiles.Remove(existingFile);
				await _dbContext.SaveChangesAsync();
			}
		}

		public async Task<GostFile?> ChangeFileToGostAsync(IFormFile file, uint gostID)
		{
			var existingFile = await _dbContext.GostFiles
				.Where(f => f.GostId == gostID)
				.FirstOrDefaultAsync();

			if (existingFile == null)
			{
				return await AddFileToGostAsync(file, gostID);
			}
			else
			{
				await DeleteFileFromGostAsync(gostID);
				return await AddFileToGostAsync(file, gostID);
			}
		}

		private async Task<bool> SearchInWordFileAsync(string documentLocation, string stringToSearchFor, bool caseSensitive = false)
		{
			try
			{
				var winword = new Application();
				var wordDoc = winword.Documents.Open(documentLocation, ReadOnly: true);

				bool result;
				if (caseSensitive)
					result = wordDoc.Content.Text.Contains(stringToSearchFor, StringComparison.CurrentCulture);
				else
					result = wordDoc.Content.Text.Contains(stringToSearchFor, StringComparison.CurrentCultureIgnoreCase);

				wordDoc.Close();
				winword.Quit();

				return result;
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Произошла ошибка поиска в Word файле: {ex.Message}");
				return false;
			}
		}

		public static async Task<bool> SearchInPdfFileAsync(string url, string searchText)
		{
			string tempFilePath = Path.GetTempFileName();

			using (HttpClient client = new())
			{
				var response = await client.GetAsync(url);
				response.EnsureSuccessStatusCode();

				using var fs = new FileStream(tempFilePath, FileMode.Create, FileAccess.Write, FileShare.None);
				await response.Content.CopyToAsync(fs);
			}

			try
			{
				using var pcontent = PdfDocument.Open(tempFilePath);
				string rawText = pcontent.GetPages().Aggregate("", (acc, curr) => acc += curr.Text);

				return rawText.Contains(searchText);
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error opening PDF file: {ex.Message}");
				return false;
			}
			finally
			{
				if (File.Exists(tempFilePath))
				{
					File.Delete(tempFilePath);
				}
			}
		}

		public async Task<Gost?> GetGostAsync(uint gostID)
		{
			return await _dbContext.Gosts.FirstOrDefaultAsync(g => g.ID == gostID);
		}

		public async Task<GostWithKeysAndReferences?> GetFullGostAsync(uint gostID)
		{
			Gost gost = await _dbContext.Gosts.FirstOrDefaultAsync(g => g.ID == gostID);
			List<Keyword> keywords = await _keysService.GetKeyWordsAsync(gostID);
			List<Keyphrase> keyphrases = await _keysService.GetKeyPhrasesAsync(gostID);
			List<NormativeReference> normativeReferences = await GetNormativeReferencesAsync(gostID);
			GostWithKeysAndReferences gostWithKeysAndReferences = new() { Gost = gost, Keywords = keywords, Keyphrases = keyphrases, NormativeReferences = normativeReferences };
			return gostWithKeysAndReferences;
		}

		public async Task<string?> GetGostNameAsync(uint gostID)
		{
			return (await _dbContext.Gosts.FirstOrDefaultAsync(g => g.ID == gostID)).Designation;
		}

		public async Task<Gost?> AddGostAsync(GostAddDto gostAddDto)
		{
			var gost = _mapper.Map<GostAddDto, Gost>(gostAddDto);

			if (gost == null)
				return null;

			var companyId = _currentUserService.CompanyId;
			gost.DeveloperId = companyId;

			await _dbContext.Gosts.AddAsync(gost);
			await _dbContext.SaveChangesAsync();

			List<NormativeReference> normativeReferences = new();
			foreach (var normativeReferenceValue in gostAddDto.NormativeReferences)
			{
				NormativeReference normativeReference = new();

				if (uint.TryParse(normativeReferenceValue, out uint referenceId))
				{
					normativeReference.ReferenceGostId = referenceId;
					normativeReference.ReferenceGostDesignation = null; 
				}
				else
				{
					normativeReference.ReferenceGostDesignation = normativeReferenceValue;
					normativeReference.ReferenceGostId = null;
				}

				normativeReference.RootGostId = gost.ID;
				normativeReferences.Add(normativeReference);
			}
			await _dbContext.NormativeReferences.AddRangeAsync(normativeReferences);
			await _dbContext.SaveChangesAsync();

			List<Keyword> keywords = new();
			foreach (var keywordValue in gostAddDto.Keywords)
			{
				var keyword = new Keyword { Name = keywordValue, GostId = gost.ID };
				keywords.Add(keyword);
			}
			keywords.ForEach(async keyword =>
			{
				await _dbContext.Keywords.AddAsync(keyword);
			});
			await _dbContext.SaveChangesAsync();

			List<Keyphrase> keyphrases = new();
			foreach (var keyphraseValue in gostAddDto.Keyphrases)
			{
				var keyphrase = new Keyphrase { Name = keyphraseValue, GostId = gost.ID };
				keyphrases.Add(keyphrase);
			}
			keyphrases.ForEach(async keyphrase =>
			{
				await _dbContext.Keyphrases.AddAsync(keyphrase);
			});
			await _dbContext.SaveChangesAsync();

			return gost;
		}

		public async Task<Gost?> EditGostAsync(GostEditDto gostEditDto)
		{
			var oldGost = await GetGostAsync(gostEditDto.ID);

			if (oldGost == null)
				return null;

			foreach (var property in typeof(GostEditDto).GetProperties())
			{
				if (!property.Name.ToLower().Contains("key") && property.Name.ToLower() != "normativereferences")
				{
					var value = property.GetValue(gostEditDto);
					if (value != null && value.ToString() != "")
					{
						var gostProperty = oldGost.GetType().GetProperty(property.Name);
						gostProperty.SetValue(oldGost, value);
					}
					if (value != null && value.ToString() == "0")
					{
						var gostProperty = oldGost.GetType().GetProperty(property.Name);
						gostProperty.SetValue(oldGost, null);
					}
				}
			}

			_dbContext.Gosts.Update(oldGost);
			await _dbContext.SaveChangesAsync();

			if (oldGost.GostIdReplaced.HasValue)
			{
				var replacedGost = await GetGostAsync(oldGost.GostIdReplaced.Value);
				if (replacedGost != null)
				{
					replacedGost.ActionStatus = Data.Enums.Gost.ActionStatus.Replaced;
					_dbContext.Gosts.Update(replacedGost);
					await _dbContext.SaveChangesAsync();
				}
			}

			if (gostEditDto.Keywords != null)
			{
				var existingKeywords = await _dbContext.Keywords.Where(k => k.GostId == gostEditDto.ID).ToListAsync();
				_dbContext.Keywords.RemoveRange(existingKeywords.Where(k => !gostEditDto.Keywords.Contains(k.Name)));

				foreach (var keyword in gostEditDto.Keywords)
				{
					if (!await _dbContext.Keywords.AnyAsync(k => k.Name == keyword && k.GostId == gostEditDto.ID))
					{
						await _dbContext.Keywords.AddAsync(new Keyword { Name = keyword, GostId = gostEditDto.ID });
					}
				}
			}

			if (gostEditDto.Keyphrases != null)
			{
				var existingKeyphrases = await _dbContext.Keyphrases.Where(k => k.GostId == gostEditDto.ID).ToListAsync();
				_dbContext.Keyphrases.RemoveRange(existingKeyphrases.Where(k => !gostEditDto.Keyphrases.Contains(k.Name)));

				foreach (var keyphrase in gostEditDto.Keyphrases)
				{
					if (!await _dbContext.Keyphrases.AnyAsync(k => k.Name == keyphrase && k.GostId == gostEditDto.ID))
					{
						await _dbContext.Keyphrases.AddAsync(new Keyphrase { Name = keyphrase, GostId = gostEditDto.ID });
					}
				}
			}

			if (gostEditDto.NormativeReferences != null)
			{
				var existingReferences = await _dbContext.NormativeReferences
					.Where(r => r.RootGostId == gostEditDto.ID)
					.ToListAsync();

				_dbContext.NormativeReferences.RemoveRange(existingReferences
					.Where(r => !gostEditDto.NormativeReferences.Contains(r.ReferenceGostId?.ToString())
								 && !gostEditDto.NormativeReferences.Contains(r.ReferenceGostDesignation)));

				foreach (var reference in gostEditDto.NormativeReferences)
				{
					var isId = uint.TryParse(reference, out uint referenceGostId);

					if (!await _dbContext.NormativeReferences.AnyAsync(r =>
						(r.ReferenceGostId == referenceGostId && r.RootGostId == gostEditDto.ID) ||
						(r.ReferenceGostDesignation == reference && r.RootGostId == gostEditDto.ID)))
					{
						if (isId)
						{
							await _dbContext.NormativeReferences.AddAsync(new NormativeReference
							{
								ReferenceGostId = referenceGostId,
								RootGostId = gostEditDto.ID
							});
						}
						else
						{
							await _dbContext.NormativeReferences.AddAsync(new NormativeReference
							{
								ReferenceGostDesignation = reference,
								RootGostId = gostEditDto.ID
							});
						}
					}
				}
			}

			await _dbContext.SaveChangesAsync();

			PropertyInfo[] properties = typeof(GostEditDto).GetProperties();
			List<UpdateGostDate> updatedFields = new();

			foreach (var property in properties)
			{
				if (property.GetValue(gostEditDto) != null && property.Name != "ID")
				{
					UpdateGostDate updateField = new()
					{
						UpdateDate = DateTime.Now,
						Name = property.Name,
						GostId = gostEditDto.ID
					};

					updatedFields.Add(updateField);
				}
			}

			_dbContext.UpdateGostDates.AddRange(updatedFields);
			await _dbContext.SaveChangesAsync();

			return oldGost;
		}

		public async Task<bool> TryDeleteGostAsync(uint gostID)
		{
			var gost = await GetGostAsync(gostID);

			if (gost == null)
				return false;

			_dbContext.Gosts.Remove(gost);
			await _dbContext.SaveChangesAsync();
			return true;
		}

		public async Task<List<Gost>?> GetFavouritesGostsAsync(uint userID)
		{
			var favouritesGosts = await _dbContext.FavouritesGosts.Where(g => g.UserId == userID).Select(g => g.GostId).ToListAsync();
			var allGosts = await _dbContext.Gosts.Where(g => favouritesGosts.Contains(g.ID)).ToListAsync();
			return allGosts;
		}

		public async Task<PagedList<Gost>?> GetFavouritesGostsListAsync(GetFavouriteGostsDto getParams)
		{
			var favouritesGostIds = await _dbContext.FavouritesGosts
				.Where(fg => fg.UserId == getParams.UserId)
				.Select(fg => fg.GostId)
				.ToListAsync();

			var allGosts = await _dbContext.Gosts
				.Where(g => favouritesGostIds.Contains(g.ID))
				.ToPagedListAsync(getParams.Pagination);

			return allGosts;
		}


		public async Task<FavouriteGost?> AddFavouriteGostAsync(uint gostID, uint userID)
		{
			var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.ID == userID);
			var favouriteGost = new FavouriteGost() { GostId = gostID, UserId = userID };
			_dbContext.FavouritesGosts.Add(favouriteGost);
			await _dbContext.SaveChangesAsync();

			return favouriteGost;
		}

		public async Task<FavouriteGost?> GetFavouriteGostAsync(uint gostID, uint userID)
		{
			return await _dbContext.FavouritesGosts.FirstOrDefaultAsync(g => g.UserId == userID && g.GostId == gostID);
		}

		public async Task<bool> TryDeleteFavouriteGostAsync(uint gostID, uint userID)
		{
			var favouriteGost = await GetFavouriteGostAsync(gostID, userID);

			if (favouriteGost == null)
				return false;

			_dbContext.FavouritesGosts.Remove(favouriteGost);
			await _dbContext.SaveChangesAsync();
			return true;
		}

		public async Task<FavouriteAndArchivedGostDto> CheckFavouriteAndArchiveGostAsync(uint userID, uint gostID)
		{
			bool isFavourite = await _dbContext.FavouritesGosts.AnyAsync(f => f.UserId == userID && f.GostId == gostID);
			bool isArchived = await _dbContext.Gosts.AnyAsync(g => g.ID == gostID && g.IsArchived == true);
			var response = new FavouriteAndArchivedGostDto { IsArchived = isArchived, IsFavourite = isFavourite };
			return response;
		}

		public async Task<Gost> AddRequestAsync(uint gostID)
		{
			var newGost = await GetGostAsync(gostID);

			if (newGost != null)
			{
				newGost.RequestsNumber += 1;

				_dbContext.Gosts.Update(newGost);
				await _dbContext.SaveChangesAsync();

				return newGost;
			}

			return null;
		}

		public async Task<Gost?> ArchiveGostAsync(uint gostID, bool isArchived)
		{
			var oldGost = await GetGostAsync(gostID);
			if (oldGost == null)
				return null;

			oldGost.IsArchived = isArchived;
			_dbContext.Gosts.Update(oldGost);
			await _dbContext.SaveChangesAsync();

			return oldGost;
		}

		public async Task<List<UpdateGostDate>> GetUpdateGostDate(uint gostID)
		{
			var updateGostDates = await _dbContext.UpdateGostDates.Where(g => g.GostId == gostID).ToListAsync();
			return updateGostDates;
		}

		public async Task<List<NormativeReference>> GetNormativeReferencesAsync(uint gostID)
		{
			var updateGostDates = await _dbContext.NormativeReferences.Where(g => g.RootGostId == gostID).ToListAsync();
			return updateGostDates;
		}

		public async Task<List<DataForNormativeReference>> GetDataForNormativeReferencesAsync(uint companyID, uint? gostID)
		{
			var dataForNormativeReference = await _dbContext.Gosts
				.Where(g => g.DeveloperId == companyID)
				.Select(g => new DataForNormativeReference { ID = g.ID, Designation = g.Designation })
				.ToListAsync();

			if (gostID.HasValue)
			{
				dataForNormativeReference = dataForNormativeReference.Where(g => g.ID != gostID.Value).ToList();
			}

			return dataForNormativeReference;
		}

		public async Task<GostFile> GetGostFileAsync(uint gostID)
		{
			var gostFile = await _dbContext.GostFiles.FirstOrDefaultAsync(gf => gf.GostId == gostID);
			return gostFile;
		}
	}
}
