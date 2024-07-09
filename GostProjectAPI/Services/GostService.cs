﻿using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using GostProjectAPI.Data;
using GostProjectAPI.Data.Entities;
using GostProjectAPI.Data.Enums.Gost;
using GostProjectAPI.DTOModels;
using GostProjectAPI.DTOModels.Gosts;
using GostProjectAPI.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.Office.Interop.Word;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using UglyToad.PdfPig;

namespace GostProjectAPI.Services
{
	public class GostService
	{
		private readonly IMapper _mapper;
		private readonly GostDBContext _dbContext;
		private readonly FileUploadPaths _fileUploadPaths;
		private readonly IWebHostEnvironment _env;
		private readonly KeysService _keysService;

		private readonly IAmazonS3 _s3Client;

		public GostService(GostDBContext dbContext, IMapper mapper, IOptions<FileUploadPaths> fileUploadPaths, IWebHostEnvironment env, KeysService keysService, IAmazonS3 s3Client)
		{
			_dbContext = dbContext;
			_mapper = mapper;
			_fileUploadPaths = fileUploadPaths.Value;
			_env = env;
			_keysService = keysService;

			_s3Client = s3Client;
		}

		public async Task<List<Gost>?> GetGostsAsync(uint companyID)
		{
			//var gosts = await _dbContext.Gosts.Where(g => g.AcceptanceLevel != AcceptanceLevel.Local || g.DeveloperId == companyID).ToListAsync();
			var gosts = await _dbContext.Gosts.Where(g => g.DeveloperId == companyID).ToListAsync();
			return gosts;
		}

		public async Task<List<Gost>?> GetGostsRangeAsync(GetGostsInRangeDto getGostsInRangeDto)
		{
			var gosts = await _dbContext.Gosts.Where(g => getGostsInRangeDto.GostIDs.Contains(g.ID)).ToListAsync();
			return gosts;
		}

		public async Task<PagedList<Gost>> GetGostsAsync(GetGostsDto getParams)
		{
			var gosts = _dbContext.Gosts.AsQueryable();

			// var filteredByCompanyGosts = gosts.Where(g => g.AcceptanceLevel != AcceptanceLevel.Local || g.DeveloperId == getParams.CompanyID);
			var filteredByCompanyGosts = gosts.Where(g => g.DeveloperId == getParams.CompanyID);

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
			if (getParams?.Filter?.KeywordsIds?.Any() == true)
			{
				filteredGosts = filteredGosts.Where(g => _dbContext.Keywords.Any(kw => kw.GostId == g.ID && getParams.Filter.KeywordsIds.Contains(kw.ID))).AsQueryable();
			}
			if (getParams?.Filter?.KeyphrasesIds?.Any() == true)
			{
				filteredGosts = filteredGosts.Where(g => _dbContext.Keyphrases.Any(kw => kw.GostId == g.ID && getParams.Filter.KeyphrasesIds.Contains(kw.ID))).AsQueryable();
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
						".pdf" => SearchInPdfFile(gostFile.Path, searchPrompt),
						var extension when extension == ".docx" || extension == ".doc" => SearchInWordFile(gostFile.Path, searchPrompt)
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

			string bucketName = "66f0e91a-object-storage";
			string keyName = $"UrFU/{gostFile.FileName}";

			// Check if the file already exists in the database
			var existingFile = await _dbContext.GostFiles
				.Where(f => f.Path.Contains(keyName))
				.FirstOrDefaultAsync();

			if (existingFile != null)
			{
				// If the file exists, append a unique identifier to the file name
				var uniqueIdentifier = Guid.NewGuid().ToString().Substring(0, 8);
				keyName += $"_{uniqueIdentifier}";
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


			// всё это поменять на запрос в бакет

			// в этой дирекктории создать папку и в эту папку кидать
			// Environment.CurrentDirectory

			/*

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

		private bool SearchInWordFile(string documentLocation, string stringToSearchFor, bool caseSensitive = false)
		{
			// Create an application object if the passed in object is null
			var winword = new Application();

			// Use the application object to open our word document in ReadOnly mode
			var wordDoc = winword.Documents.Open(documentLocation, ReadOnly: true);

			// Search for our string in the document
			bool result;
			if (caseSensitive)
				result = wordDoc.Content.Text.IndexOf(stringToSearchFor) >= 0;
			else
				result = wordDoc.Content.Text.IndexOf(stringToSearchFor, StringComparison.CurrentCultureIgnoreCase) >= 0;

			// Close the document and the application since we're done searching
			wordDoc.Close();
			winword.Quit();

			return result;
		}

		public static bool SearchInPdfFile(string pdfFilePath, string searchText)
		{
			using var pcontent = PdfDocument.Open(pdfFilePath);

			string rawText = pcontent.GetPages().Aggregate("", (acc, curr) => acc += curr.Text);

			if (rawText.Contains(searchText))
				return true;

			return false;
		}

		public async Task<Gost?> GetGostAsync(uint gostID)
		{
			return await _dbContext.Gosts.FirstOrDefaultAsync(g => g.ID == gostID);
		}

		public async Task<GostWithKeys?> GetFullGostAsync(uint gostID)
		{
			Gost gost = await _dbContext.Gosts.FirstOrDefaultAsync(g => g.ID == gostID);
			List<Keyword> keywords = await _keysService.GetKeyWordsAsync(gostID);
			List<Keyphrase> keyphrases = await _keysService.GetKeyPhrasesAsync(gostID);
			GostWithKeys gostWithKeys = new() { Gost = gost, Keywords = keywords, Keyphrases = keyphrases };
			return gostWithKeys;
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

			await _dbContext.Gosts.AddAsync(gost);
			await _dbContext.SaveChangesAsync();

			List<Keyword> keywords = new();
			List<Keyphrase> keyphrases = new();

			// Преобразование Keywords в сущности Keyword
			foreach (var keywordValue in gostAddDto.Keywords)
			{
				var keyword = new Keyword { Name = keywordValue, GostId = gost.ID };
				keywords.Add(keyword);
			}

			// Преобразование Keyphrases в сущности Keyphrase
			foreach (var keyphraseValue in gostAddDto.Keyphrases)
			{
				var keyphrase = new Keyphrase { Name = keyphraseValue, GostId = gost.ID };
				keyphrases.Add(keyphrase);
			}

			keywords.ForEach(async keyword =>
			{
				await _dbContext.Keywords.AddAsync(keyword);
			});

			keyphrases.ForEach(async keyphrase =>
			{
				await _dbContext.Keyphrases.AddAsync(keyphrase);
			});

			List<NormativeReference> normativeReferences = new();
			foreach (var normativeReferenceValue in gostAddDto.NormativeReferences)
			{
				if (_dbContext.Gosts.Any(gost => gost.ID == normativeReferenceValue))
				{
					var normativeReference = new NormativeReference { ReferenceGostId = normativeReferenceValue, RootGostId = gost.ID };
					normativeReferences.Add(normativeReference);
				}
			}
			normativeReferences.ForEach(async normativeReference =>
			{
				await _dbContext.NormativeReferences.AddAsync(normativeReference);
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
				var value = property.GetValue(gostEditDto);
				if (value != null && value.ToString() != "")
				{
					var gostProperty = oldGost.GetType().GetProperty(property.Name);
					gostProperty.SetValue(oldGost, value);
				}
			}

			_dbContext.Gosts.Update(oldGost);
			await _dbContext.SaveChangesAsync();


			List<Keyword> keywords = new();
			List<Keyphrase> keyphrases = new();

			if (gostEditDto.Keywords != null)
			{
				// Преобразование Keywords в сущности Keyword
				foreach (var keywordValue in gostEditDto.Keywords)
				{
					var keyword = new Keyword { Name = keywordValue, GostId = gostEditDto.ID };
					keywords.Add(keyword);
				}
			}
			if (gostEditDto.Keyphrases != null)
			{
				// Преобразование Keyphrases в сущности Keyphrase
				foreach (var keyphraseValue in gostEditDto.Keyphrases)
				{
					var keyphrase = new Keyphrase { Name = keyphraseValue, GostId = gostEditDto.ID };
					keyphrases.Add(keyphrase);
				}
			}

			keywords.ForEach(async keyword =>
			{
				await _dbContext.Keywords.AddAsync(keyword);
			});
			keyphrases.ForEach(async keyphrase =>
			{
				await _dbContext.Keyphrases.AddAsync(keyphrase);
			});

			await _dbContext.SaveChangesAsync();

			// добавление даты актуализации
			PropertyInfo[] properties = typeof(GostEditDto).GetProperties();
			List<UpdateGostDate> updatedFields = new();

			foreach (var property in properties)
			{
				if (property.GetValue(gostEditDto) != null && property.Name != "ID")
				{
					UpdateGostDate updateField = new UpdateGostDate
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

		public async Task<bool> CheckFavouriteGostsAsync(uint userID, uint gostID)
		{
			var state = await _dbContext.FavouritesGosts.AnyAsync(f => f.UserId == userID && f.GostId == gostID);
			return state;
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

		public async Task<Gost> ArchiveGostAsync(uint gostID)
		{
			var oldGost = await GetGostAsync(gostID);

			if (oldGost == null) // || oldGost.OwnerID != user/company ID)
				return null;

			oldGost.IsArchived = true;
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

		public async Task<List<DataForNormativeReference>> GetDataForNormativeReferencesAsync(uint companyID)
		{
			var dataForNormativeReference = await _dbContext.Gosts.Where(g => g.DeveloperId == companyID).Select(g => new DataForNormativeReference { ID = g.ID, Designation = g.Designation }).ToListAsync();
			return dataForNormativeReference;
		}

		public async Task<GostFile> GetGostFileAsync(uint gostID)
		{
			var gostFile = await _dbContext.GostFiles.FirstOrDefaultAsync(gf => gf.GostId == gostID);
			return gostFile;
		}
	}
}
